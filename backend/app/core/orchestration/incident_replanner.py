from app.core.models import IncidentEvent, MissionPlan, ReplanDecision, RiskLevel
from app.data.scenarios import load_mission_scenario


def replan_mission(scenario_id: str, incident_event: IncidentEvent) -> ReplanDecision:
    scenario = load_mission_scenario(scenario_id)
    mission_plan = MissionPlan.model_validate(scenario["mission_plan"])
    return build_replan_decision(
        incident_event=incident_event,
        mission_plan=mission_plan,
    )


def build_replan_decision(
    incident_event: IncidentEvent,
    mission_plan: MissionPlan,
) -> ReplanDecision:
    affected_segments = mission_plan.flight_segments or ["current active segment"]
    severity_requires_takeover = incident_event.severity in {RiskLevel.HIGH, RiskLevel.CRITICAL}

    match incident_event.event_type:
        case "wind_speed_spike":
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="pause_and_return_to_standby",
                actions=[
                    "pause current facade scan",
                    "return to launch or standby point",
                    "preserve collected imagery and telemetry",
                    "generate makeup flight for unfinished facade segments",
                    "resume only after wind speed returns below threshold",
                ],
                affected_segments=affected_segments,
                makeup_flight_required=True,
                human_takeover_required=severity_requires_takeover,
                reason=(
                    "Observed wind condition exceeds the mission safety threshold, so coverage is "
                    "deprioritized in favor of aircraft stability and pedestrian safety."
                ),
                alternatives_considered=[
                    "rejected: continue with reduced speed",
                    "rejected: switch to closer facade route",
                    "rejected: wait in hover near target area",
                ],
            )
        case "gps_confidence_drop":
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="switch_to_conservative_standoff_route",
                actions=[
                    "pause close-range facade segment",
                    "increase standoff distance",
                    "switch to conservative waypoint path",
                    "request pilot readiness for manual takeover",
                    "mark low-confidence area for makeup flight",
                ],
                affected_segments=affected_segments,
                makeup_flight_required=True,
                human_takeover_required=True,
                reason=(
                    "GPS confidence has fallen below the navigation safety threshold near the "
                    "building facade, so close-range autonomous flight should be degraded."
                ),
                alternatives_considered=[
                    "rejected: continue original route",
                    "rejected: descend along current facade path",
                    "rejected: complete remaining coverage without makeup flight",
                ],
            )
        case "video_latency_increase":
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="pause_until_link_recovers",
                actions=[
                    "pause mission progress",
                    "hold or return to standby point based on pilot confirmation",
                    "check video transmission quality",
                    "preserve collected data before retrying",
                    "resume only after latency returns below threshold",
                ],
                affected_segments=["current active segment"],
                makeup_flight_required=True,
                human_takeover_required=severity_requires_takeover,
                reason=(
                    "Video transmission latency exceeds the configured safety threshold, reducing "
                    "operator situational awareness during low-altitude work."
                ),
                alternatives_considered=[
                    "rejected: continue without live video confidence",
                    "rejected: ignore video latency while telemetry remains active",
                    "rejected: increase speed to finish the segment",
                ],
            )
        case "battery_low":
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="return_to_home_and_split_makeup_flight",
                actions=[
                    "stop new data collection",
                    "return to launch point immediately",
                    "preserve completed segment data",
                    "record unfinished coverage",
                    "create makeup flight after battery replacement",
                ],
                affected_segments=affected_segments,
                makeup_flight_required=True,
                human_takeover_required=True,
                reason=(
                    "Battery level is at or below the safe return margin, so the mission must "
                    "protect return-to-home capability before coverage."
                ),
                alternatives_considered=[
                    "rejected: finish the current segment before return",
                    "rejected: reduce payload usage and continue",
                    "rejected: continue until critical battery warning",
                ],
            )
        case "crowd_gathering":
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="pause_and_clear_pedestrian_risk",
                actions=[
                    "pause low-altitude operation",
                    "avoid hovering above crowd area",
                    "move to safe standby point",
                    "notify human safety responsible person",
                    "reschedule affected area to lower crowd window",
                ],
                affected_segments=affected_segments,
                makeup_flight_required=True,
                human_takeover_required=True,
                reason=(
                    "A crowd gathering increases ground safety risk, so low-altitude operation "
                    "should pause until pedestrian separation is restored."
                ),
                alternatives_considered=[
                    "rejected: continue at lower altitude",
                    "rejected: hover until crowd disperses",
                    "rejected: complete the facade segment above the crowd",
                ],
            )
        case "temporary_airspace_restriction":
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="abort_and_request_compliance_review",
                actions=[
                    "abort mission execution",
                    "return to launch point",
                    "preserve collected data",
                    "record restricted area update",
                    "request compliance review before makeup flight",
                ],
                affected_segments=affected_segments,
                makeup_flight_required=True,
                human_takeover_required=True,
                reason=(
                    "A temporary airspace restriction changes mission compliance status, so the "
                    "system must stop instead of attempting to route around it without review."
                ),
                alternatives_considered=[
                    "rejected: fly around the restricted area without review",
                    "rejected: continue below the altitude limit",
                    "rejected: complete only the remaining short segment",
                ],
            )
        case _:
            return ReplanDecision(
                incident_id=incident_event.id,
                decision="pause_for_manual_review",
                actions=[
                    "pause mission",
                    "preserve collected data",
                    "request human review of unknown incident",
                    "resume only after explicit confirmation",
                ],
                affected_segments=["current active segment"],
                makeup_flight_required=True,
                human_takeover_required=True,
                reason=(
                    "The incident type is not covered by deterministic replan rules, so the safe "
                    "default is to pause and request manual review."
                ),
                alternatives_considered=[
                    "rejected: continue with original plan",
                    "rejected: infer a new route without a known rule",
                ],
            )
