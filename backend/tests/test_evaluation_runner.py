from pathlib import Path

import pytest

from app.core.evaluation import (
    DETERMINISTIC_EVALUATION_GENERATED_AT,
    EvaluationRunnerError,
    run_all_evaluation_cases,
    run_evaluation_case,
)
from app.core.models import EvaluationMetricName
from app.data.evaluation import load_all_evaluation_case_fixtures


def test_p1_l_039_runner_runs_single_smoke_case() -> None:
    result = run_evaluation_case("eval-smoke-highrise-nominal")

    assert result.case_id == "eval-smoke-highrise-nominal"
    assert result.generated_at == DETERMINISTIC_EVALUATION_GENERATED_AT
    assert result.scores.hard_constraint_pass_rate == 1
    assert result.scores.risk_recall == 1
    assert {metric.metric for metric in result.metric_scores} == set(EvaluationMetricName)


def test_p1_l_039_runner_runs_all_cases_in_stable_order() -> None:
    results = run_all_evaluation_cases()
    fixtures = load_all_evaluation_case_fixtures()
    result_case_ids = [result.case_id for result in results]

    assert len(results) == len(fixtures)
    assert result_case_ids == sorted(result_case_ids)
    assert "eval-smoke-highrise-nominal" in result_case_ids
    assert all(result.generated_at == DETERMINISTIC_EVALUATION_GENERATED_AT for result in results)


def test_p1_l_039_runner_is_repeatable_for_same_case() -> None:
    first_result = run_evaluation_case("eval-incident-gps-confidence-drop")
    second_result = run_evaluation_case("eval-incident-gps-confidence-drop")

    assert first_result == second_result
    assert first_result.scores.incident_response_score == 1


def test_p1_l_039_runner_reports_case_stage_and_reason_on_failure(tmp_path: Path) -> None:
    with pytest.raises(EvaluationRunnerError) as error_info:
        run_evaluation_case("missing-case", case_dir=tmp_path)

    error = error_info.value
    assert error.case_id == "missing-case"
    assert error.stage == "load"
    assert error.reason
    assert "missing-case" in str(error)
