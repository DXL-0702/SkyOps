import { MapPinned } from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { SectionLabel } from "./components/SectionLabel";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { MissionCycleState } from "./types";
import {
  badgeStyles,
  cn,
  commandLayerStyles,
  listStyles,
  panelStyles,
  textStyles,
} from "./uiTokens";

const mapLegend = [
  { label: "Launch Point", className: commandLayerStyles.launchPoint },
  { label: "Route Segments", className: "border-teal-300/50 bg-teal-300/10 text-teal-100" },
  { label: "Restricted Zone", className: commandLayerStyles.restrictedZone },
  { label: "Crowd Zone", className: commandLayerStyles.riskZone },
  { label: "GPS Weak Zone", className: "border-sky-300/40 bg-sky-300/10 text-sky-100" },
];

export function SandboxMapPanel({
  locale,
  missionCycle,
}: {
  locale: Locale;
  missionCycle: MissionCycleState;
}) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback locale={locale} title="Simulated Sandbox" state={missionCycle.status} />;
  }

  const { mission_plan: missionPlan, mission_task: missionTask } = missionCycle.plan;
  const launchPoint = missionPlan.launch_landing_points[0];

  return (
    <section className={panelStyles.base}>
      <PanelTitle
        icon={MapPinned}
        title={t(locale, "Simulated Sandbox")}
        meta={t(locale, "Mock Spatial Layer")}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge locale={locale} sourceType={missionTask.source_type} label="Sandbox" />
        <span className={cn(badgeStyles.base, badgeStyles.neutral)}>
          {t(locale, "Not a real map")}
        </span>
      </div>

      <div
        aria-label={t(locale, "Simulated route and risk sandbox")}
        className={cn(
          commandLayerStyles.mapSurface,
          "relative mt-4 min-h-[25rem] overflow-hidden p-4 sm:min-h-[23rem]",
        )}
        role="img"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(63,63,70,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(63,63,70,0.28)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute inset-x-4 top-4 border-t border-zinc-700/80" />
        <div className="absolute inset-y-4 left-4 border-l border-zinc-700/80" />

        <div className="absolute left-[42%] top-[14%] h-[68%] w-[20%] border border-zinc-600 bg-zinc-900/90 shadow-[0_0_30px_rgba(20,184,166,0.08)]">
          <div className="grid h-full grid-rows-6">
            {Array.from({ length: 6 }, (_, index) => (
              <span className="border-b border-zinc-800 last:border-b-0" key={index} />
            ))}
          </div>
          <span className="absolute inset-x-2 top-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {t(locale, "Building Facade")}
          </span>
        </div>

        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <polyline
            className={commandLayerStyles.routeLine}
            fill="none"
            points="21,78 39,78 39,58 39,38 39,22"
            strokeDasharray="1 2"
            strokeWidth="1.7"
          />
          <polyline
            className={commandLayerStyles.replannedRouteLine}
            fill="none"
            points="39,22 31,30 29,48 31,67 22,78"
            strokeDasharray="4 2"
            strokeWidth="1.4"
          />
        </svg>

        <div className="absolute left-[17%] top-[74%] flex h-9 w-9 items-center justify-center text-xs font-bold shadow-lg shadow-teal-950/40">
          <span
            className={cn("flex h-9 w-9 items-center justify-center", commandLayerStyles.launchPoint)}
          >
            L
          </span>
        </div>

        <div className="absolute left-[27%] top-[18%] h-[22%] w-[20%] overflow-hidden border border-sky-300/40 bg-sky-300/10 p-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-100">
          {t(locale, "GPS Weak Zone")}
        </div>
        <div className="absolute right-[13%] top-[12%] h-[24%] w-[24%] overflow-hidden border border-red-400/40 bg-red-400/10 p-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-100">
          {t(locale, "Restricted Zone")}
        </div>
        <div className="absolute bottom-[12%] right-[16%] h-[20%] w-[26%] overflow-hidden border border-amber-400/40 bg-amber-400/10 p-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-100">
          {t(locale, "Crowd Zone")}
        </div>

        <div className="absolute bottom-4 left-4 right-4 grid max-h-36 gap-2 overflow-y-auto pr-1 sm:max-h-none sm:grid-cols-3 sm:overflow-visible sm:pr-0">
          {missionPlan.flight_segments.map((segment, index) => (
            <div
              className={cn(
                "border px-3 py-2 text-xs leading-5",
                index === 0 ? commandLayerStyles.activeSegment : commandLayerStyles.makeupSegment,
              )}
              key={segment}
            >
              <span className="font-semibold">{t(locale, `Segment ${index + 1}`)}</span>
              <span className="block break-words">{t(locale, segment)}</span>
            </div>
          ))}
          <div
            className={cn(commandLayerStyles.inactiveSegment, "border px-3 py-2 text-xs leading-5")}
          >
            <span className="font-semibold">{t(locale, "Launch")}</span>
            <span className="block break-words">
              {launchPoint ? t(locale, launchPoint.name) : t(locale, "Standby Point")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel label={t(locale, "Sandbox Legend")} />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {mapLegend.map((item) => (
              <div
                className={cn(
                  "flex min-w-0 items-center gap-2 border px-3 py-2 text-xs",
                  item.className,
                )}
                key={item.label}
              >
                <span className="h-2.5 w-2.5 shrink-0 bg-current" />
                <span className="break-words">{t(locale, item.label)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel label={t(locale, "Spatial Notes")} />
          <div className="mt-3 grid gap-2">
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span>{t(locale, "Sandbox is simulated and not suitable for real navigation.")}</span>
            </div>
            <div className={listStyles.item}>
              <span className={listStyles.dot} />
              <span>{t(locale, "Route keeps standoff near GPS weak and crowd-sensitive zones.")}</span>
            </div>
          </div>
        </div>
      </div>
      <p className={cn(textStyles.muted, "mt-4")}>
        {t(locale, "No real coordinates, map tiles, or airspace service are used in this panel.")}
      </p>
    </section>
  );
}
