from app.core.orchestration import build_mission_planning_result, plan_mission
from app.data.scenarios import load_mission_scenario


def test_orchestrator_plans_mission_from_mock_scenario_id() -> None:
    response = plan_mission(
        scenario_id="shenzhen_nanshan_highrise_demo",
        raw_user_input="明天上午巡检南山区一栋180米高办公楼外立面。",
    )

    assert response.mission_task.raw_user_input == "明天上午巡检南山区一栋180米高办公楼外立面。"
    assert response.mission_task.source_type == "mock"
    assert response.environment_state.source_type == "mock"
    assert response.drone_state.source_type == "mock"
    assert response.mission_plan.expected_coverage_percent == 82
    assert "Hard constraint evaluation passed: true." in response.human_explanation.facts
    assert "Wind speed is below threshold." in response.human_explanation.inferences


def test_orchestrator_appends_hard_constraint_risks() -> None:
    scenario = load_mission_scenario("shenzhen_nanshan_highrise_demo").copy()
    scenario["environment_state"] = scenario["environment_state"] | {
        "wind_speed_mps": 9.0,
        "gps_confidence": 0.4,
        "crowd_level": "high",
    }
    scenario["drone_state"] = scenario["drone_state"] | {
        "battery_percent": 30,
        "video_latency_ms": 900,
    }
    scenario["airspace_constraint"] = scenario["airspace_constraint"] | {"is_flyable": False}

    response = build_mission_planning_result(
        scenario=scenario,
        raw_user_input="高风险条件下检查这栋楼。",
    )

    risk_ids = {risk.id for risk in response.risks}
    assert {
        "hard-risk-wind-speed",
        "hard-risk-battery-margin",
        "hard-risk-gps-confidence",
        "hard-risk-video-latency",
        "hard-risk-crowd-level",
        "hard-risk-airspace-flyable",
    }.issubset(risk_ids)
    assert "Hard constraint evaluation passed: false." in response.human_explanation.facts
