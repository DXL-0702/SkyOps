from app.core.models import DataSourceType
from app.integrations.llm import (
    MOCK_PROVIDER_NAME,
    LLMDecisionBoundary,
    MockLLMProvider,
)


def assert_mock_metadata(output: object, expected_boundary: LLMDecisionBoundary) -> None:
    assert output.source_type == DataSourceType.MOCK
    assert output.provider == MOCK_PROVIDER_NAME
    assert output.deterministic is True
    assert output.boundary == expected_boundary
    assert output.is_final_decision is False
    assert output.requires_rule_validation is True
    assert any("does not approve flight" in note for note in output.safety_notes)


def test_mock_llm_provider_parse_task_returns_stable_draft() -> None:
    provider = MockLLMProvider()
    raw_user_input = "明天上午巡检南山区一栋180米高办公楼外立面，尽量减少对行人的影响。"

    first_draft = provider.parse_task(raw_user_input, context={})
    second_draft = provider.parse_task(raw_user_input, context={})

    assert first_draft == second_draft
    assert_mock_metadata(first_draft, LLMDecisionBoundary.DRAFT)
    assert first_draft.operation_object == "high-rise building facade"
    assert first_draft.operation_area == "Shenzhen Nanshan mock operation area"
    assert first_draft.requested_time_window == "tomorrow morning"
    assert first_draft.risk_preference == "safety first"
    assert "minimize pedestrian safety impact" in first_draft.operation_goals
    assert first_draft.missing_fields == []


def test_mock_llm_provider_parse_task_marks_missing_fields_for_review() -> None:
    provider = MockLLMProvider()

    draft = provider.parse_task("安排一次任务", context={})

    assert_mock_metadata(draft, LLMDecisionBoundary.DRAFT)
    assert draft.operation_object is None
    assert draft.operation_area is None
    assert draft.requested_time_window is None
    assert draft.requires_human_review is True
    assert set(draft.missing_fields) == {
        "operation_object",
        "operation_area",
        "requested_time_window",
    }


def test_mock_llm_provider_suggest_missing_constraints_returns_suggestion() -> None:
    provider = MockLLMProvider()
    task = provider.parse_task("安排一次任务", context={})

    draft = provider.suggest_missing_constraints(task, context={})

    assert_mock_metadata(draft, LLMDecisionBoundary.SUGGESTION)
    assert draft.requires_human_review is True
    assert "请确认作业区域或边界范围。" in draft.questions
    assert "请确认期望执行时间窗口。" in draft.questions
    assert draft.suggested_defaults["route_mode"] == "conservative"
    assert draft.suggested_defaults["safety_priority"] == "safety_over_coverage"


def test_mock_llm_provider_generate_human_explanation_returns_explanation() -> None:
    provider = MockLLMProvider()

    draft = provider.generate_human_explanation(
        {
            "facts": ["wind_speed_mps=8.7"],
            "inferences": ["wind exceeds safety threshold"],
            "recommended_actions": ["pause mission"],
            "human_confirmation_required": ["review makeup flight"],
        }
    )

    assert_mock_metadata(draft, LLMDecisionBoundary.EXPLANATION)
    assert draft.facts == ["wind_speed_mps=8.7"]
    assert draft.inferences == ["wind exceeds safety threshold"]
    assert draft.recommended_actions == ["pause mission"]
    assert draft.human_confirmation_required == ["review makeup flight"]


def test_mock_llm_provider_generate_human_explanation_uses_safe_defaults() -> None:
    provider = MockLLMProvider()

    draft = provider.generate_human_explanation({})

    assert_mock_metadata(draft, LLMDecisionBoundary.EXPLANATION)
    assert draft.requires_human_review is True
    assert "Run hard-constraint validation before execution." in draft.recommended_actions
    assert draft.human_confirmation_required


def test_mock_llm_provider_summarize_review_returns_review_narrative() -> None:
    provider = MockLLMProvider()

    draft = provider.summarize_review(
        {
            "completion_rate": 70,
            "data_quality_score": 82,
            "uncovered_areas": ["upper facade segment"],
            "makeup_flight_plan": ["Schedule makeup flight for upper facade segment."],
            "next_mission_optimizations": ["Use calmer wind window next time."],
        }
    )

    assert_mock_metadata(draft, LLMDecisionBoundary.EXPLANATION)
    assert "completion rate=70" in draft.completion_summary
    assert "data quality score=82" in draft.completion_summary
    assert "Schedule makeup flight for upper facade segment." in draft.makeup_flight_summary
    assert "Use calmer wind window next time." in draft.next_optimization_summary
    assert draft.requires_human_review is True
