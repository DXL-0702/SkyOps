from enum import StrEnum
from typing import Any, Protocol

from pydantic import BaseModel, Field, model_validator

from app.core.models import DataSourceType


class LLMDecisionBoundary(StrEnum):
    DRAFT = "draft"
    SUGGESTION = "suggestion"
    EXPLANATION = "explanation"


class LLMFailureMode(StrEnum):
    TIMEOUT = "timeout"
    INVALID_JSON = "invalid_json"
    SAFETY_BOUNDARY_CONFLICT = "safety_boundary_conflict"
    MISSING_REQUIRED_FIELD = "missing_required_field"
    PROVIDER_UNAVAILABLE = "provider_unavailable"


class LLMProviderError(Exception):
    def __init__(self, failure_mode: LLMFailureMode, message: str) -> None:
        super().__init__(message)
        self.failure_mode = failure_mode


class LLMUsagePolicy(BaseModel):
    """Safety boundary for future LLM providers.

    Phase 4-lite only defines the adapter contract. It does not call real LLM
    APIs and does not allow LLM output to override deterministic safety rules.
    """

    can_parse_task: bool = True
    can_suggest_missing_constraints: bool = True
    can_generate_explanation: bool = True
    can_summarize_review: bool = True
    can_approve_flight: bool = False
    can_override_hard_constraints: bool = False
    can_bypass_human_review: bool = False
    can_change_safety_thresholds: bool = False
    output_boundaries: tuple[LLMDecisionBoundary, ...] = (
        LLMDecisionBoundary.DRAFT,
        LLMDecisionBoundary.SUGGESTION,
        LLMDecisionBoundary.EXPLANATION,
    )
    fallback_failure_modes: tuple[LLMFailureMode, ...] = (
        LLMFailureMode.TIMEOUT,
        LLMFailureMode.INVALID_JSON,
        LLMFailureMode.SAFETY_BOUNDARY_CONFLICT,
        LLMFailureMode.MISSING_REQUIRED_FIELD,
        LLMFailureMode.PROVIDER_UNAVAILABLE,
    )
    safety_statement: str = "LLM can suggest, but cannot approve flight."

    @model_validator(mode="after")
    def require_assistive_llm_boundary(self) -> "LLMUsagePolicy":
        if self.can_approve_flight:
            raise ValueError("LLM can suggest, but cannot approve flight.")
        if self.can_override_hard_constraints:
            raise ValueError("LLM cannot override hard constraints.")
        if self.can_bypass_human_review:
            raise ValueError("LLM cannot bypass human review.")
        if self.can_change_safety_thresholds:
            raise ValueError("LLM cannot change safety thresholds.")

        return self


class LLMDraftBase(BaseModel):
    boundary: LLMDecisionBoundary
    source_type: DataSourceType = DataSourceType.MOCK
    provider: str = Field(default="unassigned", min_length=1)
    deterministic: bool = False
    is_final_decision: bool = False
    requires_rule_validation: bool = True
    requires_human_review: bool = False
    safety_notes: list[str] = Field(default_factory=list)
    missing_fields: list[str] = Field(default_factory=list)
    fallback_reason: str | None = None

    @model_validator(mode="after")
    def require_non_final_draft(self) -> "LLMDraftBase":
        if self.is_final_decision:
            raise ValueError("LLM output must not be marked as a final safety decision.")
        if not self.requires_rule_validation:
            raise ValueError("LLM output must require deterministic rule validation.")

        return self


class TaskUnderstandingDraft(LLMDraftBase):
    boundary: LLMDecisionBoundary = LLMDecisionBoundary.DRAFT
    operation_object: str | None = None
    operation_area: str | None = None
    operation_goals: list[str] = Field(default_factory=list)
    requested_time_window: str | None = None
    risk_preference: str | None = None
    special_constraints: list[str] = Field(default_factory=list)


class ConstraintQuestionDraft(LLMDraftBase):
    boundary: LLMDecisionBoundary = LLMDecisionBoundary.SUGGESTION
    questions: list[str] = Field(default_factory=list)
    suggested_defaults: dict[str, str] = Field(default_factory=dict)


class ExplanationDraft(LLMDraftBase):
    boundary: LLMDecisionBoundary = LLMDecisionBoundary.EXPLANATION
    facts: list[str] = Field(default_factory=list)
    inferences: list[str] = Field(default_factory=list)
    recommended_actions: list[str] = Field(default_factory=list)
    human_confirmation_required: list[str] = Field(default_factory=list)


class ReviewNarrativeDraft(LLMDraftBase):
    boundary: LLMDecisionBoundary = LLMDecisionBoundary.EXPLANATION
    completion_summary: str
    risk_summary: str
    makeup_flight_summary: str
    next_optimization_summary: str


class LLMProvider(Protocol):
    provider_name: str
    usage_policy: LLMUsagePolicy

    def parse_task(
        self,
        raw_user_input: str,
        context: dict[str, Any],
    ) -> TaskUnderstandingDraft:
        """Return a task-understanding draft; never approve flight."""

    def suggest_missing_constraints(
        self,
        task: TaskUnderstandingDraft,
        context: dict[str, Any],
    ) -> ConstraintQuestionDraft:
        """Suggest key missing constraints; never lower safety thresholds."""

    def generate_human_explanation(
        self,
        decision_context: dict[str, Any],
    ) -> ExplanationDraft:
        """Draft human-facing explanation after deterministic decisions exist."""

    def summarize_review(
        self,
        review_context: dict[str, Any],
    ) -> ReviewNarrativeDraft:
        """Draft review narrative after deterministic review data exists."""
