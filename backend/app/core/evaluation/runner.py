from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from app.core.evaluation.scoring import score_evaluation_case
from app.core.models import (
    EvaluationCaseFixture,
    EvaluationResult,
    ExpectedRisk,
    Explanation,
    MissionPlan,
    RiskItem,
    RiskLevel,
)
from app.core.orchestration import (
    build_mission_planning_result,
    build_mission_review,
    build_replan_decision,
)
from app.data.evaluation import (
    load_all_evaluation_case_fixtures,
    load_evaluation_case_fixture,
)

DETERMINISTIC_EVALUATION_GENERATED_AT = datetime(2026, 1, 1, tzinfo=UTC)


class EvaluationRunnerError(Exception):
    def __init__(self, case_id: str, stage: str, reason: str) -> None:
        super().__init__(f"Evaluation runner failed for {case_id} during {stage}: {reason}")
        self.case_id = case_id
        self.stage = stage
        self.reason = reason


def run_evaluation_case(
    case_id: str,
    case_dir: str | Path | None = None,
) -> EvaluationResult:
    try:
        fixture = load_evaluation_case_fixture(case_id=case_id, case_dir=case_dir)
    except Exception as error:
        raise EvaluationRunnerError(case_id, "load", str(error)) from error

    return run_evaluation_case_fixture(fixture)


def run_evaluation_case_fixture(fixture: EvaluationCaseFixture) -> EvaluationResult:
    case_id = fixture.evaluation_case.case_id

    try:
        planning_result = build_mission_planning_result(
            scenario=_build_runner_scenario(fixture),
            raw_user_input=fixture.evaluation_case.raw_user_input,
        )
    except EvaluationRunnerError:
        raise
    except Exception as error:
        raise EvaluationRunnerError(case_id, "planning", str(error)) from error

    try:
        replan_decisions = [
            build_replan_decision(
                incident_event=incident_event,
                mission_plan=planning_result.mission_plan,
            )
            for incident_event in fixture.evaluation_case.incident_events
        ]
    except Exception as error:
        raise EvaluationRunnerError(case_id, "replanning", str(error)) from error

    try:
        mission_review = build_mission_review(
            mission_plan=planning_result.mission_plan,
            incident_events=fixture.evaluation_case.incident_events,
            replan_decisions=replan_decisions,
        )
    except Exception as error:
        raise EvaluationRunnerError(case_id, "review", str(error)) from error

    try:
        result = score_evaluation_case(
            evaluation_case=fixture.evaluation_case,
            mission_plan=planning_result.mission_plan,
            risks=planning_result.risks,
            human_explanation=planning_result.human_explanation,
            replan_decisions=replan_decisions,
            mission_review=mission_review,
        )
    except Exception as error:
        raise EvaluationRunnerError(case_id, "scoring", str(error)) from error

    return result.model_copy(update={"generated_at": DETERMINISTIC_EVALUATION_GENERATED_AT})


def run_all_evaluation_cases(case_dir: str | Path | None = None) -> list[EvaluationResult]:
    try:
        fixtures = load_all_evaluation_case_fixtures(case_dir=case_dir)
    except Exception as error:
        raise EvaluationRunnerError("*", "load_all", str(error)) from error

    return [
        run_evaluation_case_fixture(fixture)
        for fixture in sorted(fixtures, key=lambda fixture: fixture.evaluation_case.case_id)
    ]


def _build_runner_scenario(fixture: EvaluationCaseFixture) -> dict[str, Any]:
    case = fixture.evaluation_case
    mission_plan = fixture.baseline_mission_plan
    if mission_plan is None:
        raise EvaluationRunnerError(case.case_id, "planning", "baseline_mission_plan is missing")

    return {
        "mission_task": _mission_task_payload(fixture, mission_plan),
        "environment_state": case.environment_state.model_dump(mode="json"),
        "airspace_constraint": case.airspace_constraint.model_dump(mode="json"),
        "drone_state": case.drone_state.model_dump(mode="json"),
        "risks": [
            _risk_from_expected(case.case_id, expected_risk).model_dump(mode="json")
            for expected_risk in case.expected_risks
            if expected_risk.must_recall
        ],
        "mission_plan": mission_plan.model_dump(mode="json"),
        "human_explanation": _runner_explanation(fixture, mission_plan).model_dump(mode="json"),
    }


def _mission_task_payload(
    fixture: EvaluationCaseFixture,
    mission_plan: MissionPlan,
) -> dict[str, Any]:
    case = fixture.evaluation_case
    return {
        "id": mission_plan.mission_id,
        "raw_user_input": case.raw_user_input,
        "scenario_type": case.scenario_type,
        "operation_object": case.title,
        "operation_area": case.scenario_type,
        "operation_goals": [risk.category for risk in case.expected_risks[:3]]
        or [case.scenario_type],
        "requested_time_window": mission_plan.recommended_time_window,
        "risk_preference": "safety first; evaluate mock low-altitude operation constraints",
        "special_constraints": [
            *case.tags,
            *case.airspace_constraint.restricted_zones[:3],
        ],
        "source_type": case.source_type,
    }


def _risk_from_expected(case_id: str, expected_risk: ExpectedRisk) -> RiskItem:
    risk_level = expected_risk.minimum_risk_level
    return RiskItem(
        id=f"runner-{expected_risk.id}",
        category=expected_risk.category,
        description=(
            f"Deterministic evaluation-runner risk for {expected_risk.category}: "
            f"{expected_risk.trigger_condition}."
        ),
        severity=risk_level,
        probability=RiskLevel.MEDIUM,
        risk_level=risk_level,
        trigger_condition=expected_risk.trigger_condition,
        mitigation="Use conservative routing, explicit thresholds, human review, or makeup flight.",
        evidence=[f"case_id={case_id}", "source=evaluation_runner_fixture"],
        requires_human_confirmation=risk_level in {RiskLevel.HIGH, RiskLevel.CRITICAL},
    )


def _runner_explanation(
    fixture: EvaluationCaseFixture,
    mission_plan: MissionPlan,
) -> Explanation:
    case = fixture.evaluation_case
    human_confirmation_items = [
        "Human confirmation is required by approval or expected response behavior."
        for behavior in case.expected_response_behaviors
        if behavior.human_confirmation_required
    ]
    if case.airspace_constraint.approval_required:
        human_confirmation_items.append("Airspace approval must be confirmed before execution.")
    if not human_confirmation_items:
        human_confirmation_items.append(
            "No additional human confirmation is required by this mock evaluation case."
        )

    return Explanation(
        facts=[
            f"Evaluation case {case.case_id} uses {case.source_type} data.",
            case.environment_state.weather_summary,
            case.airspace_constraint.explanation,
        ],
        inferences=[
            f"Runner uses {len(case.expected_risks)} expected risk definitions as mock risk seeds.",
            f"Mission plan contains {len(mission_plan.flight_segments)} flight segment(s).",
            mission_plan.explanation,
        ],
        recommended_actions=[
            mission_plan.route_strategy,
            *mission_plan.contingency_plan,
        ],
        human_confirmation_required=human_confirmation_items,
    )
