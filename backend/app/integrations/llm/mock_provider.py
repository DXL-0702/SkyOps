from typing import Any

from app.core.models import DataSourceType
from app.integrations.llm.contracts import (
    ConstraintQuestionDraft,
    ExplanationDraft,
    LLMUsagePolicy,
    ReviewNarrativeDraft,
    TaskUnderstandingDraft,
)

MOCK_PROVIDER_NAME = "mock"
MOCK_SAFETY_NOTE = (
    "Mock LLM output is a draft only; deterministic hard rules and human review "
    "must decide safety-critical actions; it does not approve flight."
)


class MockLLMProvider:
    provider_name = MOCK_PROVIDER_NAME
    usage_policy = LLMUsagePolicy()

    def parse_task(
        self,
        raw_user_input: str,
        context: dict[str, Any],
    ) -> TaskUnderstandingDraft:
        normalized_input = raw_user_input.lower()
        operation_object = _infer_operation_object(normalized_input)
        operation_area = _infer_operation_area(raw_user_input, context)
        operation_goals = _infer_operation_goals(normalized_input)
        requested_time_window = _infer_time_window(raw_user_input, normalized_input)
        risk_preference = _infer_risk_preference(normalized_input)
        special_constraints = _infer_special_constraints(normalized_input)
        missing_fields = [
            field_name
            for field_name, field_value in {
                "operation_object": operation_object,
                "operation_area": operation_area,
                "requested_time_window": requested_time_window,
            }.items()
            if not field_value
        ]

        return TaskUnderstandingDraft(
            source_type=DataSourceType.MOCK,
            provider=self.provider_name,
            deterministic=True,
            operation_object=operation_object,
            operation_area=operation_area,
            operation_goals=operation_goals,
            requested_time_window=requested_time_window,
            risk_preference=risk_preference,
            special_constraints=special_constraints,
            missing_fields=missing_fields,
            requires_human_review=bool(missing_fields),
            safety_notes=[MOCK_SAFETY_NOTE, "This draft does not approve flight."],
        )

    def suggest_missing_constraints(
        self,
        task: TaskUnderstandingDraft,
        context: dict[str, Any],
    ) -> ConstraintQuestionDraft:
        questions = []
        suggested_defaults = {
            "route_mode": "conservative",
            "safety_priority": "safety_over_coverage",
        }

        if "operation_area" in task.missing_fields or not task.operation_area:
            questions.append("请确认作业区域或边界范围。")
        if "requested_time_window" in task.missing_fields or not task.requested_time_window:
            questions.append("请确认期望执行时间窗口。")
        if not task.special_constraints:
            questions.append("是否允许拆分任务并生成补飞计划？")
        if not questions:
            questions.append("是否启用保守航线并保留人工接管选项？")

        return ConstraintQuestionDraft(
            source_type=DataSourceType.MOCK,
            provider=self.provider_name,
            deterministic=True,
            questions=questions,
            suggested_defaults=suggested_defaults,
            requires_human_review=True,
            safety_notes=[
                MOCK_SAFETY_NOTE,
                "Questions are suggestions only and do not change hard safety thresholds.",
            ],
        )

    def generate_human_explanation(
        self,
        decision_context: dict[str, Any],
    ) -> ExplanationDraft:
        facts = _list_from_context(decision_context, "facts")
        inferences = _list_from_context(decision_context, "inferences")
        recommended_actions = _list_from_context(decision_context, "recommended_actions")
        human_confirmation_required = _list_from_context(
            decision_context,
            "human_confirmation_required",
        )

        if not facts:
            facts = ["Mock explanation is based on deterministic mission context."]
        if not inferences:
            inferences = ["Safety-critical conclusions must come from explicit rules."]
        if not recommended_actions:
            recommended_actions = ["Run hard-constraint validation before execution."]
        if not human_confirmation_required:
            human_confirmation_required = [
                "Human safety responsible person must confirm execution readiness."
            ]

        return ExplanationDraft(
            source_type=DataSourceType.MOCK,
            provider=self.provider_name,
            deterministic=True,
            facts=facts,
            inferences=inferences,
            recommended_actions=recommended_actions,
            human_confirmation_required=human_confirmation_required,
            requires_human_review=True,
            safety_notes=[
                MOCK_SAFETY_NOTE,
                "Explanation draft does not approve flight or override rules.",
            ],
        )

    def summarize_review(
        self,
        review_context: dict[str, Any],
    ) -> ReviewNarrativeDraft:
        completion_rate = review_context.get("completion_rate", "unknown")
        data_quality_score = review_context.get("data_quality_score", "unknown")
        uncovered_areas = _list_from_context(review_context, "uncovered_areas")
        makeup_flight_plan = _list_from_context(review_context, "makeup_flight_plan")
        next_optimizations = _list_from_context(review_context, "next_mission_optimizations")

        return ReviewNarrativeDraft(
            source_type=DataSourceType.MOCK,
            provider=self.provider_name,
            deterministic=True,
            completion_summary=(
                f"Mock review draft: completion rate={completion_rate}, "
                f"data quality score={data_quality_score}."
            ),
            risk_summary=(
                "Review risks must be traced to deterministic incident logs and rule outputs."
            ),
            makeup_flight_summary=_summarize_list(
                makeup_flight_plan or uncovered_areas,
                fallback="No mock makeup-flight item was supplied.",
            ),
            next_optimization_summary=_summarize_list(
                next_optimizations,
                fallback="Keep conservative planning and rerun safety checks next time.",
            ),
            requires_human_review=bool(uncovered_areas or makeup_flight_plan),
            safety_notes=[
                MOCK_SAFETY_NOTE,
                "Review narrative is wording support, not a safety release.",
            ],
        )


def _infer_operation_object(normalized_input: str) -> str | None:
    if any(keyword in normalized_input for keyword in ["外立面", "facade", "幕墙"]):
        return "high-rise building facade"
    if any(keyword in normalized_input for keyword in ["光伏", "pv", "solar"]):
        return "industrial park photovoltaic rooftop"
    if any(keyword in normalized_input for keyword in ["工地", "construction"]):
        return "construction site"
    if any(keyword in normalized_input for keyword in ["安防", "security", "巡逻"]):
        return "park security patrol area"
    if any(keyword in normalized_input for keyword in ["救援", "rescue", "应急"]):
        return "emergency response area"

    return None


def _infer_operation_area(raw_user_input: str, context: dict[str, Any]) -> str | None:
    if context.get("operation_area"):
        return str(context["operation_area"])
    if "南山" in raw_user_input or "nanshan" in raw_user_input.lower():
        return "Shenzhen Nanshan mock operation area"
    if "深圳" in raw_user_input or "shenzhen" in raw_user_input.lower():
        return "Shenzhen mock operation area"

    return None


def _infer_operation_goals(normalized_input: str) -> list[str]:
    goals = []

    if any(keyword in normalized_input for keyword in ["裂缝", "脱落", "facade"]):
        goals.append("assess facade operation feasibility and risk")
    if any(keyword in normalized_input for keyword in ["热斑", "hotspot", "光伏", "pv"]):
        goals.append("plan safe photovoltaic inspection task")
    if any(keyword in normalized_input for keyword in ["行人", "人流", "pedestrian", "crowd"]):
        goals.append("minimize pedestrian safety impact")
    if any(keyword in normalized_input for keyword in ["巡逻", "security", "安防"]):
        goals.append("plan safe patrol coverage")

    return goals or ["draft task intent for deterministic planning"]


def _infer_time_window(raw_user_input: str, normalized_input: str) -> str | None:
    if "明天上午" in raw_user_input or "tomorrow morning" in normalized_input:
        return "tomorrow morning"
    if "今天下午" in raw_user_input or "this afternoon" in normalized_input:
        return "this afternoon"
    if "今晚" in raw_user_input or "tonight" in normalized_input:
        return "tonight"
    if "台风前" in raw_user_input or "before typhoon" in normalized_input:
        return "before typhoon arrival"

    return None


def _infer_risk_preference(normalized_input: str) -> str:
    if any(keyword in normalized_input for keyword in ["安全", "safe", "避开", "减少"]):
        return "safety first"

    return "balanced with conservative safety validation"


def _infer_special_constraints(normalized_input: str) -> list[str]:
    constraints = []

    if any(keyword in normalized_input for keyword in ["行人", "人流", "pedestrian", "crowd"]):
        constraints.append("avoid pedestrian peak or crowd-dense low-altitude operation")
    if any(keyword in normalized_input for keyword in ["宿舍", "dormitory"]):
        constraints.append("avoid low-altitude operation near dormitory area")
    if any(keyword in normalized_input for keyword in ["台风", "typhoon"]):
        constraints.append("use conservative pre-typhoon safety threshold review")

    return constraints


def _list_from_context(context: dict[str, Any], key: str) -> list[str]:
    value = context.get(key)
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]
    if isinstance(value, tuple):
        return [str(item) for item in value]

    return [str(value)]


def _summarize_list(items: list[str], fallback: str) -> str:
    if not items:
        return fallback

    return "; ".join(items)
