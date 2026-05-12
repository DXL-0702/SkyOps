import { ShieldAlert } from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import type { MissionCycleState } from "./types";
import { badgeStyles, cn, panelStyles, textStyles } from "./uiTokens";

type LimitStatus = "within" | "watch" | "triggered";

type ThresholdItem = {
  id: string;
  label: string;
  currentValue: string;
  limitValue: string;
  status: LimitStatus;
  explanation: string;
};

function getMaxLimitStatus(current: number, max: number): LimitStatus {
  if (current >= max) {
    return "triggered";
  }

  if (current >= max * 0.8) {
    return "watch";
  }

  return "within";
}

function getMinLimitStatus(current: number, min: number, watchMargin: number): LimitStatus {
  if (current <= min) {
    return "triggered";
  }

  if (current <= min + watchMargin) {
    return "watch";
  }

  return "within";
}

function getStatusLabel(status: LimitStatus): string {
  if (status === "triggered") {
    return "TRIGGERED";
  }

  if (status === "watch") {
    return "WATCH";
  }

  return "WITHIN LIMIT";
}

function getStatusBadgeClass(status: LimitStatus): string {
  if (status === "triggered") {
    return badgeStyles.danger;
  }

  if (status === "watch") {
    return badgeStyles.warning;
  }

  return badgeStyles.success;
}

function getStatusSurfaceClass(status: LimitStatus): string {
  if (status === "triggered") {
    return "border-red-400/40 bg-red-400/10";
  }

  if (status === "watch") {
    return "border-amber-400/40 bg-amber-400/10";
  }

  return panelStyles.surfacePadded;
}

function LimitStatusBadge({ status }: { status: LimitStatus }) {
  return (
    <span className={cn(badgeStyles.base, getStatusBadgeClass(status))}>
      {getStatusLabel(status)}
    </span>
  );
}

function ThresholdCard({ item }: { item: ThresholdItem }) {
  return (
    <article className={cn("p-4", getStatusSurfaceClass(item.status))}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={textStyles.strongLabel}>{item.label}</p>
          <p className="mt-2 text-sm font-semibold text-white">Current: {item.currentValue}</p>
          <p className={cn(textStyles.subtle, "mt-1")}>Limit: {item.limitValue}</p>
        </div>
        <LimitStatusBadge status={item.status} />
      </div>
      <p className={cn(textStyles.body, "mt-3")}>{item.explanation}</p>
    </article>
  );
}

function AbortRuleCard({ condition }: { condition: string }) {
  return (
    <article className={cn(panelStyles.surfacePadded, "border-l-2 border-l-red-400/70")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="break-words text-sm font-semibold text-white">{condition}</p>
        <span className={cn(badgeStyles.base, badgeStyles.danger)}>ABORT RULE</span>
      </div>
      <p className={cn(textStyles.muted, "mt-2")}>
        Rule is defined as a conservative stop condition. It stays neutral until current
        telemetry enters watch or triggered range.
      </p>
    </article>
  );
}

export function SafetyThresholdPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Safety Thresholds" state={missionCycle.status} />;
  }

  const { environment_state: environment, drone_state: drone, mission_plan: missionPlan } =
    missionCycle.plan;
  const thresholds = missionPlan.safety_thresholds;

  const thresholdItems: ThresholdItem[] = [
    {
      id: "wind",
      label: "Wind Speed",
      currentValue: `${environment.wind_speed_mps} m/s`,
      limitValue: `<= ${thresholds.max_wind_speed_mps} m/s`,
      status: getMaxLimitStatus(environment.wind_speed_mps, thresholds.max_wind_speed_mps),
      explanation:
        "Abort if wind reaches the configured limit. Upper facade operations should keep extra margin for gust exposure.",
    },
    {
      id: "battery",
      label: "Battery Reserve",
      currentValue: `${drone.battery_percent}%`,
      limitValue: `> ${thresholds.min_battery_percent}%`,
      status: getMinLimitStatus(drone.battery_percent, thresholds.min_battery_percent, 10),
      explanation:
        "Abort if battery crosses the safe return margin. The plan should preserve enough reserve for return and contingency.",
    },
    {
      id: "gps",
      label: "GPS Confidence",
      currentValue: environment.gps_confidence.toFixed(2),
      limitValue: `>= ${thresholds.min_gps_confidence.toFixed(2)}`,
      status: getMinLimitStatus(environment.gps_confidence, thresholds.min_gps_confidence, 0.1),
      explanation:
        "Abort or switch to conservative standoff if GPS confidence drops below the navigation threshold.",
    },
    {
      id: "video",
      label: "Video Latency",
      currentValue: `${drone.video_latency_ms} ms`,
      limitValue: `<= ${thresholds.max_video_latency_ms} ms`,
      status: getMaxLimitStatus(drone.video_latency_ms, thresholds.max_video_latency_ms),
      explanation:
        "Abort or pause close-range work if video latency exceeds the maximum safe monitoring threshold.",
    },
  ];

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={ShieldAlert} title="Safety Thresholds" meta="Abort Logic" />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge sourceType={environment.source_type} label="Environment" />
        <DataSourceBadge sourceType={drone.source_type} label="Drone" />
        <DataSourceBadge sourceType={missionCycle.plan.mission_task.source_type} label="Rules" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        {thresholdItems.map((item) => (
          <ThresholdCard item={item} key={item.id} />
        ))}
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={textStyles.strongLabel}>Abort Conditions</p>
          <span className={cn(badgeStyles.base, badgeStyles.neutral)}>RULE ONLY</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {missionPlan.abort_conditions.map((condition) => (
            <AbortRuleCard condition={condition} key={condition} />
          ))}
        </div>
      </div>
    </section>
  );
}
