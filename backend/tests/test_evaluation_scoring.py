from app.core.evaluation import (
    score_evaluation_case,
    score_explainability,
    score_hard_constraints,
    score_incident_response,
    score_plan_efficiency,
    score_risk_recall,
)
from app.core.models import (
    EvaluationCase,
    EvaluationMetricName,
    ExpectedRisk,
    Explanation,
    ReplanDecision,
    RiskItem,
    RiskLevel,
)
from app.core.orchestration.incident_replanner import build_replan_decision
from app.core.orchestration.mission_reviewer import build_mission_review
from app.data.evaluation import load_evaluation_case_fixture


def make_risk(
    *,
    id: str,
    category: str,
    trigger_condition: str,
    risk_level: RiskLevel = RiskLevel.HIGH,
) -> RiskItem:
    return RiskItem(
        id=id,
        category=category,
        description=f"Mock {category} risk for evaluation scoring.",
        severity=risk_level,
        probability=RiskLevel.MEDIUM,
        risk_level=risk_level,
        trigger_condition=trigger_condition,
        mitigation="Use conservative mock mitigation.",
        evidence=[f"source=mock scoring test for {id}"],
        requires_human_confirmation=risk_level in {RiskLevel.HIGH, RiskLevel.CRITICAL},
    )


def make_six_risk_case() -> EvaluationCase:
    fixture = load_evaluation_case_fixture("eval-smoke-highrise-nominal")
    expected_risks = [
        ExpectedRisk(
            id="expected-weather",
            category="weather",
            trigger_condition="wind_speed_mps > 8.0",
            minimum_risk_level=RiskLevel.HIGH,
        ),
        ExpectedRisk(
            id="expected-gps",
            category="navigation",
            trigger_condition="gps_confidence < 0.65",
            minimum_risk_level=RiskLevel.HIGH,
        ),
        ExpectedRisk(
            id="expected-crowd",
            category="crowd",
            trigger_condition="crowd_level is high",
            minimum_risk_level=RiskLevel.HIGH,
        ),
        ExpectedRisk(
            id="expected-airspace",
            category="airspace",
            trigger_condition="restricted zone requires approval",
            minimum_risk_level=RiskLevel.MEDIUM,
        ),
        ExpectedRisk(
            id="expected-battery",
            category="battery",
            trigger_condition="battery_percent <= return reserve",
            minimum_risk_level=RiskLevel.HIGH,
        ),
        ExpectedRisk(
            id="expected-video",
            category="data_link",
            trigger_condition="video_latency_ms > 500",
            minimum_risk_level=RiskLevel.HIGH,
        ),
    ]
    return fixture.evaluation_case.model_copy(update={"expected_risks": expected_risks})


def make_full_risk_recall_items() -> list[RiskItem]:
    return [
        make_risk(
            id="actual-weather",
            category="weather",
            trigger_condition="wind_speed_mps > 8.0",
        ),
        make_risk(
            id="actual-gps",
            category="navigation",
            trigger_condition="gps_confidence < 0.65",
        ),
        make_risk(id="actual-crowd", category="crowd", trigger_condition="crowd_level is high"),
        make_risk(
            id="actual-airspace",
            category="airspace",
            trigger_condition="restricted zone requires approval",
            risk_level=RiskLevel.MEDIUM,
        ),
        make_risk(
            id="actual-battery",
            category="battery",
            trigger_condition="battery_percent <= return reserve",
        ),
        make_risk(
            id="actual-video",
            category="data_link",
            trigger_condition="video_latency_ms > 500",
        ),
    ]


def make_good_explanation() -> Explanation:
    return Explanation(
        facts=["Mock facts include wind, GPS, battery, crowd, and airspace inputs."],
        inferences=["Mock inference flags conservative standoff route near GPS-risk area."],
        recommended_actions=["Use segmented route and preserve return margin."],
        human_confirmation_required=["Confirm approval before takeoff."],
    )


def test_issue_40_hard_constraint_scoring_passes_nominal_case() -> None:
    fixture = load_evaluation_case_fixture("eval-smoke-highrise-nominal")

    score, results, metric = score_hard_constraints(
        fixture.evaluation_case,
        fixture.baseline_mission_plan,
    )

    assert score == 1
    assert metric.passed is True
    assert all(result.passed for result in results)


def test_issue_40_hard_constraint_scoring_reports_failed_fields_and_reasons() -> None:
    fixture = load_evaluation_case_fixture("eval-high-risk-wind-exceeds-threshold")

    score, results, metric = score_hard_constraints(
        fixture.evaluation_case,
        fixture.baseline_mission_plan,
    )

    assert score < 1
    assert metric.passed is False
    failed_by_id = {result.id: result for result in results if not result.passed}
    assert "hard-wind-speed" in failed_by_id
    assert "wind_speed_mps=9.2" in failed_by_id["hard-wind-speed"].evidence
    assert any("Wind speed exceeds" in reason for reason in metric.failure_reasons)


def test_issue_41_risk_recall_scores_full_partial_and_zero_recall() -> None:
    evaluation_case = make_six_risk_case()
    full_risks = make_full_risk_recall_items()

    full_score, full_results, full_metric = score_risk_recall(evaluation_case, full_risks)
    partial_score, partial_results, partial_metric = score_risk_recall(
        evaluation_case,
        full_risks[:3],
    )
    zero_score, zero_results, zero_metric = score_risk_recall(evaluation_case, [])

    assert full_score == 1
    assert full_metric.passed is True
    assert {result.id for result in full_results if result.passed} == {
        "expected-weather",
        "expected-gps",
        "expected-crowd",
        "expected-airspace",
        "expected-battery",
        "expected-video",
    }
    assert partial_score == 0.5
    assert partial_metric.missing_items == [
        "expected-airspace",
        "expected-battery",
        "expected-video",
    ]
    assert all("eval-smoke-highrise-nominal" in result.reason for result in partial_results[3:])
    assert zero_score == 0
    assert zero_metric.passed is False
    assert len([result for result in zero_results if not result.passed]) == 6


def test_issue_42_incident_response_scores_safe_replan_for_multiple_events() -> None:
    for case_id in (
        "eval-incident-wind-speed-spike",
        "eval-incident-battery-below-rth-threshold",
        "eval-incident-crowd-gathering-route",
    ):
        fixture = load_evaluation_case_fixture(case_id)
        incident = fixture.evaluation_case.incident_events[0]
        decision = build_replan_decision(incident, fixture.baseline_mission_plan)

        score, results, metric = score_incident_response(
            fixture.evaluation_case,
            [decision],
        )

        assert score == 1
        assert metric.passed is True
        assert all(result.passed for result in results)


def test_issue_42_high_risk_event_fails_when_decision_continues_original_plan() -> None:
    fixture = load_evaluation_case_fixture("eval-incident-wind-speed-spike")
    incident = fixture.evaluation_case.incident_events[0]
    unsafe_decision = ReplanDecision(
        incident_id=incident.id,
        decision="continue_original_route",
        actions=["continue original route", "finish the current segment before return"],
        affected_segments=["upper facade active segment"],
        makeup_flight_required=False,
        human_takeover_required=False,
        reason="Unsafe mock decision used only for scorer regression test.",
        alternatives_considered=[],
    )

    score, results, metric = score_incident_response(
        fixture.evaluation_case,
        [unsafe_decision],
    )

    assert score == 0
    assert metric.passed is False
    assert results[0].passed is False
    assert "unsafe_continue" in results[0].reason


def test_issue_43_explainability_scores_complete_and_empty_explanations() -> None:
    fixture = load_evaluation_case_fixture("eval-incident-wind-speed-spike")
    incident = fixture.evaluation_case.incident_events[0]
    decision = build_replan_decision(incident, fixture.baseline_mission_plan)
    review = build_mission_review(fixture.baseline_mission_plan, [incident], [decision])

    good_score, good_results, good_metric = score_explainability(
        mission_plan=fixture.baseline_mission_plan,
        human_explanation=make_good_explanation(),
        replan_decisions=[decision],
        mission_review=review,
    )
    empty_score, empty_results, empty_metric = score_explainability(
        mission_plan=fixture.baseline_mission_plan,
        human_explanation=Explanation(),
    )

    assert good_score == 1
    assert good_metric.passed is True
    assert empty_score < 1
    assert empty_metric.passed is False
    assert {
        "explanation-facts",
        "explanation-inferences",
        "explanation-recommended_actions",
        "explanation-human_confirmation_required",
    } <= {result.id for result in empty_results if not result.passed}
    assert all(result.reason for result in good_results + empty_results)


def test_issue_44_plan_efficiency_scores_baseline_and_caps_unsafe_plan() -> None:
    fixture = load_evaluation_case_fixture("eval-smoke-highrise-nominal")

    safe_score, safe_metric = score_plan_efficiency(
        evaluation_case=fixture.evaluation_case,
        mission_plan=fixture.baseline_mission_plan,
        hard_constraints_passed=True,
    )
    unsafe_score, unsafe_metric = score_plan_efficiency(
        evaluation_case=fixture.evaluation_case,
        mission_plan=fixture.baseline_mission_plan,
        hard_constraints_passed=False,
    )

    assert safe_score == 1
    assert safe_metric.passed is True
    assert unsafe_score <= 0.2
    assert unsafe_metric.passed is False
    assert "hard_constraints" in unsafe_metric.missing_items
    assert any("cannot offset" in reason for reason in unsafe_metric.failure_reasons)


def test_issue_44_plan_efficiency_accepts_slower_conservative_plan_with_explanation() -> None:
    fixture = load_evaluation_case_fixture("eval-smoke-highrise-nominal")
    slower_plan = fixture.baseline_mission_plan.model_copy(
        update={
            "estimated_duration_minutes": 30,
            "explanation": (
                "Mock plan is slower because it keeps conservative standoff, approval "
                "checks, and safe return threshold before coverage efficiency."
            ),
        }
    )

    score, metric = score_plan_efficiency(
        evaluation_case=fixture.evaluation_case,
        mission_plan=slower_plan,
        hard_constraints_passed=True,
    )

    assert score >= 0.9
    assert metric.passed is True
    assert "safety_margin" in metric.matched_items


def test_score_evaluation_case_returns_existing_evaluation_result_shape() -> None:
    fixture = load_evaluation_case_fixture("eval-smoke-highrise-nominal")
    risks = [
        make_risk(
            id="actual-weather",
            category="weather",
            trigger_condition="wind_speed_mps >= 8.0",
            risk_level=RiskLevel.MEDIUM,
        ),
        make_risk(
            id="actual-gps",
            category="navigation",
            trigger_condition="gps_confidence < 0.65",
        ),
    ]

    result = score_evaluation_case(
        evaluation_case=fixture.evaluation_case,
        mission_plan=fixture.baseline_mission_plan,
        risks=risks,
        human_explanation=make_good_explanation(),
    )

    assert result.case_id == fixture.evaluation_case.case_id
    assert result.scores.hard_constraint_pass_rate == 1
    assert result.scores.risk_recall == 1
    assert {metric.metric for metric in result.metric_scores} == set(EvaluationMetricName)
