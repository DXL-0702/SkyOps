import pytest
import yaml
from pydantic import ValidationError

from app.core.models import DataSourceType, EvaluationCase, EvaluationCaseFixture
from app.core.models.evaluation import EvaluationResult, EvaluationScores


def test_evaluation_case_fixture_validates_minimal_smoke_yaml() -> None:
    with open("app/data/evaluation/smoke_highrise_nominal.yaml", encoding="utf-8") as fixture:
        data = yaml.safe_load(fixture)

    parsed = EvaluationCaseFixture.model_validate(data)

    assert parsed.evaluation_case.case_id == "eval-smoke-highrise-nominal"
    assert parsed.evaluation_case.source_type == DataSourceType.MOCK
    assert parsed.evaluation_case.environment_state.source_type == DataSourceType.MOCK
    assert parsed.evaluation_case.expected_hard_constraints[0].id == "hard-airspace-approval"
    assert parsed.evaluation_case.expected_risks[0].category == "weather"
    assert parsed.baseline_mission_plan is not None
    assert parsed.baseline_mission_plan.estimated_duration_minutes == 24


def test_evaluation_case_rejects_real_source_type_in_phase_3() -> None:
    with pytest.raises(ValidationError, match="mock or simulated"):
        EvaluationCase.model_validate(
            {
                "case_id": "eval-real-source-rejected",
                "title": "real source should be rejected",
                "scenario_type": "building_facade_inspection",
                "raw_user_input": "mock task",
                "environment_state": {
                    "source_type": "mock",
                    "weather_summary": "mock weather",
                    "wind_speed_mps": 4.0,
                    "visibility_level": "good",
                    "crowd_level": "low",
                    "gps_quality": "good",
                    "gps_confidence": 0.9,
                    "data_confidence": 0.9,
                },
                "airspace_constraint": {
                    "source_type": "mock",
                    "is_flyable": True,
                    "approval_required": False,
                    "restricted_zones": [],
                    "altitude_limit_m": 120,
                    "compliance_risk_level": "low",
                    "explanation": "mock airspace",
                },
                "drone_state": {
                    "source_type": "mock",
                    "drone_id": "mock-drone",
                    "model": "mock model",
                    "battery_percent": 90,
                    "estimated_endurance_minutes": 30,
                    "return_to_home_battery_threshold": 30,
                    "payloads": ["zoom camera"],
                    "link_quality": "low",
                    "video_latency_ms": 100,
                    "available_for_mission": True,
                },
                "source_type": "real",
            },
        )


def test_evaluation_case_rejects_real_nested_source_type_in_phase_3() -> None:
    with open("app/data/evaluation/smoke_highrise_nominal.yaml", encoding="utf-8") as fixture:
        data = yaml.safe_load(fixture)

    data["evaluation_case"]["environment_state"]["source_type"] = "real"

    with pytest.raises(ValidationError, match="environment_state"):
        EvaluationCaseFixture.model_validate(data)


def test_evaluation_result_generated_at_is_timezone_aware() -> None:
    result = EvaluationResult(
        case_id="eval-smoke-highrise-nominal",
        passed=True,
        scores=EvaluationScores(
            hard_constraint_pass_rate=1,
            risk_recall=1,
            plan_efficiency=0.8,
            incident_response_score=1,
            explainability_score=1,
        ),
    )

    assert result.generated_at.tzinfo is not None
    assert result.generated_at.utcoffset() is not None


def test_evaluation_result_rejects_real_source_type_in_phase_3() -> None:
    with pytest.raises(ValidationError, match="mock or simulated"):
        EvaluationResult(
            case_id="eval-real-result-rejected",
            passed=False,
            scores=EvaluationScores(),
            source_type=DataSourceType.REAL,
        )
