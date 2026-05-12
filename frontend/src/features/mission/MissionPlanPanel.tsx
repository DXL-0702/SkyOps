import { Route } from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { Metric } from "./components/Metric";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { SectionLabel } from "./components/SectionLabel";
import type { MissionCycleState } from "./types";
import { cn, listStyles, panelStyles, textStyles } from "./uiTokens";

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
    <section className={panelStyles.base}>
      <PanelTitle icon={Route} title="Mission Plan" meta="Planning" />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge sourceType={plan.mission_task.source_type} label="Mission Task" />
        <DataSourceBadge sourceType={plan.environment_state.source_type} label="Environment" />
        <DataSourceBadge sourceType={plan.airspace_constraint.source_type} label="Airspace" />
        <DataSourceBadge sourceType={plan.drone_state.source_type} label="Drone" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label="Coverage" value={`${plan.mission_plan.expected_coverage_percent}%`} />
        <Metric label="Duration" value={`${plan.mission_plan.estimated_duration_minutes} min`} />
        <Metric label="Wind" value={`${plan.environment_state.wind_speed_mps} m/s`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>Time Window</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-white">
            {plan.mission_plan.recommended_time_window}
          </p>
          <p className={cn(textStyles.subtle, "mt-3")}>
            {plan.mission_task.operation_object}
          </p>
        </div>

        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>Route Strategy</p>
          <p className={cn(textStyles.body, "mt-2 text-zinc-200")}>
            {plan.mission_plan.route_strategy}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionLabel label="Flight Segments" />
          <div className="mt-3 grid gap-2">
            {plan.mission_plan.flight_segments.map((segment, index) => (
              <div className={listStyles.numberedItem} key={segment}>
                <span className={listStyles.number}>{index + 1}</span>
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
