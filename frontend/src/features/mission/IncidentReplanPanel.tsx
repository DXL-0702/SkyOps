import { GitBranch } from "lucide-react";

import { ActionList } from "./components/ActionList";
import { Metric } from "./components/Metric";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import type { MissionCycleState } from "./types";
import { cn, panelStyles } from "./uiTokens";

export function IncidentReplanPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Incident Replanning" state={missionCycle.status} />;
  }

  const decision = missionCycle.replan.replan_decision;

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={GitBranch} title="Incident Replanning" meta={decision.incident_id} />

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label="Decision" value={decision.decision} />
        <Metric label="Makeup" value={decision.makeup_flight_required ? "Required" : "No"} />
        <Metric label="Takeover" value={decision.human_takeover_required ? "Required" : "No"} />
      </div>

      <p className={cn(panelStyles.textSurface, "mt-4")}>{decision.reason}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ActionList title="Actions" items={decision.actions} tone="teal" />
        <ActionList
          title="Rejected Alternatives"
          items={decision.alternatives_considered}
          tone="amber"
        />
      </div>
    </section>
  );
}
