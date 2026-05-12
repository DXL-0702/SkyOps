import { AlertTriangle } from "lucide-react";

import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { RiskBadge } from "./components/RiskBadge";
import type { MissionCycleState } from "./types";
import { cn, panelStyles, textStyles } from "./uiTokens";

export function RiskPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Risk Stack" state={missionCycle.status} />;
  }

  return (
    <aside className={panelStyles.base}>
      <PanelTitle icon={AlertTriangle} title="Risk Stack" meta="Explainable" />

      <div className="mt-4 grid gap-3">
        {missionCycle.plan.risks.map((risk) => (
          <article className={panelStyles.surfacePadded} key={risk.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{risk.category}</p>
                <p className={cn(textStyles.label, "mt-1")}>{risk.trigger_condition}</p>
              </div>
              <RiskBadge level={risk.risk_level} />
            </div>
            <p className={cn(textStyles.body, "mt-3")}>{risk.description}</p>
            <p className={cn(textStyles.muted, "mt-3")}>{risk.mitigation}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
