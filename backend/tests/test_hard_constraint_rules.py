from app.core.models import (
    AirspaceConstraint,
    DataSourceType,
    DroneState,
    EnvironmentState,
    RiskLevel,
)
from app.core.rules import SafetyRuleConfig, evaluate_hard_constraints


def make_environment_state(
    *,
    wind_speed_mps: float = 5.0,
    crowd_level: RiskLevel = RiskLevel.MEDIUM,
    gps_confidence: float = 0.8,
) -> EnvironmentState:
    return EnvironmentState(
        source_type=DataSourceType.MOCK,
        weather_summary="mock weather",
        wind_speed_mps=wind_speed_mps,
        visibility_level="good",
        crowd_level=crowd_level,
        gps_quality="mock gps quality",
        gps_confidence=gps_confidence,
        data_confidence=0.8,
    )


def make_airspace_constraint(*, is_flyable: bool = True) -> AirspaceConstraint:
    return AirspaceConstraint(
        source_type=DataSourceType.MOCK,
        is_flyable=is_flyable,
        approval_required=True,
        restricted_zones=[],
        altitude_limit_m=120,
        compliance_risk_level=RiskLevel.MEDIUM,
        explanation="mock airspace constraint",
    )


def make_drone_state(
    *,
    battery_percent: int = 80,
    video_latency_ms: int = 120,
) -> DroneState:
    return DroneState(
        source_type=DataSourceType.MOCK,
        drone_id="mock-drone",
        model="mock model",
        battery_percent=battery_percent,
        estimated_endurance_minutes=30,
        return_to_home_battery_threshold=30,
        payloads=["zoom camera"],
        link_quality=RiskLevel.LOW,
        video_latency_ms=video_latency_ms,
        available_for_mission=True,
    )


def make_rule_config() -> SafetyRuleConfig:
    return SafetyRuleConfig(
        max_wind_speed_mps=8.0,
        min_battery_percent=35,
        min_gps_confidence=0.65,
        max_video_latency_ms=500,
        blocked_crowd_levels=[RiskLevel.HIGH, RiskLevel.CRITICAL],
        require_airspace_flyable=True,
        require_approval_when_needed=True,
    )


def test_hard_constraints_pass_for_nominal_mock_state() -> None:
    result = evaluate_hard_constraints(
        environment_state=make_environment_state(),
        airspace_constraint=make_airspace_constraint(),
        drone_state=make_drone_state(),
        config=make_rule_config(),
    )

    assert result.passed is True
    assert result.risks == []


def test_hard_constraints_create_risks_for_threshold_failures() -> None:
    result = evaluate_hard_constraints(
        environment_state=make_environment_state(
            wind_speed_mps=8.0,
            crowd_level=RiskLevel.HIGH,
            gps_confidence=0.4,
        ),
        airspace_constraint=make_airspace_constraint(is_flyable=False),
        drone_state=make_drone_state(
            battery_percent=30,
            video_latency_ms=900,
        ),
        config=make_rule_config(),
    )

    assert result.passed is False
    assert {risk.id for risk in result.risks} == {
        "hard-risk-wind-speed",
        "hard-risk-battery-margin",
        "hard-risk-gps-confidence",
        "hard-risk-video-latency",
        "hard-risk-crowd-level",
        "hard-risk-airspace-flyable",
    }
    assert all(risk.requires_human_confirmation for risk in result.risks)
