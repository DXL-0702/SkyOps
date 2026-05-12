import { CloudSun } from "lucide-react";

import type { RiskLevel } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { Metric } from "./components/Metric";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { RiskBadge } from "./components/RiskBadge";
import { SectionLabel } from "./components/SectionLabel";
import type { MissionCycleState } from "./types";
import { badgeStyles, cn, listStyles, panelStyles, textStyles } from "./uiTokens";

function getConfidenceRiskLevel(value: number): RiskLevel {
  if (value < 0.5) {
    return "critical";
  }

  if (value < 0.65) {
    return "high";
  }

  if (value < 0.8) {
    return "medium";
  }

  return "low";
}

function getVideoLatencyRiskLevel(value: number): RiskLevel {
  if (value > 800) {
    return "critical";
  }

  if (value > 500) {
    return "high";
  }

  if (value > 300) {
    return "medium";
  }

  return "low";
}

export function EnvironmentDronePanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Environment & Drone" state={missionCycle.status} />;
  }

  const { environment_state: environment, drone_state: drone } = missionCycle.plan;
  const gpsRiskLevel = getConfidenceRiskLevel(environment.gps_confidence);
  const dataConfidenceRiskLevel = getConfidenceRiskLevel(environment.data_confidence);
  const videoLatencyRiskLevel = getVideoLatencyRiskLevel(drone.video_latency_ms);

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={CloudSun} title="Environment & Drone" meta="Planning Inputs" />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge sourceType={environment.source_type} label="Environment" />
        <DataSourceBadge sourceType={drone.source_type} label="Drone" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionLabel label="Environment State" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Metric label="Wind" value={`${environment.wind_speed_mps} m/s`} compact />
            <Metric label="Visibility" value={environment.visibility_level} compact />
            <Metric label="GPS Confidence" value={environment.gps_confidence.toFixed(2)} compact />
            <Metric
              label="Data Confidence"
              value={environment.data_confidence.toFixed(2)}
              compact
            />
          </div>

          <div className={cn(panelStyles.textSurface, "mt-3")}>
            {environment.weather_summary}
          </div>

          <div className="mt-3 grid gap-2">
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span className="min-w-0 flex-1 break-words">{environment.gps_quality}</span>
              <RiskBadge level={gpsRiskLevel} />
            </div>
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span className="min-w-0 flex-1">Crowd level</span>
              <RiskBadge level={environment.crowd_level} />
            </div>
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span className="min-w-0 flex-1">Data confidence</span>
              <RiskBadge level={dataConfidenceRiskLevel} />
            </div>
          </div>
        </div>

        <div>
          <SectionLabel label="Drone State" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Metric label="Battery" value={`${drone.battery_percent}%`} compact />
            <Metric label="Endurance" value={`${drone.estimated_endurance_minutes} min`} compact />
            <Metric
              label="RTH Battery"
              value={`${drone.return_to_home_battery_threshold}%`}
              compact
            />
            <Metric label="Video Latency" value={`${drone.video_latency_ms} ms`} compact />
          </div>

          <div className={cn(panelStyles.surfacePadded, "mt-3")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={textStyles.strongLabel}>Aircraft</p>
                <p className="mt-2 break-words text-sm font-semibold text-white">
                  {drone.drone_id}
                </p>
                <p className={cn(textStyles.subtle, "mt-1 break-words")}>{drone.model}</p>
              </div>
              <span
                className={cn(
                  badgeStyles.base,
                  drone.available_for_mission ? badgeStyles.success : badgeStyles.danger,
                )}
              >
                {drone.available_for_mission ? "AVAILABLE" : "UNAVAILABLE"}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={textStyles.strongLabel}>Link Quality</span>
            <RiskBadge level={drone.link_quality} />
            <span className={textStyles.strongLabel}>Video Latency</span>
            <RiskBadge level={videoLatencyRiskLevel} />
          </div>

          <div className="mt-3 grid gap-2">
            {drone.payloads.map((payload) => (
              <div className={listStyles.item} key={payload}>
                <span className={listStyles.dot} />
                <span>{payload}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
