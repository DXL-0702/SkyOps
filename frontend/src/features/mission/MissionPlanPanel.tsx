import { Route } from "lucide-react";

import { Metric } from "./components/Metric";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { SectionLabel } from "./components/SectionLabel";
import type { MissionCycleState } from "./types";

export function MissionPlanPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Mission Plan" state={missionCycle.status} />;
  }

  const { plan } = missionCycle;
  const thresholds = plan.mission_plan.safety_thresholds;
  const thresholdItems = [
    ["Wind", `${thresholds.max_wind_speed_mps} m/s`],
    ["Battery", `${thresholds.min_battery_percent}%`],
    ["GPS", thresholds.min_gps_confidence.toFixed(2)],
    ["Video", `${thresholds.max_video_latency_ms} ms`],
  ];

  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={Route} title="Mission Plan" meta={plan.mission_task.source_type} />

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label="Coverage" value={`${plan.mission_plan.expected_coverage_percent}%`} />
        <Metric label="Duration" value={`${plan.mission_plan.estimated_duration_minutes} min`} />
        <Metric label="Wind" value={`${plan.environment_state.wind_speed_mps} m/s`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Time Window
          </p>
          <p className="mt-2 text-sm font-semibold leading-5 text-white">
            {plan.mission_plan.recommended_time_window}
          </p>
          <p className="mt-3 text-xs leading-5 text-zinc-400">
            {plan.mission_task.operation_object}
          </p>
        </div>

        <div className="border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Route Strategy
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-200">
            {plan.mission_plan.route_strategy}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionLabel label="Flight Segments" />
          <div className="mt-3 grid gap-2">
            {plan.mission_plan.flight_segments.map((segment, index) => (
              <div
                className="flex items-center gap-3 border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300"
                key={segment}
              >
                <span className="flex h-6 w-6 items-center justify-center bg-teal-300/15 text-xs font-semibold text-teal-200">
                  {index + 1}
                </span>
                {segment}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Safety Thresholds" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {thresholdItems.map(([label, value]) => (
              <Metric key={label} label={label} value={value} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
