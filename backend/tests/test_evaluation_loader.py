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
