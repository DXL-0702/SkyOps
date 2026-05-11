from pydantic import BaseModel

from app.core.models import (
    AirspaceConstraint,
    DroneState,
    EnvironmentState,
    Explanation,
    MissionPlan,
    MissionTask,
    RiskItem,
)


class MissionPlanningResult(BaseModel):
    mission_task: MissionTask
    environment_state: EnvironmentState
    airspace_constraint: AirspaceConstraint
    drone_state: DroneState
    risks: list[RiskItem]
    mission_plan: MissionPlan
    human_explanation: Explanation
