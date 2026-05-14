from pathlib import Path

import pytest
import yaml

from app.data.evaluation import (
    DuplicateEvaluationCaseIdError,
    EvaluationCaseFormatError,
    EvaluationCaseNotFoundError,
    EvaluationDatasetNotFoundError,
    load_all_evaluation_case_fixtures,
    load_all_evaluation_cases,
    load_evaluation_case,
    load_evaluation_case_fixture,
)


def load_smoke_case_data() -> dict:
    with open("app/data/evaluation/smoke_highrise_nominal.yaml", encoding="utf-8") as fixture:
        loaded = yaml.safe_load(fixture)

    assert isinstance(loaded, dict)
    return loaded


def write_case(path: Path, data: dict) -> None:
    path.write_text(yaml.safe_dump(data, allow_unicode=True, sort_keys=False), encoding="utf-8")


def test_load_all_evaluation_case_fixtures_loads_default_smoke_case() -> None:
    fixtures = load_all_evaluation_case_fixtures()

    case_ids = {fixture.evaluation_case.case_id for fixture in fixtures}
    assert "eval-smoke-highrise-nominal" in case_ids


def test_load_all_evaluation_cases_returns_case_models() -> None:
    cases = load_all_evaluation_cases()

    assert any(case.case_id == "eval-smoke-highrise-nominal" for case in cases)
    assert all(case.source_type.value in {"mock", "simulated"} for case in cases)


def test_load_all_evaluation_cases_includes_required_smoke_cases() -> None:
    cases = load_all_evaluation_cases()
    cases_by_id = {case.case_id: case for case in cases}

    required_case_ids = {
        "eval-smoke-facade-normal",
        "eval-smoke-facade-wind-near-threshold",
        "eval-smoke-facade-battery-near-rth",
    }

    assert required_case_ids.issubset(cases_by_id)

    for case_id in required_case_ids:
        case = cases_by_id[case_id]

        assert case.raw_user_input
        assert case.environment_state
        assert case.airspace_constraint
        assert case.drone_state
        assert case.expected_hard_constraints
        assert case.source_type.value in {"mock", "simulated"}
        assert case.environment_state.source_type.value in {"mock", "simulated"}
        assert case.airspace_constraint.source_type.value in {"mock", "simulated"}
        assert case.drone_state.source_type.value in {"mock", "simulated"}


def test_load_all_evaluation_cases_includes_normal_low_risk_cases() -> None:
    cases = load_all_evaluation_cases()
    cases_by_id = {case.case_id: case for case in cases}

    required_case_ids = {
        "eval-normal-highrise-facade",
        "eval-normal-industrial-park-pv",
        "eval-normal-construction-safety-patrol",
        "eval-normal-park-security-patrol",
        "eval-normal-urban-governance-mapping",
    }

    assert required_case_ids.issubset(cases_by_id)

    for case_id in required_case_ids:
        case = cases_by_id[case_id]

        assert case.raw_user_input
        assert case.environment_state
        assert case.airspace_constraint
        assert case.drone_state
        assert case.expected_hard_constraints
        assert case.expected_risks
        assert case.source_type.value in {"mock", "simulated"}
        assert case.environment_state.source_type.value in {"mock", "simulated"}
        assert case.airspace_constraint.source_type.value in {"mock", "simulated"}
        assert case.drone_state.source_type.value in {"mock", "simulated"}
        assert case.drone_state.battery_percent > case.drone_state.return_to_home_battery_threshold
        assert "low_risk" in case.tags


def test_load_all_evaluation_cases_includes_high_risk_cases() -> None:
    cases = load_all_evaluation_cases()
    cases_by_id = {case.case_id: case for case in cases}

    required_case_ids = {
        "eval-high-risk-wind-exceeds-threshold",
        "eval-high-risk-gust-near-threshold",
        "eval-high-risk-gps-confidence-degradation",
        "eval-high-risk-building-canyon-navigation",
        "eval-high-risk-crowd-low-altitude-hovering",
    }

    assert required_case_ids.issubset(cases_by_id)

    for case_id in required_case_ids:
        case = cases_by_id[case_id]

        assert case.raw_user_input
        assert case.environment_state
        assert case.airspace_constraint
        assert case.drone_state
        assert case.expected_hard_constraints
        assert case.expected_risks
        assert case.expected_response_behaviors
        assert case.source_type.value in {"mock", "simulated"}
        assert case.environment_state.source_type.value in {"mock", "simulated"}
        assert case.airspace_constraint.source_type.value in {"mock", "simulated"}
        assert case.drone_state.source_type.value in {"mock", "simulated"}
        assert "high_risk" in case.tags


def test_load_all_evaluation_cases_includes_airspace_compliance_cases() -> None:
    cases = load_all_evaluation_cases()
    cases_by_id = {case.case_id: case for case in cases}

    required_constraints_by_case_id = {
        "eval-compliance-no-fly-zone-blocked": {
            "no_fly_zone_avoidance",
            "route_must_not_enter_no_fly_zone",
            "mission_boundary_adjustment_required",
        },
        "eval-compliance-restricted-zone-approval-required": {
            "restricted_zone_requires_approval",
            "approval_must_be_verified_before_execution",
            "route_cannot_enter_without_approval",
        },
        "eval-compliance-temporary-control-update": {
            "temporary_control_zone_active",
            "updated_airspace_rule_must_override_stale_plan",
            "route_must_respect_temporary_control",
        },
        "eval-compliance-altitude-limit-conflict": {
            "altitude_ceiling",
            "max_allowed_altitude",
            "objective_conflicts_with_altitude_limit",
        },
        "eval-compliance-insufficient-information-human-review": {
            "compliance_information_required",
            "approval_status_unknown",
            "stale_or_missing_airspace_data",
            "human_review_required",
        },
    }

    assert required_constraints_by_case_id.keys() <= cases_by_id.keys()

    forbidden_expected_action_phrases = {
        "assume approval",
        "assume airspace is clear",
        "enter no-fly zone",
        "enter restricted zone without verification",
        "execute stale route",
    }

    for case_id, required_constraint_ids in required_constraints_by_case_id.items():
        case = cases_by_id[case_id]
        constraint_ids = {constraint.id for constraint in case.expected_hard_constraints}
        expected_actions = {
            action
            for behavior in case.expected_response_behaviors
            for action in behavior.expected_actions
        }

        assert required_constraint_ids <= constraint_ids
        assert case.expected_hard_constraints
        assert case.expected_risks
        assert case.expected_response_behaviors
        assert case.source_type.value in {"mock", "simulated"}
        assert case.airspace_constraint.source_type.value in {"mock", "simulated"}
        assert "airspace_compliance" in case.tags
        assert not (forbidden_expected_action_phrases & expected_actions)


def test_load_all_evaluation_case_fixtures_includes_device_state_cases() -> None:
    fixtures = load_all_evaluation_case_fixtures()
    fixtures_by_case_id = {
        fixture.evaluation_case.case_id: fixture
        for fixture in fixtures
    }

    required_constraints_by_case_id = {
        "eval-device-insufficient-battery": {
            "minimum_takeoff_battery",
            "battery_safety_threshold",
            "mission_cannot_start_with_insufficient_battery",
        },
        "eval-device-insufficient-rth-reserve": {
            "minimum_return_home_battery",
            "return_to_home_reserve_required",
            "route_must_preserve_rth_margin",
        },
        "eval-device-endurance-single-sortie-limit": {
            "max_flight_time",
            "max_route_distance",
            "endurance_limit",
            "mission_split_required",
        },
        "eval-device-video-latency-too-high": {
            "max_video_latency",
            "max_telemetry_delay",
            "reliable_link_required",
            "degraded_operation_required",
        },
        "eval-device-payload-capability-missing": {
            "required_payload_capability",
            "payload_not_available",
            "mission_objective_not_fully_supported",
        },
    }

    assert required_constraints_by_case_id.keys() <= fixtures_by_case_id.keys()

    forbidden_expected_action_phrases = {
        "continue full route after reserve trigger",
        "continue close-range route as normal",
        "spend reserve to finish all coverage",
        "start full patrol route",
        "trade battery reserve for coverage",
        "use unsupported payload for required objective",
    }
    makeup_case_ids = {
        "eval-device-insufficient-rth-reserve",
        "eval-device-endurance-single-sortie-limit",
        "eval-device-video-latency-too-high",
        "eval-device-payload-capability-missing",
    }

    for case_id, required_constraint_ids in required_constraints_by_case_id.items():
        fixture = fixtures_by_case_id[case_id]
        case = fixture.evaluation_case
        constraint_ids = {constraint.id for constraint in case.expected_hard_constraints}
        expected_actions = {
            action
            for behavior in case.expected_response_behaviors
            for action in behavior.expected_actions
        }
        safety_notes = " ".join(case.baseline_plan.safety_margin_notes)
        contingency = " ".join(fixture.baseline_mission_plan.contingency_plan)

        assert required_constraint_ids <= constraint_ids
        assert case.expected_hard_constraints
        assert case.expected_risks
        assert case.expected_response_behaviors
        assert case.source_type.value in {"mock", "simulated"}
        assert case.drone_state.source_type.value in {"mock", "simulated"}
        assert "device_state" in case.tags
        assert not (forbidden_expected_action_phrases & expected_actions)

        if case_id in makeup_case_ids:
            assert any(
                behavior.makeup_flight_expected
                for behavior in case.expected_response_behaviors
            )
            assert any(
                marker in f"{safety_notes} {contingency}"
                for marker in ["uncovered", "makeup flight trigger", "second sortie", "unsupported"]
            )


def test_load_all_evaluation_case_fixtures_includes_incident_injection_cases() -> None:
    fixtures = load_all_evaluation_case_fixtures()
    fixtures_by_case_id = {
        fixture.evaluation_case.case_id: fixture
        for fixture in fixtures
    }

    expected_event_types_by_case_id = {
        "eval-incident-wind-speed-spike": "wind_speed_spike",
        "eval-incident-gps-confidence-drop": "gps_confidence_drop",
        "eval-incident-video-latency-increase": "video_latency_increase",
        "eval-incident-battery-below-rth-threshold": "battery_low",
        "eval-incident-crowd-gathering-route": "crowd_gathering",
    }

    assert expected_event_types_by_case_id.keys() <= fixtures_by_case_id.keys()

    forbidden_expected_action_phrases = {
        "continue despite unsafe wind",
        "continue original route",
        "continue without live video confidence",
        "finish the current segment before return",
        "complete the segment above the crowd",
    }

    for case_id, expected_event_type in expected_event_types_by_case_id.items():
        fixture = fixtures_by_case_id[case_id]
        case = fixture.evaluation_case
        event = case.incident_events[0]
        expected_actions = {
            action
            for behavior in case.expected_response_behaviors
            for action in behavior.expected_actions
        }
        safety_notes = " ".join(case.baseline_plan.safety_margin_notes)
        contingency = " ".join(fixture.baseline_mission_plan.contingency_plan)

        assert event.event_type == expected_event_type
        assert event.source_type.value in {"mock", "simulated"}
        assert case.expected_hard_constraints
        assert case.expected_risks
        assert case.expected_response_behaviors
        assert case.source_type.value in {"mock", "simulated"}
        assert "incident_injection" in case.tags
        assert not (forbidden_expected_action_phrases & expected_actions)
        assert any(
            behavior.makeup_flight_expected
            for behavior in case.expected_response_behaviors
        )
        assert any(
            marker in f"{safety_notes} {contingency}"
            for marker in ["uncovered", "makeup flight trigger", "incomplete segment"]
        )


def test_load_all_evaluation_cases_has_extended_operation_coverage() -> None:
    cases = load_all_evaluation_cases()
    cases_by_id = {case.case_id: case for case in cases}
    required_case_ids = {
        "eval-extended-emergency-rescue-park-search",
        "eval-extended-emergency-supply-delivery",
        "eval-extended-fire-safety-warehouse-patrol",
        "eval-extended-fire-safety-smoke-perimeter",
        "eval-extended-urban-governance-riverbank",
        "eval-extended-urban-governance-public-space",
        "eval-extended-park-logistics-package-delivery",
        "eval-extended-campus-medical-delivery",
        "eval-extended-night-security-warehouse-patrol",
        "eval-extended-pre-typhoon-construction-patrol",
    }
    required_categories = {
        "emergency_rescue",
        "fire_safety_patrol",
        "urban_governance",
        "park_logistics_delivery",
        "night_security_patrol",
        "pre_typhoon_construction_safety_patrol",
    }
    banned_target_terms = {
        "classify building defects",
        "crack detection",
        "defect recognition accuracy",
        "image recognition model",
        "visual defect detection",
    }

    assert 30 <= len(cases) <= 50
    assert required_case_ids <= cases_by_id.keys()
    assert required_categories <= {case.scenario_type for case in cases}

    for case_id in required_case_ids:
        case = cases_by_id[case_id]
        combined_text = " ".join(
            [
                case.title,
                case.scenario_type,
                case.raw_user_input,
                " ".join(case.tags),
                " ".join(risk.id for risk in case.expected_risks),
                " ".join(constraint.id for constraint in case.expected_hard_constraints),
            ]
        ).lower()

        assert case.raw_user_input
        assert case.environment_state
        assert case.airspace_constraint
        assert case.drone_state
        assert case.expected_hard_constraints
        assert case.expected_risks
        assert case.source_type.value in {"mock", "simulated"}
        assert case.environment_state.source_type.value in {"mock", "simulated"}
        assert case.airspace_constraint.source_type.value in {"mock", "simulated"}
        assert case.drone_state.source_type.value in {"mock", "simulated"}
        assert "extended_coverage" in case.tags
        assert not any(term in combined_text for term in banned_target_terms)


def test_load_evaluation_case_fixture_by_case_id() -> None:
    fixture = load_evaluation_case_fixture("eval-smoke-highrise-nominal")

    assert fixture.evaluation_case.title == "Nominal high-rise facade evaluation smoke case"
    assert fixture.baseline_mission_plan is not None


def test_load_evaluation_case_by_case_id() -> None:
    evaluation_case = load_evaluation_case("eval-smoke-highrise-nominal")

    assert evaluation_case.case_id == "eval-smoke-highrise-nominal"
    assert evaluation_case.expected_hard_constraints


def test_load_evaluation_case_raises_for_unknown_case_id(tmp_path: Path) -> None:
    case_data = load_smoke_case_data()
    write_case(tmp_path / "case.yaml", case_data)

    with pytest.raises(EvaluationCaseNotFoundError, match="missing-case"):
        load_evaluation_case("missing-case", case_dir=tmp_path)


def test_load_all_evaluation_cases_raises_for_duplicate_case_ids(tmp_path: Path) -> None:
    case_data = load_smoke_case_data()
    write_case(tmp_path / "case-a.yaml", case_data)
    write_case(tmp_path / "case-b.yaml", case_data)

    with pytest.raises(DuplicateEvaluationCaseIdError, match="eval-smoke-highrise-nominal"):
        load_all_evaluation_case_fixtures(case_dir=tmp_path)


def test_load_all_evaluation_cases_raises_for_non_mapping_yaml(tmp_path: Path) -> None:
    invalid_case_path = tmp_path / "invalid.yaml"
    invalid_case_path.write_text("- not\n- a\n- mapping\n", encoding="utf-8")

    with pytest.raises(EvaluationCaseFormatError, match="must be a mapping"):
        load_all_evaluation_case_fixtures(case_dir=tmp_path)


def test_load_all_evaluation_cases_raises_for_invalid_schema(tmp_path: Path) -> None:
    invalid_case_path = tmp_path / "invalid-schema.yaml"
    invalid_case_path.write_text(
        "evaluation_case:\n  case_id: missing-required-fields\n",
        encoding="utf-8",
    )

    with pytest.raises(EvaluationCaseFormatError, match="Field required"):
        load_all_evaluation_case_fixtures(case_dir=tmp_path)


def test_load_all_evaluation_cases_raises_for_missing_directory(tmp_path: Path) -> None:
    missing_dir = tmp_path / "missing"

    with pytest.raises(EvaluationDatasetNotFoundError, match="missing"):
        load_all_evaluation_case_fixtures(case_dir=missing_dir)
