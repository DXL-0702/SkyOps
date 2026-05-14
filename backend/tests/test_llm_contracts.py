import pytest
from pydantic import ValidationError

from app.integrations.llm import (
    ConstraintQuestionDraft,
    ExplanationDraft,
    LLMDecisionBoundary,
    LLMFailureMode,
    LLMProvider,
    LLMProviderError,
    LLMUsagePolicy,
    ReviewNarrativeDraft,
    TaskUnderstandingDraft,
)


def test_llm_usage_policy_is_assistive_by_default() -> None:
    policy = LLMUsagePolicy()

    assert policy.can_parse_task is True
    assert policy.can_suggest_missing_constraints is True
    assert policy.can_generate_explanation is True
    assert policy.can_summarize_review is True
    assert policy.can_approve_flight is False
    assert policy.can_override_hard_constraints is False
    assert policy.can_bypass_human_review is False
    assert policy.can_change_safety_thresholds is False
    assert "LLM can suggest, but cannot approve flight." == policy.safety_statement
    assert LLMFailureMode.TIMEOUT in policy.fallback_failure_modes
    assert LLMFailureMode.INVALID_JSON in policy.fallback_failure_modes
    assert LLMFailureMode.SAFETY_BOUNDARY_CONFLICT in policy.fallback_failure_modes


@pytest.mark.parametrize(
    ("field_name", "expected_error"),
    [
        ("can_approve_flight", "cannot approve flight"),
        ("can_override_hard_constraints", "cannot override hard constraints"),
        ("can_bypass_human_review", "cannot bypass human review"),
        ("can_change_safety_thresholds", "cannot change safety thresholds"),
    ],
)
def test_llm_usage_policy_rejects_unsafe_permissions(
    field_name: str,
    expected_error: str,
) -> None:
    with pytest.raises(ValidationError, match=expected_error):
        LLMUsagePolicy.model_validate({field_name: True})


def test_task_understanding_output_is_draft_not_final_decision() -> None:
    draft = TaskUnderstandingDraft(
        operation_object="high-rise facade",
        operation_area="Nanshan mock block",
        operation_goals=["inspect facade task feasibility"],
        requested_time_window="tomorrow morning",
        risk_preference="safety first",
        safety_notes=["must be validated by hard safety rules"],
    )

    assert draft.boundary == LLMDecisionBoundary.DRAFT
    assert draft.is_final_decision is False
    assert draft.requires_rule_validation is True


def test_llm_draft_rejects_final_safety_decision_marker() -> None:
    with pytest.raises(ValidationError, match="must not be marked as a final"):
        TaskUnderstandingDraft(is_final_decision=True)


def test_llm_draft_requires_deterministic_rule_validation() -> None:
    with pytest.raises(ValidationError, match="must require deterministic rule validation"):
        ExplanationDraft(requires_rule_validation=False)


def test_constraint_question_output_is_suggestion() -> None:
    draft = ConstraintQuestionDraft(
        questions=["Is task splitting allowed?"],
        suggested_defaults={"route_mode": "conservative"},
    )

    assert draft.boundary == LLMDecisionBoundary.SUGGESTION
    assert draft.questions == ["Is task splitting allowed?"]
    assert draft.suggested_defaults["route_mode"] == "conservative"


def test_explanation_output_is_explanation_draft() -> None:
    draft = ExplanationDraft(
        facts=["wind_speed_mps=8.7"],
        inferences=["wind exceeds safety threshold"],
        recommended_actions=["pause mission"],
        human_confirmation_required=["review makeup flight"],
    )

    assert draft.boundary == LLMDecisionBoundary.EXPLANATION
    assert draft.recommended_actions == ["pause mission"]
    assert draft.human_confirmation_required == ["review makeup flight"]


def test_review_narrative_output_is_explanation_draft() -> None:
    draft = ReviewNarrativeDraft(
        completion_summary="Mock mission completed 70 percent of planned coverage.",
        risk_summary="Wind spike triggered conservative replanning.",
        makeup_flight_summary="Upper facade segment requires makeup flight.",
        next_optimization_summary="Use calmer wind window next time.",
    )

    assert draft.boundary == LLMDecisionBoundary.EXPLANATION
    assert draft.is_final_decision is False
    assert draft.requires_rule_validation is True


def test_llm_provider_protocol_documents_required_methods() -> None:
    expected_methods = {
        "parse_task",
        "suggest_missing_constraints",
        "generate_human_explanation",
        "summarize_review",
    }

    assert expected_methods <= set(LLMProvider.__dict__)


def test_llm_provider_error_preserves_failure_mode() -> None:
    error = LLMProviderError(
        LLMFailureMode.SAFETY_BOUNDARY_CONFLICT,
        "provider attempted to approve flight",
    )

    assert error.failure_mode == LLMFailureMode.SAFETY_BOUNDARY_CONFLICT
    assert "approve flight" in str(error)
