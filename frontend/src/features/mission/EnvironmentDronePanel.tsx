import { CloudSun } from "lucide-react";

import type { RiskLevel } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { Metric } from "./components/Metric";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { RiskBadge } from "./components/RiskBadge";
import { SectionLabel } from "./components/SectionLabel";
import type { Locale } from "./i18n";
import { t } from "./i18n";
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

export function EnvironmentDronePanel({
  locale,
  missionCycle,
}: {
  locale: Locale;
  missionCycle: MissionCycleState;
}) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback locale={locale} title="Environment & Drone" state={missionCycle.status} />;
  }

  const { environment_state: environment, drone_state: drone } = missionCycle.plan;
  const gpsRiskLevel = getConfidenceRiskLevel(environment.gps_confidence);
  const dataConfidenceRiskLevel = getConfidenceRiskLevel(environment.data_confidence);
  const videoLatencyRiskLevel = getVideoLatencyRiskLevel(drone.video_latency_ms);

  return (
    <section className={panelStyles.base}>
      <PanelTitle
        icon={CloudSun}
        title={t(locale, "Environment & Drone")}
        meta={t(locale, "Planning Inputs")}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge locale={locale} sourceType={environment.source_type} label="Environment" />
        <DataSourceBadge locale={locale} sourceType={drone.source_type} label="Drone" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionLabel label={t(locale, "Environment State")} />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Metric label={t(locale, "Wind")} value={`${environment.wind_speed_mps} m/s`} compact />
            <Metric label={t(locale, "Visibility")} value={t(locale, environment.visibility_level)} compact />
            <Metric label={t(locale, "GPS Confidence")} value={environment.gps_confidence.toFixed(2)} compact />
            <Metric
              label={t(locale, "Data Confidence")}
              value={environment.data_confidence.toFixed(2)}
              compact
            />
          </div>

          <div className={cn(panelStyles.textSurface, "mt-3")}>
            {t(locale, environment.weather_summary)}
          </div>

          <div className="mt-3 grid gap-2">
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span className="min-w-0 flex-1 break-words">{t(locale, environment.gps_quality)}</span>
              <RiskBadge locale={locale} level={gpsRiskLevel} />
            </div>
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span className="min-w-0 flex-1">{t(locale, "Crowd level")}</span>
              <RiskBadge locale={locale} level={environment.crowd_level} />
            </div>
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span className="min-w-0 flex-1">{t(locale, "Data confidence")}</span>
              <RiskBadge locale={locale} level={dataConfidenceRiskLevel} />
            </div>
          </div>
        </div>

        <div>
          <SectionLabel label={t(locale, "Drone State")} />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Metric label={t(locale, "Battery")} value={`${drone.battery_percent}%`} compact />
            <Metric label={t(locale, "Endurance")} value={`${drone.estimated_endurance_minutes} min`} compact />
            <Metric
              label={t(locale, "RTH Battery")}
              value={`${drone.return_to_home_battery_threshold}%`}
              compact
            />
            <Metric label={t(locale, "Video Latency")} value={`${drone.video_latency_ms} ms`} compact />
          </div>

          <div className={cn(panelStyles.surfacePadded, "mt-3")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={textStyles.strongLabel}>{t(locale, "Aircraft")}</p>
                <p className="mt-2 break-words text-sm font-semibold text-white">
                  {drone.drone_id}
                </p>
                <p className={cn(textStyles.subtle, "mt-1 break-words")}>{t(locale, drone.model)}</p>
              </div>
              <span
                className={cn(
                  badgeStyles.base,
                  drone.available_for_mission ? badgeStyles.success : badgeStyles.danger,
                )}
              >
                {t(locale, drone.available_for_mission ? "AVAILABLE" : "UNAVAILABLE")}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={textStyles.strongLabel}>{t(locale, "Link Quality")}</span>
            <RiskBadge locale={locale} level={drone.link_quality} />
            <span className={textStyles.strongLabel}>{t(locale, "Video Latency")}</span>
            <RiskBadge locale={locale} level={videoLatencyRiskLevel} />
          </div>

          <div className="mt-3 grid gap-2">
            {drone.payloads.map((payload) => (
              <div className={listStyles.item} key={payload}>
                <span className={listStyles.dot} />
                <span>{t(locale, payload)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
