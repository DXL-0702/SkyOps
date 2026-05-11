from typing import Any

from fastapi import APIRouter, HTTPException

from app.api.schemas import MissionPlanRequest, MissionPlanResponse
from app.core.models import (
    AirspaceConstraint,
    DroneState,
    EnvironmentState,
    Explanation,
    MissionPlan,
    MissionTask,
    RiskItem,
)
from app.core.rules import evaluate_hard_constraints
from app.data.scenarios import ScenarioNotFoundError, load_mission_scenario

router = APIRouter(prefix="/missions", tags=["missions"])


@router.post("/plan")
def create_mission_plan(request: MissionPlanRequest) -> MissionPlanResponse:
    try:
        scenario = load_mission_scenario(request.scenario_id)
    except ScenarioNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return build_mission_plan_response(scenario, request.raw_user_input)


def build_mission_plan_response(
    scenario: dict[str, Any],
    raw_user_input: str,
) -> MissionPlanResponse:
    mission_task_data = scenario["mission_task"] | {"raw_user_input": raw_user_input}
    environment_state = EnvironmentState.model_validate(scenario["environment_state"])
    airspace_constraint = AirspaceConstraint.model_validate(scenario["airspace_constraint"])
    drone_state = DroneState.model_validate(scenario["drone_state"])
    scenario_risks = [RiskItem.model_validate(risk) for risk in scenario["risks"]]
    rule_evaluation = evaluate_hard_constraints(
        environment_state=environment_state,
        airspace_constraint=airspace_constraint,
        drone_state=drone_state,
    )
    human_explanation = Explanation.model_validate(scenario["human_explanation"])
    human_explanation.facts.append(
        f"Hard constraint evaluation passed: {str(rule_evaluation.passed).lower()}."
    )
    human_explanation.inferences.extend(check.reason for check in rule_evaluation.checks)

    return MissionPlanResponse(
        mission_task=MissionTask.model_validate(mission_task_data),
        environment_state=environment_state,
        airspace_constraint=airspace_constraint,
        drone_state=drone_state,
        risks=[*scenario_risks, *rule_evaluation.risks],
        mission_plan=MissionPlan.model_validate(scenario["mission_plan"]),
        human_explanation=human_explanation,
    )
