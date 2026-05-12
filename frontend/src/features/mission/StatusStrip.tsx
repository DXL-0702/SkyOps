import { Activity, CircleDot, GitBranch, MapPinned } from "lucide-react";

import { StatusTile } from "./components/StatusTile";
import type { HealthState, MissionCycleState } from "./types";

type StatusStripProps = {
  health: HealthState;
  missionCycle: MissionCycleState;
};

export function StatusStrip({ health, missionCycle }: StatusStripProps) {
  const backendStatus =
    health.status === "online" ? "Connected" : health.status === "offline" ? "Not connected" : "Checking";
  const missionStatus =
    missionCycle.status === "ready"
      ? "Ready"
      : missionCycle.status === "failed"
        ? "Needs retry"
        : "Running checks";

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <StatusTile label="Backend" value={backendStatus} icon={Activity} />
      <StatusTile label="Scenario" value="Shenzhen high-rise" icon={MapPinned} />
      <StatusTile label="Data Mode" value="Mock / simulated" icon={CircleDot} />
      <StatusTile label="Loop" value={missionStatus} icon={GitBranch} />
    </section>
  );
}
