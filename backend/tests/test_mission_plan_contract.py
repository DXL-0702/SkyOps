from fastapi.testclient import TestClient

from app.main import app


def test_create_mission_plan_returns_mock_contract() -> None:
    client = TestClient(app)

    response = client.post(
        "/missions/plan",
        json={
            "raw_user_input": "明天上午巡检南山区一栋180米高办公楼外立面，尽量减少对行人的影响。",
            "scenario_id": "shenzhen_nanshan_highrise_demo",
        },
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["mission_task"]["source_type"] == "mock"
    assert payload["environment_state"]["source_type"] == "mock"
    assert payload["airspace_constraint"]["source_type"] == "mock"
    assert payload["drone_state"]["source_type"] == "mock"
    assert payload["mission_task"]["scenario_type"] == "building_facade_inspection"
    assert payload["mission_plan"]["expected_coverage_percent"] == 82
    assert payload["mission_plan"]["safety_thresholds"]["min_battery_percent"] == 35
    assert len(payload["risks"]) >= 2
    assert any(risk["requires_human_confirmation"] for risk in payload["risks"])
    assert "Hard constraint evaluation passed: true." in payload["human_explanation"]["facts"]
    assert "Wind speed is below threshold." in payload["human_explanation"]["inferences"]
    assert "Airspace approval" in payload["human_explanation"]["human_confirmation_required"]


def test_create_mission_plan_rejects_empty_task() -> None:
    client = TestClient(app)

    response = client.post(
        "/missions/plan",
        json={
            "raw_user_input": "",
            "scenario_id": "shenzhen_nanshan_highrise_demo",
        },
    )

    assert response.status_code == 422


def test_create_mission_plan_returns_404_for_unknown_scenario() -> None:
    client = TestClient(app)

    response = client.post(
        "/missions/plan",
        json={
            "raw_user_input": "明天上午巡检南山区一栋180米高办公楼外立面。",
            "scenario_id": "unknown_scenario",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Mission scenario not found: unknown_scenario"
