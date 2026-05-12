import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { RiskBadge } from "./components/RiskBadge";
import type { MissionCycleState } from "./types";
import { buttonStyles, cn, panelStyles, textStyles } from "./uiTokens";

const riskLevels = ["critical", "high", "medium", "low"] as const;

type RiskLevelFilter = typeof riskLevels[number] | "all";

export function RiskPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  const [selectedFilter, setSelectedFilter] = useState<RiskLevelFilter>("all");

  const filteredRisks = useMemo(() => {
    if (missionCycle.status !== "ready") {
      return [];
    }

    const sorted = [...missionCycle.plan.risks].sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 } as const;
      return order[a.risk_level] - order[b.risk_level];
    });

    if (selectedFilter === "all") {
      return sorted;
    }

    return sorted.filter((risk) => risk.risk_level === selectedFilter);
  }, [missionCycle, selectedFilter]);

  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Risk Stack" state={missionCycle.status} />;
  }

  return (
    <aside className={panelStyles.base}>
      <PanelTitle icon={AlertTriangle} title="Risk Stack" meta="Explainable" />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DataSourceBadge
          sourceType={missionCycle.plan.mission_task.source_type}
          label="Risk Assessment"
        />
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            className={cn(
              buttonStyles.base,
              buttonStyles.incident,
              selectedFilter === "all" ? buttonStyles.incidentActive : buttonStyles.incidentIdle,
              "text-[11px] px-2",
            )}
            onClick={() => setSelectedFilter("all")}
          >
            All
          </button>
          {riskLevels.map((level) => (
            <button
              key={level}
              type="button"
              className={cn(
                buttonStyles.base,
                buttonStyles.incident,
                selectedFilter === level ? buttonStyles.incidentActive : buttonStyles.incidentIdle,
                "text-[11px] px-2",
              )}
              onClick={() => setSelectedFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {filteredRisks.length === 0 ? (
          <div className={cn(panelStyles.surfacePadded, "text-sm text-zinc-300")}>No risks match the selected filter.</div>
        ) : (
          filteredRisks.map((risk) => (
            <article className={panelStyles.surfacePadded} key={risk.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{risk.category}</p>
                  <p className={cn(textStyles.label, "mt-1")}>{risk.trigger_condition}</p>
                </div>
                <RiskBadge level={risk.risk_level} />
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">Description</p>
                  <p className={cn(textStyles.body, "mt-1")}>{risk.description}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Mitigation</p>
                  <p className={cn(textStyles.muted, "mt-1")}>{risk.mitigation}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Evidence</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                    {risk.evidence.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                {risk.requires_human_confirmation ? (
                  <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-100">
                    Requires human confirmation
                  </div>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
