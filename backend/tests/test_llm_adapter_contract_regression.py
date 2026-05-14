import os

import pytest
from pydantic import ValidationError

from app.core.models import (
    AirspaceConstraint,
    DataSourceType,
    DroneState,
    EnvironmentState,
    RiskLevel,
)
from app.core.rules import SafetyRuleConfig, evaluate_hard_constraints
from app.integrations.llm import (
    ConstraintQuestionDraft,
    ExplanationDraft,
    LLMDecisionBoundary,
    LLMFailureMode,
    LLMProviderError,
    LLMUsagePolicy,
    MockLLMProvider,
    ReviewNarrativeDraft,
    TaskUnderstandingDraft,
)

SENSITIVE_MARKER = "sk-test-secret-should-not-leak"


def make_unsafe_environment_state() -> EnvironmentState:
    return EnvironmentState(
        source_type=DataSourceType.MOCK,
        weather_summary="mock unsafe windy weather",
        wind_speed_mps=9.2,
        visibility_level="fair",
        crowd_level=RiskLevel.HIGH,
        gps_quality="mock weak gps",
        gps_confidence=0.42,
        data_confidence=0.6,
    )


def make_unsafe_airspace_constraint() -> AirspaceConstraint:
    return AirspaceConstraint(
        source_type=DataSourceType.MOCK,
        is_flyable=False,
        approval_required=True,
        restricted_zones=["mock no-fly zone"],
        altitude_limit_m=80,
        compliance_risk_level=RiskLevel.CRITICAL,
        explanation="mock airspace is not flyable",
    )


def make_unsafe_drone_state() -> DroneState:
    return DroneState(
        source_type=DataSourceType.MOCK,
        drone_id="mock-unsafe-drone",
        model="mock model",
        battery_percent=30,
        estimated_endurance_minutes=12,
        return_to_home_battery_threshold=35,
        payloads=["wide camera"],
        link_quality=RiskLevel.HIGH,
        video_latency_ms=900,
        available_for_mission=True,
    )


def make_rule_config() -> SafetyRuleConfig:
    return SafetyRuleConfig(
        max_wind_speed_mps=8.0,
        min_battery_percent=35,
        min_gps_confidence=0.65,
        max_video_latency_ms=500,
        blocked_crowd_levels=[RiskLevel.HIGH, RiskLevel.CRITICAL],
        require_airspace_flyable=True,
        require_approval_when_needed=True,
    )


@pytest.mark.parametrize(
    ("draft", "expected_boundary"),
    [
        (
            MockLLMProvider().parse_task(
                "明天上午巡检南山区高层外立面，尽量避开行人。",
                context={},
            ),
            LLMDecisionBoundary.DRAFT,
        ),
        (
            MockLLMProvider().suggest_missing_constraints(
                TaskUnderstandingDraft(
                    provider="mock",
                    deterministic=True,
                    operation_object="high-rise facade",
                    missing_fields=["operation_area"],
                    safety_notes=["draft only"],
                ),
                context={},
            ),
            LLMDecisionBoundary.SUGGESTION,
        ),
        (
            MockLLMProvider().generate_human_explanation(
                {
                    "facts": ["wind_speed_mps=9.2"],
                    "inferences": ["hard rule blocks launch"],
                    "recommended_actions": ["pause mission"],
                    "human_confirmation_required": ["review blocked mission"],
                }
            ),
            LLMDecisionBoundary.EXPLANATION,
        ),
        (
            MockLLMProvider().summarize_review(
                {
                    "completion_rate": 0,
                    "data_quality_score": 50,
                    "uncovered_areas": ["blocked route"],
                    "makeup_flight_plan": ["retry only after compliance review"],
                }
            ),
            LLMDecisionBoundary.EXPLANATION,
        ),
    ],
)
def test_p1_m_048_mock_provider_outputs_keep_adapter_schema(
    draft: TaskUnderstandingDraft
    | ConstraintQuestionDraft
    | ExplanationDraft
    | ReviewNarrativeDraft,
    expected_boundary: LLMDecisionBoundary,
) -> None:
    payload = draft.model_dump(mode="json")

    assert payload["source_type"] == DataSourceType.MOCK
    assert payload["provider"] == "mock"
    assert payload["deterministic"] is True
    assert payload["boundary"] == expected_boundary
    assert payload["is_final_decision"] is False
    assert payload["requires_rule_validation"] is True
    assert "safety_notes" in payload


def test_p1_m_048_llm_output_cannot_override_failed_hard_constraints() -> None:
    hard_result = evaluate_hard_constraints(
        environment_state=make_unsafe_environment_state(),
        airspace_constraint=make_unsafe_airspace_constraint(),
        drone_state=make_unsafe_drone_state(),
        config=make_rule_config(),
    )
    provider = MockLLMProvider()

    draft = provider.generate_human_explanation(
        {
            "facts": ["mock LLM draft sees multiple unsafe conditions"],
            "inferences": ["hard constraints failed before any LLM wording is used"],
            "recommended_actions": ["do not launch; pause and request human review"],
            "human_confirmation_required": ["human safety responsible person must review"],
        }
    )

    assert hard_result.passed is False
    assert {check.rule_id for check in hard_result.checks if not check.passed} == {
        "hard-wind-speed",
        "hard-battery-margin",
        "hard-gps-confidence",
        "hard-video-latency",
        "hard-crowd-level",
        "hard-airspace-flyable",
    }
    assert draft.is_final_decision is False
    assert draft.requires_rule_validation is True
    assert draft.requires_human_review is True
    assert hard_result.passed is False


def test_p1_m_048_unsafe_llm_permissions_have_explicit_failure_reasons() -> None:
    with pytest.raises(ValidationError) as error_info:
        LLMUsagePolicy.model_validate(
            {
                "can_approve_flight": True,
                "can_override_hard_constraints": True,
                "can_bypass_human_review": True,
                "can_change_safety_thresholds": True,
            }
        )

    error_text = str(error_info.value)
    assert "cannot approve flight" in error_text


def test_p1_m_048_invalid_final_output_requires_fallback_and_human_review() -> None:
    with pytest.raises(ValidationError) as error_info:
        ExplanationDraft(
            provider="unsafe-provider",
            deterministic=False,
            is_final_decision=True,
            requires_rule_validation=False,
            recommended_actions=["launch despite failed hard constraints"],
        )

    error_text = str(error_info.value)
    fallback_error = LLMProviderError(
        LLMFailureMode.SAFETY_BOUNDARY_CONFLICT,
        f"Invalid LLM output requires fallback and human review: {error_text}",
    )

    assert fallback_error.failure_mode == LLMFailureMode.SAFETY_BOUNDARY_CONFLICT
    assert "fallback and human review" in str(fallback_error)
    assert "final safety decision" in str(fallback_error)


def test_p1_m_048_prompt_response_layer_does_not_leak_sensitive_configuration(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", SENSITIVE_MARKER)
    monkeypatch.setenv("SKYOPS_LLM_API_KEY", SENSITIVE_MARKER)
    provider = MockLLMProvider()

    outputs = [
        provider.parse_task("今晚安排一次园区安防巡逻。", context={}),
        provider.suggest_missing_constraints(TaskUnderstandingDraft(), context={}),
        provider.generate_human_explanation({"facts": ["mock facts"]}),
        provider.summarize_review({"completion_rate": 80, "data_quality_score": 85}),
    ]
    serialized_outputs = "\n".join(output.model_dump_json() for output in outputs)

    assert SENSITIVE_MARKER not in serialized_outputs
    assert os.environ["OPENAI_API_KEY"] == SENSITIVE_MARKER
