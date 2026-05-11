from pydantic import BaseModel, Field

from app.core.models import (
    AirspaceConstraint,
    DroneState,
    EnvironmentState,
    Explanation,
    IncidentEvent,
    MissionPlan,
    MissionReview,
    MissionTask,
    ReplanDecision,
    RiskItem,
)


class MissionPlanRequest(BaseModel):
    raw_user_input: str = Field(min_length=1)
    scenario_id: str = "shenzhen_nanshan_highrise_demo"


class MissionPlanResponse(BaseModel):
    mission_task: MissionTask
    environment_state: EnvironmentState
    airspace_constraint: AirspaceConstraint
    drone_state: DroneState
    risks: list[RiskItem]
    mission_plan: MissionPlan
    human_explanation: Explanation


class MissionReplanRequest(BaseModel):
    scenario_id: str = "shenzhen_nanshan_highrise_demo"
    incident_event: IncidentEvent


class MissionReplanResponse(BaseModel):
    replan_decision: ReplanDecision


class MissionReviewRequest(BaseModel):
    scenario_id: str = "shenzhen_nanshan_highrise_demo"
    incident_events: list[IncidentEvent] = Field(default_factory=list)


class MissionReviewResponse(BaseModel):
    mission_review: MissionReview
