from fastapi import APIRouter, HTTPException

from app.api.schemas import (
    MissionPlanRequest,
    MissionPlanResponse,
    MissionReplanRequest,
    MissionReplanResponse,
)
from app.core.orchestration import plan_mission, replan_mission
from app.data.scenarios import ScenarioNotFoundError

router = APIRouter(prefix="/missions", tags=["missions"])


@router.post("/plan")
def create_mission_plan(request: MissionPlanRequest) -> MissionPlanResponse:
    try:
        planning_result = plan_mission(
            scenario_id=request.scenario_id,
            raw_user_input=request.raw_user_input,
        )
    except ScenarioNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return MissionPlanResponse.model_validate(planning_result.model_dump())


@router.post("/replan")
def create_replan_decision(request: MissionReplanRequest) -> MissionReplanResponse:
    try:
        replan_decision = replan_mission(
            scenario_id=request.scenario_id,
            incident_event=request.incident_event,
        )
    except ScenarioNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return MissionReplanResponse(replan_decision=replan_decision)
