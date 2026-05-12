import { AlertTriangle } from "lucide-react";

import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { RiskBadge } from "./components/RiskBadge";
import type { MissionCycleState } from "./types";

export function RiskPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Risk Stack" state={missionCycle.status} />;
  }

  return (
    <aside className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={AlertTriangle} title="Risk Stack" meta="Explainable" />

      <div className="mt-4 grid gap-3">
        {missionCycle.plan.risks.map((risk) => (
          <article className="border border-zinc-800 bg-zinc-950/70 p-4" key={risk.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{risk.category}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {risk.trigger_condition}
                </p>
              </div>
              <RiskBadge level={risk.risk_level} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{risk.description}</p>
            <p className="mt-3 text-xs leading-5 text-zinc-500">{risk.mitigation}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
