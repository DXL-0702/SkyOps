from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, Field, model_validator

from app.core.models.airspace import AirspaceConstraint
from app.core.models.common import DataSourceType, RiskLevel
from app.core.models.drone import DroneState
from app.core.models.environment import EnvironmentState
from app.core.models.incident import IncidentEvent
from app.core.models.planning import MissionPlan


class EvaluationMetricName(StrEnum):
    HARD_CONSTRAINT_PASS_RATE = "hard_constraint_pass_rate"
    RISK_RECALL = "risk_recall"
    PLAN_EFFICIENCY = "plan_efficiency"
    INCIDENT_RESPONSE_SCORE = "incident_response_score"
    EXPLAINABILITY_SCORE = "explainability_score"


class ExpectedHardConstraint(BaseModel):
    id: str
    description: str
    must_pass: bool = True
    rule_ref: str | None = None
    severity: RiskLevel = RiskLevel.HIGH


class ExpectedRisk(BaseModel):
    id: str
    category: str
    trigger_condition: str
    minimum_risk_level: RiskLevel = RiskLevel.MEDIUM
    must_recall: bool = True


class ExpectedResponseBehavior(BaseModel):
    id: str
    incident_type: str
    expected_actions: list[str] = Field(default_factory=list)
    forbidden_actions: list[str] = Field(default_factory=list)
    human_confirmation_required: bool = False
    makeup_flight_expected: bool = False


class BaselinePlan(BaseModel):
    expected_duration_minutes: int | None = Field(default=None, ge=0)
    expected_coverage_percent: int | None = Field(default=None, ge=0, le=100)
    task_split_count: int | None = Field(default=None, ge=0)
    manual_intervention_count: int | None = Field(default=None, ge=0)
    safety_margin_notes: list[str] = Field(default_factory=list)


class EvaluationCase(BaseModel):
    case_id: str
    title: str
    scenario_type: str
    raw_user_input: str
    environment_state: EnvironmentState
    airspace_constraint: AirspaceConstraint
    drone_state: DroneState
    incident_events: list[IncidentEvent] = Field(default_factory=list)
    expected_hard_constraints: list[ExpectedHardConstraint] = Field(default_factory=list)
    expected_risks: list[ExpectedRisk] = Field(default_factory=list)
    expected_response_behaviors: list[ExpectedResponseBehavior] = Field(default_factory=list)
    baseline_plan: BaselinePlan | None = None
    tags: list[str] = Field(default_factory=list)
    source_type: DataSourceType = DataSourceType.MOCK

    @model_validator(mode="after")
    def require_mock_or_simulated_source(self) -> "EvaluationCase":
        if self.source_type == DataSourceType.REAL:
            raise ValueError("EvaluationCase must use mock or simulated data in Phase 3.")

        source_fields = {
            "environment_state": self.environment_state.source_type,
            "airspace_constraint": self.airspace_constraint.source_type,
            "drone_state": self.drone_state.source_type,
        }
        incident_sources = {
            f"incident_events[{index}]": incident.source_type
            for index, incident in enumerate(self.incident_events)
        }

        real_source_fields = [
            field_name
            for field_name, source_type in (source_fields | incident_sources).items()
            if source_type == DataSourceType.REAL
        ]
        if real_source_fields:
            joined_fields = ", ".join(real_source_fields)
            raise ValueError(
                "EvaluationCase nested sources must be mock or simulated in Phase 3: "
                f"{joined_fields}."
            )

        return self


class MetricScore(BaseModel):
    metric: EvaluationMetricName
    score: float = Field(ge=0, le=1)
    passed: bool
    matched_items: list[str] = Field(default_factory=list)
    missing_items: list[str] = Field(default_factory=list)
    failure_reasons: list[str] = Field(default_factory=list)


class EvaluationItemResult(BaseModel):
    id: str
    passed: bool
    reason: str
    evidence: list[str] = Field(default_factory=list)


class EvaluationScores(BaseModel):
    hard_constraint_pass_rate: float = Field(default=0, ge=0, le=1)
    risk_recall: float = Field(default=0, ge=0, le=1)
    plan_efficiency: float = Field(default=0, ge=0, le=1)
    incident_response_score: float = Field(default=0, ge=0, le=1)
    explainability_score: float = Field(default=0, ge=0, le=1)


class EvaluationResult(BaseModel):
    case_id: str
    passed: bool
    scores: EvaluationScores
    metric_scores: list[MetricScore] = Field(default_factory=list)
    hard_constraint_results: list[EvaluationItemResult] = Field(default_factory=list)
    risk_recall_results: list[EvaluationItemResult] = Field(default_factory=list)
    incident_response_results: list[EvaluationItemResult] = Field(default_factory=list)
    explainability_results: list[EvaluationItemResult] = Field(default_factory=list)
    failure_reasons: list[str] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    source_type: DataSourceType = DataSourceType.MOCK

    @model_validator(mode="after")
    def require_mock_or_simulated_source(self) -> "EvaluationResult":
        if self.source_type == DataSourceType.REAL:
            raise ValueError("EvaluationResult must use mock or simulated data in Phase 3.")
        return self


class EvaluationCaseFixture(BaseModel):
    evaluation_case: EvaluationCase
    baseline_mission_plan: MissionPlan | None = None
