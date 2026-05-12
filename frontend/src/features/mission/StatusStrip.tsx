import { Activity, CircleDot, GitBranch, MapPinned } from "lucide-react";

import { StatusTile } from "./components/StatusTile";
import type { HealthState, MissionCycleState } from "./types";

type StatusStripProps = {
  health: HealthState;
  missionCycle: MissionCycleState;
};

export function StatusStrip({ health, missionCycle }: StatusStripProps) {
  const missionStatus =
    missionCycle.status === "ready"
      ? "Decision loop ready"
      : missionCycle.status === "failed"
        ? "Decision loop failed"
        : "Decision loop running";

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <StatusTile label="Backend" value={health.status} icon={Activity} />
      <StatusTile label="Scenario" value="Shenzhen high-rise" icon={MapPinned} />
      <StatusTile label="Data Mode" value="Mock / simulated" icon={CircleDot} />
      <StatusTile label="Loop" value={missionStatus} icon={GitBranch} />
    </section>
  );
}
