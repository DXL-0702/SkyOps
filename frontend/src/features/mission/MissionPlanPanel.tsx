import { Route } from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { Metric } from "./components/Metric";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { SectionLabel } from "./components/SectionLabel";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { MissionCycleState } from "./types";
import { cn, listStyles, panelStyles, textStyles } from "./uiTokens";

export function MissionPlanPanel({
  locale,
  missionCycle,
}: {
  locale: Locale;
  missionCycle: MissionCycleState;
}) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback locale={locale} title="Mission Plan" state={missionCycle.status} />;
  }

  const { plan } = missionCycle;
  const missionTask = plan.mission_task;
  const missionPlan = plan.mission_plan;
  const thresholds = plan.mission_plan.safety_thresholds;
  const thresholdItems = [
    ["Wind", `${thresholds.max_wind_speed_mps} m/s`],
    ["Battery", `${thresholds.min_battery_percent}%`],
    ["GPS", thresholds.min_gps_confidence.toFixed(2)],
    ["Video", `${thresholds.max_video_latency_ms} ms`],
  ];

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={Route} title={t(locale, "Mission Plan")} meta={t(locale, "Planning")} />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge
          locale={locale}
          sourceType={plan.mission_task.source_type}
          label="Mission Task Source"
        />
        <DataSourceBadge
          locale={locale}
          sourceType={plan.environment_state.source_type}
          label="Environment"
        />
        <DataSourceBadge
          locale={locale}
          sourceType={plan.airspace_constraint.source_type}
          label="Airspace"
        />
        <DataSourceBadge locale={locale} sourceType={plan.drone_state.source_type} label="Drone" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label={t(locale, "Coverage")} value={`${missionPlan.expected_coverage_percent}%`} />
        <Metric label={t(locale, "Duration")} value={`${missionPlan.estimated_duration_minutes} min`} />
        <Metric label={t(locale, "Wind")} value={`${plan.environment_state.wind_speed_mps} m/s`} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{t(locale, "Operation Object")}</p>
          <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
            {t(locale, missionTask.operation_object)}
          </p>
        </div>

        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{t(locale, "Operation Area")}</p>
          <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
            {t(locale, missionTask.operation_area)}
          </p>
        </div>

        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{t(locale, "Risk Preference")}</p>
          <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">
            {t(locale, missionTask.risk_preference)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <SectionLabel label={t(locale, "Operation Goals")} />
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {missionTask.operation_goals.map((goal) => (
            <div className={listStyles.item} key={goal}>
              <span className={listStyles.dot} />
              <span>{t(locale, goal)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{t(locale, "Time Window")}</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-white">
            {t(locale, missionPlan.recommended_time_window)}
          </p>
          <p className={cn(textStyles.subtle, "mt-3")}>
            {t(locale, "Requested")}: {t(locale, missionTask.requested_time_window)}
          </p>
        </div>

        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{t(locale, "Route Strategy")}</p>
          <p className={cn(textStyles.body, "mt-2 text-zinc-200")}>
            {t(locale, missionPlan.route_strategy)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <SectionLabel label={t(locale, "Launch And Landing Points")} />
        <div className="mt-3 grid gap-3">
          {missionPlan.launch_landing_points.map((point) => (
            <article className={panelStyles.surfacePadded} key={point.id}>
              <p className="break-words text-sm font-semibold text-white">
                {t(locale, point.name)}
              </p>
              <p className={cn(textStyles.body, "mt-2")}>{t(locale, point.description)}</p>
              <div className="mt-3 grid gap-2">
                {point.safety_notes.map((note) => (
                  <div className={listStyles.item} key={note}>
                    <span className={listStyles.dot} />
                    <span>{t(locale, note)}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionLabel label={t(locale, "Flight Segments")} />
          <div className="mt-3 grid gap-2">
            {missionPlan.flight_segments.map((segment, index) => (
              <div className={listStyles.numberedItem} key={segment}>
                <span className={listStyles.number}>{index + 1}</span>
                {t(locale, segment)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label={t(locale, "Safety Thresholds")} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {thresholdItems.map(([label, value]) => (
              <Metric key={label} label={t(locale, label)} value={value} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
