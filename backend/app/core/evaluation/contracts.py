from enum import StrEnum

from pydantic import BaseModel, Field, model_validator

from app.core.models import EvaluationMetricName

REQUIRED_METRIC_OUTPUT_FIELDS = (
    "score",
    "passed",
    "matched_items",
    "missing_items",
    "failure_reasons",
)


class EvaluationMetricRole(StrEnum):
    BLOCKING_SAFETY_GATE = "blocking_safety_gate"
    QUALITY_SIGNAL = "quality_signal"


class EvaluationMetricContract(BaseModel):
    """Shared contract that each Phase 3 scorer must implement.

    P0-L-033 intentionally defines metric semantics and output shape only. It
    does not run scoring logic, call an LLM judge, or change mission API
    contracts.
    """

    metric: EvaluationMetricName
    display_name: str
    description: str
    scoring_focus: str
    priority_order: int = Field(ge=1)
    role: EvaluationMetricRole
    required_output_fields: tuple[str, ...] = REQUIRED_METRIC_OUTPUT_FIELDS
    blocks_overall_pass: bool = False
    can_be_offset_by_plan_efficiency: bool = False

    @model_validator(mode="after")
    def require_safety_gate_to_block_without_efficiency_offset(
        self,
    ) -> "EvaluationMetricContract":
        if self.role != EvaluationMetricRole.BLOCKING_SAFETY_GATE:
            return self

        if not self.blocks_overall_pass:
            raise ValueError("Blocking safety gates must block the overall result.")
        if self.can_be_offset_by_plan_efficiency:
            raise ValueError("Blocking safety gates cannot be offset by plan efficiency.")

        return self


class EvaluationScoringPolicy(BaseModel):
    """Evaluation-level safety policy shared by future scorer implementations."""

    metric_contracts: tuple[EvaluationMetricContract, ...]
    hard_constraint_metric: EvaluationMetricName
    efficiency_metric: EvaluationMetricName
    llm_judge_allowed: bool = False
    safety_priority_statement: str

    @model_validator(mode="after")
    def require_unique_metrics_and_blocking_hard_constraint(
        self,
    ) -> "EvaluationScoringPolicy":
        metric_names = [contract.metric for contract in self.metric_contracts]
        if len(metric_names) != len(set(metric_names)):
            raise ValueError("Evaluation metric contracts must be unique.")

        contracts_by_metric = {contract.metric: contract for contract in self.metric_contracts}
        hard_constraint_contract = contracts_by_metric[self.hard_constraint_metric]
        efficiency_contract = contracts_by_metric[self.efficiency_metric]

        if hard_constraint_contract.role != EvaluationMetricRole.BLOCKING_SAFETY_GATE:
            raise ValueError("Hard constraint pass rate must be the blocking safety gate.")
        if hard_constraint_contract.priority_order >= efficiency_contract.priority_order:
            raise ValueError("Hard constraints must be evaluated before plan efficiency.")
        if not hard_constraint_contract.blocks_overall_pass:
            raise ValueError("Hard constraint failure must block the overall result.")
        if hard_constraint_contract.can_be_offset_by_plan_efficiency:
            raise ValueError("Plan efficiency must not offset hard constraint failure.")

        return self


EVALUATION_METRIC_CONTRACTS = (
    EvaluationMetricContract(
        metric=EvaluationMetricName.HARD_CONSTRAINT_PASS_RATE,
        display_name="Hard Constraint Pass Rate",
        description=(
            "Checks whether the plan violates any non-negotiable safety or compliance "
            "constraint such as no-fly zones, approval requirements, wind limits, "
            "battery reserve, GPS confidence, or crowd safety."
        ),
        scoring_focus="hard_constraints",
        priority_order=1,
        role=EvaluationMetricRole.BLOCKING_SAFETY_GATE,
        blocks_overall_pass=True,
        can_be_offset_by_plan_efficiency=False,
    ),
    EvaluationMetricContract(
        metric=EvaluationMetricName.RISK_RECALL,
        display_name="Risk Recall",
        description=(
            "Checks whether the Agent recalls expected risk items embedded in the "
            "evaluation case, including weather, GPS, airspace, battery, payload, "
            "link quality, and public safety risks."
        ),
        scoring_focus="expected_risks",
        priority_order=2,
        role=EvaluationMetricRole.QUALITY_SIGNAL,
    ),
    EvaluationMetricContract(
        metric=EvaluationMetricName.INCIDENT_RESPONSE_SCORE,
        display_name="Incident Response Score",
        description=(
            "Checks whether replan decisions include conservative actions such as "
            "pause, return, standby, route downgrade, data preservation, makeup "
            "flight planning, or human review."
        ),
        scoring_focus="expected_response_behaviors",
        priority_order=3,
        role=EvaluationMetricRole.QUALITY_SIGNAL,
    ),
    EvaluationMetricContract(
        metric=EvaluationMetricName.EXPLAINABILITY_SCORE,
        display_name="Explainability Score",
        description=(
            "Checks whether key decisions expose facts, inferred risks, recommended "
            "actions, trade-offs, alternatives, and human-confirmation needs."
        ),
        scoring_focus="decision_explanations",
        priority_order=4,
        role=EvaluationMetricRole.QUALITY_SIGNAL,
    ),
    EvaluationMetricContract(
        metric=EvaluationMetricName.PLAN_EFFICIENCY,
        display_name="Plan Efficiency",
        description=(
            "Compares duration, coverage, task split count, makeup area, manual "
            "intervention count, and safety margin against the baseline plan after "
            "safety gates are satisfied."
        ),
        scoring_focus="baseline_plan",
        priority_order=5,
        role=EvaluationMetricRole.QUALITY_SIGNAL,
    ),
)

EVALUATION_SCORING_POLICY = EvaluationScoringPolicy(
    metric_contracts=EVALUATION_METRIC_CONTRACTS,
    hard_constraint_metric=EvaluationMetricName.HARD_CONSTRAINT_PASS_RATE,
    efficiency_metric=EvaluationMetricName.PLAN_EFFICIENCY,
    llm_judge_allowed=False,
    safety_priority_statement=(
        "Hard-constraint failure blocks the overall evaluation result. Plan efficiency "
        "must never compensate for violations of no-fly zones, approval requirements, "
        "wind limits, battery reserve, GPS confidence, or crowd safety."
    ),
)


def list_metric_contracts() -> tuple[EvaluationMetricContract, ...]:
    return EVALUATION_SCORING_POLICY.metric_contracts


def get_metric_contract(metric: EvaluationMetricName) -> EvaluationMetricContract:
    return next(
        contract
        for contract in EVALUATION_SCORING_POLICY.metric_contracts
        if contract.metric == metric
    )
