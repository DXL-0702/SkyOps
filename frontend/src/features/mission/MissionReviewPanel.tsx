import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  Plane,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { ProgressMetric } from "./components/ProgressMetric";
import { SectionLabel } from "./components/SectionLabel";
import type { MissionCycleState } from "./types";
import { badgeStyles, cn, listStyles, panelStyles, stateStyles, textStyles } from "./uiTokens";

function normalizeTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          return Object.entries(item)
            .filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined)
            .map(([key, fieldValue]) => `${key}: ${String(fieldValue)}`)
            .join("; ");
        }

        return String(item ?? "").trim();
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (value && typeof value === "object") {
    return [
      Object.entries(value)
        .filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined)
        .map(([key, fieldValue]) => `${key}: ${String(fieldValue)}`)
        .join("; "),
    ].filter(Boolean);
  }

  return [];
}

function isNoIncidentReviewNote(item: string): boolean {
  const normalizedItem = item.toLowerCase();
  return normalizedItem.includes("no incident") && normalizedItem.includes("review");
}

function ReportList({
  title,
  items,
  emptyMessage,
  icon,
  tone,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
  icon: LucideIcon;
  tone: "teal" | "amber" | "red" | "zinc";
}) {
  const Icon = icon;
  const iconColor = {
    teal: "text-teal-200",
    amber: "text-amber-200",
    red: "text-red-200",
    zinc: "text-zinc-400",
  }[tone];

  return (
    <div>
      <SectionLabel label={title} />
      {items.length === 0 ? (
        <div className={cn(stateStyles.loadingSurface, "mt-3")}>
          <p className={textStyles.subtle}>{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {items.map((item, index) => (
            <div className={listStyles.item} key={`${title}-${item}-${index}`}>
              <Icon aria-hidden="true" className={cn("mt-0.5 shrink-0", iconColor)} size={15} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MissionReviewPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Mission Review" state={missionCycle.status} />;
  }

  const review = missionCycle.review.mission_review;
  const rawRiskTriggerLog = normalizeTextList(review.risk_trigger_log);
  const reviewHasNoIncidentEvents = rawRiskTriggerLog.some(isNoIncidentReviewNote);
  const incidentEvents = reviewHasNoIncidentEvents
    ? []
    : normalizeTextList(
        missionCycle.incidentEvent
          ? [
              `${missionCycle.incidentEvent.event_type}: observed ${missionCycle.incidentEvent.observed_value} against threshold ${missionCycle.incidentEvent.threshold}.`,
            ]
          : [],
      );
  const riskTriggerLog = reviewHasNoIncidentEvents ? [] : rawRiskTriggerLog;
  const uncoveredAreas = normalizeTextList(review.uncovered_areas);
  const makeupFlightPlan = normalizeTextList(review.makeup_flight_plan);
  const humanReviewChecklist = normalizeTextList(review.human_review_checklist);
  const nextMissionOptimizations = normalizeTextList(review.next_mission_optimizations);
  const hasMakeupFlightSuggestion =
    makeupFlightPlan.length > 0 &&
    !makeupFlightPlan.every((item) => item.toLowerCase().includes("no makeup flight"));

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={CheckCircle2} title="Mission Review" meta={review.mission_id} />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge sourceType={missionCycle.plan.mission_task.source_type} label="Mission" />
        <DataSourceBadge sourceType={missionCycle.incidentEvent.source_type} label="Incident" />
        <DataSourceBadge sourceType="mock" label="Review Result" />
      </div>

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionLabel label="Review Report" />
          <span
            className={cn(
              badgeStyles.base,
              hasMakeupFlightSuggestion ? badgeStyles.warning : badgeStyles.success,
            )}
          >
            {hasMakeupFlightSuggestion ? "Makeup Flight Suggested" : "No Makeup Flight Required"}
          </span>
        </div>
        <p className={cn(textStyles.subtle, "mt-2")}>
          Mission completion, data quality, triggered risks, uncovered work, and next-step review
          items are generated from mock review data.
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ProgressMetric label="Mission Completion" value={review.completion_rate} />
        <ProgressMetric label="Data Quality" value={review.data_quality_score} />
      </div>

      <div className="mt-4">
        <ReportList
          emptyMessage="No incident events recorded for this review."
          icon={Zap}
          items={incidentEvents}
          title="Incident Events"
          tone="amber"
        />
      </div>

      <div className="mt-4">
        <ReportList
          emptyMessage="No risk triggers recorded."
          icon={AlertTriangle}
          items={riskTriggerLog}
          title="Risk Trigger Log"
          tone="red"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ReportList
          emptyMessage="No uncovered area"
          icon={MapPinned}
          items={uncoveredAreas}
          title="Uncovered Areas"
          tone="amber"
        />
        <ReportList
          emptyMessage="No makeup flight required"
          icon={Plane}
          items={makeupFlightPlan}
          title="Makeup Flight Plan"
          tone={hasMakeupFlightSuggestion ? "amber" : "teal"}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ReportList
          emptyMessage="No human review checklist available."
          icon={ClipboardCheck}
          items={humanReviewChecklist}
          title="Human Review Checklist"
          tone="amber"
        />
        <ReportList
          emptyMessage="No next mission optimizations available."
          icon={Sparkles}
          items={nextMissionOptimizations}
          title="Next Mission Optimizations"
          tone="teal"
        />
      </div>
    </section>
  );
}
