from fastapi import APIRouter

from app.api.schemas import MissionPlanRequest, MissionPlanResponse
from app.core.models import (
    AirspaceConstraint,
    DataSourceType,
    DroneState,
    EnvironmentState,
    Explanation,
    LaunchLandingPoint,
    MissionPlan,
    MissionTask,
    RiskItem,
    RiskLevel,
    SafetyThresholds,
)

router = APIRouter(prefix="/missions", tags=["missions"])


@router.post("/plan")
def create_mission_plan(request: MissionPlanRequest) -> MissionPlanResponse:
    mission_id = "mission-shenzhen-nanshan-highrise-demo"

    mission_task = MissionTask(
        id=mission_id,
        raw_user_input=request.raw_user_input,
        scenario_type="building_facade_inspection",
        operation_object="180m high-rise office building facade",
        operation_area="Nanshan District, Shenzhen",
        operation_goals=["curtain wall crack screening", "detachment risk screening"],
        requested_time_window="tomorrow morning",
        risk_preference="safety first; minimize pedestrian impact",
        special_constraints=["avoid pedestrian peak periods", "use conservative route"],
        source_type=DataSourceType.MOCK,
    )

    environment_state = EnvironmentState(
        source_type=DataSourceType.MOCK,
        weather_summary="Simulated partly cloudy morning with moderate wind.",
        wind_speed_mps=5.2,
        visibility_level="good",
        crowd_level=RiskLevel.MEDIUM,
        gps_quality="partial urban canyon risk near the building facade",
        data_confidence=0.72,
    )

    airspace_constraint = AirspaceConstraint(
        source_type=DataSourceType.MOCK,
        is_flyable=True,
        approval_required=True,
        restricted_zones=["mock temporary control buffer north-east of target block"],
        altitude_limit_m=120,
        compliance_risk_level=RiskLevel.MEDIUM,
        explanation=(
            "Mock airspace data indicates flight is possible only with approval and a "
            "conservative altitude profile."
        ),
    )

    drone_state = DroneState(
        source_type=DataSourceType.MOCK,
        drone_id="mock-drone-m30t-01",
        model="DJI Matrice class mock platform",
        battery_percent=86,
        estimated_endurance_minutes=32,
        return_to_home_battery_threshold=30,
        payloads=["zoom camera", "wide camera"],
        link_quality=RiskLevel.LOW,
        available_for_mission=True,
    )

    risks = [
        RiskItem(
            id="risk-wind-gust",
            category="weather",
            description="Wind gusts may increase near the upper facade.",
            severity=RiskLevel.MEDIUM,
            probability=RiskLevel.MEDIUM,
            risk_level=RiskLevel.MEDIUM,
            trigger_condition="wind_speed_mps >= 8.0",
            mitigation=(
                "Pause facade segment and return to standby point if gust threshold is exceeded."
            ),
            evidence=["mock weather profile", "high-rise facade wind exposure"],
        ),
        RiskItem(
            id="risk-gps-shadow",
            category="navigation",
            description="Facade geometry may reduce GPS confidence in close-range flight.",
            severity=RiskLevel.HIGH,
            probability=RiskLevel.MEDIUM,
            risk_level=RiskLevel.HIGH,
            trigger_condition="gps_confidence < 0.65",
            mitigation="Switch to conservative standoff route and request pilot confirmation.",
            evidence=["mock urban canyon zone", "building height 180m"],
            requires_human_confirmation=True,
        ),
    ]

    mission_plan = MissionPlan(
        mission_id=mission_id,
        recommended_time_window="09:45-11:15 simulated local time",
        launch_landing_points=[
            LaunchLandingPoint(
                id="llp-south-plaza-buffer",
                name="South plaza buffer point",
                description="Mock launch point away from pedestrian peak flow.",
                safety_notes=[
                    "keep pedestrian separation",
                    "manual confirmation required before takeoff",
                ],
            )
        ],
        route_strategy=(
            "Two-segment conservative vertical facade scan with increased standoff distance "
            "near GPS-risk area."
        ),
        flight_segments=["south facade lower segment", "south facade upper segment"],
        safety_thresholds=SafetyThresholds(
            max_wind_speed_mps=8.0,
            min_battery_percent=35,
            min_gps_confidence=0.65,
            max_video_latency_ms=500,
        ),
        abort_conditions=[
            "wind_speed_mps >= 8.0",
            "battery_percent <= 35",
            "gps_confidence < 0.65",
            "crowd_level == high",
        ],
        contingency_plan=[
            "pause mission",
            "return to launch point",
            "preserve collected data",
            "generate makeup flight plan for uncovered facade zones",
        ],
        expected_coverage_percent=82,
        estimated_duration_minutes=24,
        explanation=(
            "Mock plan prioritizes approval, pedestrian separation, GPS confidence, and safe "
            "return margin over full single-flight coverage."
        ),
    )

    human_explanation = Explanation(
        facts=[
            "Input mission targets a high-rise facade in Nanshan District.",
            "All environment, airspace, and drone states are mock data.",
        ],
        inferences=[
            (
                "The mission should use a conservative route because GPS confidence may drop "
                "near the facade."
            ),
            "Approval is required before execution according to the mock airspace constraint.",
        ],
        recommended_actions=[
            "Use the recommended late-morning window.",
            "Confirm approval status and pedestrian separation before takeoff.",
            "Prepare a makeup flight for uncovered upper facade areas.",
        ],
        human_confirmation_required=[
            "Airspace approval",
            "Launch point safety",
            "Pilot readiness for manual takeover",
        ],
    )

    return MissionPlanResponse(
        mission_task=mission_task,
        environment_state=environment_state,
        airspace_constraint=airspace_constraint,
        drone_state=drone_state,
        risks=risks,
        mission_plan=mission_plan,
        human_explanation=human_explanation,
    )
