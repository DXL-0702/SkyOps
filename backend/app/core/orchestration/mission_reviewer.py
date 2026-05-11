from app.core.models import IncidentEvent, MissionPlan, MissionReview, ReplanDecision
from app.core.orchestration.incident_replanner import build_replan_decision
from app.data.scenarios import load_mission_scenario


def review_mission(
    scenario_id: str,
    incident_events: list[IncidentEvent] | None = None,
) -> MissionReview:
    scenario = load_mission_scenario(scenario_id)
    mission_plan = MissionPlan.model_validate(scenario["mission_plan"])
    active_incident_events = incident_events or []
    replan_decisions = [
        build_replan_decision(
            incident_event=incident_event,
            mission_plan=mission_plan,
        )
        for incident_event in active_incident_events
    ]

    return build_mission_review(
        mission_plan=mission_plan,
        incident_events=active_incident_events,
        replan_decisions=replan_decisions,
    )


def build_mission_review(
    mission_plan: MissionPlan,
    incident_events: list[IncidentEvent],
    replan_decisions: list[ReplanDecision],
) -> MissionReview:
    completion_rate = calculate_completion_rate(mission_plan, replan_decisions)
    data_quality_score = calculate_data_quality_score(mission_plan, incident_events)
    uncovered_areas = build_uncovered_areas(mission_plan, replan_decisions)

    return MissionReview(
        mission_id=mission_plan.mission_id,
        completion_rate=completion_rate,
        data_quality_score=data_quality_score,
        risk_trigger_log=build_risk_trigger_log(incident_events, replan_decisions),
        uncovered_areas=uncovered_areas,
        makeup_flight_plan=build_makeup_flight_plan(uncovered_areas, replan_decisions),
        human_review_checklist=build_human_review_checklist(replan_decisions),
        next_mission_optimizations=build_next_mission_optimizations(incident_events),
    )


def calculate_completion_rate(
    mission_plan: MissionPlan,
    replan_decisions: list[ReplanDecision],
) -> int:
    incident_penalty = min(40, 12 * len(replan_decisions))
    return max(0, mission_plan.expected_coverage_percent - incident_penalty)


def calculate_data_quality_score(
    mission_plan: MissionPlan,
    incident_events: list[IncidentEvent],
) -> int:
    base_score = min(95, 70 + mission_plan.expected_coverage_percent // 4)
    incident_penalty = min(35, 8 * len(incident_events))
    return max(50, base_score - incident_penalty)


def build_risk_trigger_log(
    incident_events: list[IncidentEvent],
    replan_decisions: list[ReplanDecision],
) -> list[str]:
    if not incident_events:
        return ["No incident was injected in this mock mission review."]

    return [
        (
            f"{incident_event.id}: {incident_event.event_type} observed "
            f"{incident_event.observed_value} against threshold {incident_event.threshold}; "
            f"decision={replan_decision.decision}."
        )
        for incident_event, replan_decision in zip(incident_events, replan_decisions, strict=True)
    ]


def build_uncovered_areas(
    mission_plan: MissionPlan,
    replan_decisions: list[ReplanDecision],
) -> list[str]:
    uncovered_areas = []

    if mission_plan.expected_coverage_percent < 100:
        uncovered_areas.append("planned uncovered facade zones outside initial mock coverage")

    for replan_decision in replan_decisions:
        if replan_decision.makeup_flight_required:
            uncovered_areas.extend(replan_decision.affected_segments)

    return sorted(set(uncovered_areas))


def build_makeup_flight_plan(
    uncovered_areas: list[str],
    replan_decisions: list[ReplanDecision],
) -> list[str]:
    if not uncovered_areas:
        return ["No makeup flight is required by the current mock review."]

    plan = [
        f"Schedule makeup flight for uncovered areas: {', '.join(uncovered_areas)}.",
        "Recheck wind, GPS confidence, video latency, battery margin, crowd level, and airspace.",
        "Use conservative route and preserve previously collected data before retrying.",
    ]

    if any(decision.human_takeover_required for decision in replan_decisions):
        plan.append("Require human safety confirmation before makeup flight execution.")

    return plan


def build_human_review_checklist(replan_decisions: list[ReplanDecision]) -> list[str]:
    checklist = [
        "Confirm all review inputs are mock or simulated data before presenting the result.",
        "Review airspace approval, launch safety, and pilot readiness before reuse.",
    ]

    for replan_decision in replan_decisions:
        if replan_decision.human_takeover_required:
            checklist.append(
                f"Review human takeover requirement for incident {replan_decision.incident_id}."
            )

    return checklist


def build_next_mission_optimizations(incident_events: list[IncidentEvent]) -> list[str]:
    optimizations = [
        "Compare planned coverage, completed coverage, and makeup areas before the next mission.",
    ]
    event_types = {incident_event.event_type for incident_event in incident_events}

    if not event_types:
        optimizations.append(
            "Maintain conservative route settings and review whether 82% coverage is enough."
        )

    if "wind_speed_spike" in event_types:
        optimizations.append(
            "Move the next flight to a calmer wind window or split upper facade work."
        )

    if "gps_confidence_drop" in event_types:
        optimizations.append("Increase facade standoff distance in GPS-shadowed segments.")

    if "video_latency_increase" in event_types:
        optimizations.append("Run data link checks before entering close-range facade segments.")

    if "battery_low" in event_types:
        optimizations.append(
            "Split the next mission earlier and reserve a larger return battery margin."
        )

    if "crowd_gathering" in event_types:
        optimizations.append("Schedule pedestrian-sensitive segments outside high crowd windows.")

    if "temporary_airspace_restriction" in event_types:
        optimizations.append("Refresh airspace compliance data immediately before launch.")

    unknown_event_types = event_types - {
        "wind_speed_spike",
        "gps_confidence_drop",
        "video_latency_increase",
        "battery_low",
        "crowd_gathering",
        "temporary_airspace_restriction",
    }
    if unknown_event_types:
        optimizations.append(
            "Add deterministic replan rules for newly observed unknown incident types."
        )

    return optimizations
