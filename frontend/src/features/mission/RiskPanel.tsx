import { AlertTriangle, CheckCircle2, Filter, ShieldAlert, UserCheck } from "lucide-react";
import { useState } from "react";

import type { RiskItem, RiskLevel } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { RiskBadge } from "./components/RiskBadge";
import { SectionLabel } from "./components/SectionLabel";
import type { MissionCycleState } from "./types";
import {
  badgeStyles,
  buttonStyles,
  cn,
  listStyles,
  panelStyles,
  riskSurfaceStyles,
  textStyles,
} from "./uiTokens";

type RiskFilter = "all" | RiskLevel;

const riskPriority: Record<RiskLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const filterOptions: Array<{ label: string; value: RiskFilter }> = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

function getRiskSurfaceClass(level: RiskLevel): string {
  return riskSurfaceStyles[level] ?? riskSurfaceStyles.default;
}

function getRiskDecisionType(level: RiskLevel): string {
  if (level === "critical") {
    return "Blocking risk";
  }

  if (level === "high") {
    return "Abort or manual review";
  }

  if (level === "medium") {
    return "Watch and constrain";
  }

  return "Monitor";
}

function getDecisionImpacts(risk: RiskItem): string[] {
  const text = `${risk.category} ${risk.description} ${risk.trigger_condition} ${risk.mitigation}`.toLowerCase();
  const impacts = new Set<string>();

  if (text.includes("wind") || text.includes("weather")) {
    impacts.add("May shift the recommended time window or trigger wind abort thresholds.");
  }

  if (text.includes("gps") || text.includes("signal")) {
    impacts.add("May require a conservative route strategy and larger standoff distance.");
  }

  if (text.includes("battery") || text.includes("endurance")) {
    impacts.add("May force task splitting, return-to-home, or supplement flight planning.");
  }

  if (text.includes("crowd") || text.includes("pedestrian") || text.includes("people")) {
    impacts.add("May pause low-altitude work or move launch and landing operations.");
  }

  if (text.includes("airspace") || text.includes("restricted") || text.includes("approval")) {
    impacts.add("May block execution until compliance review or approval is confirmed.");
  }

  if (text.includes("video") || text.includes("latency") || text.includes("link")) {
    impacts.add("May pause close-range segments or request manual takeover.");
  }

  if (impacts.size === 0) {
    impacts.add("Review before execution and keep this risk visible during replanning.");
  }

  return Array.from(impacts).slice(0, 3);
}

function RiskSummary({
  risks,
  filteredCount,
}: {
  risks: RiskItem[];
  filteredCount: number;
}) {
  const criticalOrHigh = risks.filter(
    (risk) => risk.risk_level === "critical" || risk.risk_level === "high",
  ).length;
  const manualCount = risks.filter((risk) => risk.requires_human_confirmation).length;

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className={panelStyles.surfacePadded}>
        <p className={textStyles.strongLabel}>Visible Risks</p>
        <p className="mt-2 text-2xl font-semibold text-white">{filteredCount}</p>
      </div>
      <div className={cn(panelStyles.surfacePadded, "border-red-400/30 bg-red-400/5")}>
        <p className={textStyles.strongLabel}>High Priority</p>
        <p className="mt-2 text-2xl font-semibold text-red-100">{criticalOrHigh}</p>
      </div>
      <div className={cn(panelStyles.surfacePadded, "border-amber-400/30 bg-amber-400/5")}>
        <p className={textStyles.strongLabel}>Human Confirm</p>
        <p className="mt-2 text-2xl font-semibold text-amber-100">{manualCount}</p>
      </div>
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskItem }) {
  const decisionImpacts = getDecisionImpacts(risk);

  return (
    <article className={cn("border p-4", getRiskSurfaceClass(risk.risk_level))}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words text-sm font-semibold text-white">{risk.category}</p>
            <span className={cn(badgeStyles.base, badgeStyles.neutral)}>
              {getRiskDecisionType(risk.risk_level)}
            </span>
          </div>
          <p className={cn(textStyles.label, "mt-2 break-words")}>{risk.trigger_condition}</p>
        </div>
        <RiskBadge level={risk.risk_level} />
      </div>

      <p className={cn(textStyles.body, "mt-3 text-zinc-200")}>{risk.description}</p>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <div>
          <SectionLabel label="Mitigation" />
          <div className={cn(listStyles.item, "mt-2")}>
            <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-teal-200" size={15} />
            <span>{risk.mitigation}</span>
          </div>
        </div>

        <div>
          <SectionLabel label="Human Confirmation" />
          <div className={cn(listStyles.item, "mt-2")}>
            {risk.requires_human_confirmation ? (
              <UserCheck aria-hidden="true" className="mt-0.5 shrink-0 text-amber-200" size={15} />
            ) : (
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-teal-200"
                size={15}
              />
            )}
            <span>
              {risk.requires_human_confirmation
                ? "Required before execution or replanning."
                : "Not required by this risk item; continue monitoring."}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <div>
          <SectionLabel label="Decision Impact" />
          <div className="mt-2 grid gap-2">
            {decisionImpacts.map((impact) => (
              <div className={listStyles.item} key={impact}>
                <span className={listStyles.dot} />
                <span>{impact}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Evidence" />
          <div className="mt-2 grid gap-2">
            {risk.evidence.map((item) => (
              <div className={listStyles.item} key={item}>
                <span className={listStyles.dot} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function RiskPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  const [activeFilter, setActiveFilter] = useState<RiskFilter>("all");

  if (missionCycle.status !== "ready") {
    return (
      <PanelFallback
        title="Risk Stack"
        state={missionCycle.status}
        message={
          missionCycle.status === "failed"
            ? missionCycle.message
            : "Waiting for risk simulation results from the mission decision loop."
        }
      />
    );
  }

  const sortedRisks = [...missionCycle.plan.risks].sort(
    (left, right) => riskPriority[left.risk_level] - riskPriority[right.risk_level],
  );
  const filteredRisks =
    activeFilter === "all"
      ? sortedRisks
      : sortedRisks.filter((risk) => risk.risk_level === activeFilter);

  return (
    <aside className={panelStyles.base}>
      <PanelTitle icon={AlertTriangle} title="Risk Stack" meta="Explainable" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <DataSourceBadge
            sourceType={missionCycle.plan.mission_task.source_type}
            label="Risk Assessment"
          />
          <span className={cn(badgeStyles.base, badgeStyles.neutral)}>Sorted by severity</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Filter aria-hidden="true" size={14} />
          <span>Filter</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            className={cn(
              buttonStyles.base,
              buttonStyles.filter,
              activeFilter === option.value ? buttonStyles.filterActive : buttonStyles.filterIdle,
            )}
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <RiskSummary risks={sortedRisks} filteredCount={filteredRisks.length} />

      <div className="mt-4 grid gap-3">
        {filteredRisks.length > 0 ? (
          filteredRisks.map((risk) => <RiskCard key={risk.id} risk={risk} />)
        ) : (
          <div className={cn(panelStyles.surfacePadded, "text-sm text-zinc-300")}>
            No risks match this filter. The complete risk assessment is still available under
            other severity levels.
          </div>
        )}
      </div>
    </aside>
  );
}
