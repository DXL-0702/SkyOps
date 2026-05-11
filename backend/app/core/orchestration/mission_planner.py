from typing import Any

from app.core.models import (
    AirspaceConstraint,
    DroneState,
    EnvironmentState,
    Explanation,
    MissionPlan,
    MissionTask,
    RiskItem,
)
from app.core.orchestration.models import MissionPlanningResult
from app.core.rules import evaluate_hard_constraints
from app.data.scenarios import load_mission_scenario


def plan_mission(scenario_id: str, raw_user_input: str) -> MissionPlanningResult:
    scenario = load_mission_scenario(scenario_id)
    return build_mission_planning_result(
        scenario=scenario,
        raw_user_input=raw_user_input,
    )


def build_mission_planning_result(
    scenario: dict[str, Any],
    raw_user_input: str,
) -> MissionPlanningResult:
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

    return MissionPlanningResult(
        mission_task=MissionTask.model_validate(mission_task_data),
        environment_state=environment_state,
        airspace_constraint=airspace_constraint,
        drone_state=drone_state,
        risks=[*scenario_risks, *rule_evaluation.risks],
        mission_plan=MissionPlan.model_validate(scenario["mission_plan"]),
        human_explanation=human_explanation,
    )
