import { Activity, AlertTriangle, CheckCircle2, Clock3, GitBranch, RotateCw } from "lucide-react";

import type { IncidentEvent } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelTitle } from "./components/PanelTitle";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import { incidentPresets } from "./incidentPresets";
import type { MissionCycleState } from "./types";
import {
  badgeStyles,
  buttonStyles,
  cn,
  formStyles,
  listStyles,
  panelStyles,
  stateStyles,
  textStyles,
} from "./uiTokens";

type MissionInputPanelProps = {
  locale: Locale;
  missionCycle: MissionCycleState;
  taskInput: string;
  isIncidentUpdating: boolean;
  onRun: () => void;
  onTaskInputChange: (value: string) => void;
};

type IncidentControlPanelProps = {
  locale: Locale;
  missionCycle: MissionCycleState;
  selectedIncident: IncidentEvent;
  isIncidentUpdating: boolean;
  incidentUpdateError: string | null;
  onIncidentSelect: (incidentEvent: IncidentEvent) => void;
};

const missionPipeline = [
  "Task parsing",
  "Constraint reasoning",
  "Risk simulation",
  "Replan and review",
];

function MissionCycleStatusCard({
  locale,
  missionCycle,
  onRun,
}: {
  locale: Locale;
  missionCycle: MissionCycleState;
  onRun: () => void;
}) {
  if (missionCycle.status === "ready") {
    return (
      <div className={cn(stateStyles.readySurface, "mt-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-teal-50">
            {t(locale, "Plan ready")}
          </p>
          <span className={cn(badgeStyles.base, badgeStyles.success)}>
            {t(locale, "Explainable plan")}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-teal-100/80">
          {t(
            locale,
            "Plan, risk explanation, incident response, and review report are generated from mock mission data.",
          )}
        </p>
      </div>
    );
  }

  if (missionCycle.status === "loading") {
    return (
      <div className={cn(stateStyles.loadingSurface, "mt-4")} aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white">
            {t(locale, "Generating plan...")}
          </p>
          <span className={cn(badgeStyles.base, badgeStyles.neutral)}>
            {t(locale, "In progress")}
          </span>
        </div>
        <p className={cn(textStyles.subtle, "mt-2")}>
          {t(
            locale,
            "Checking task, constraints, and risks.",
          )}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {missionPipeline.map((step) => (
            <div className={stateStyles.pipelineItem} key={step}>
              <Clock3 aria-hidden="true" className="shrink-0 text-teal-200" size={14} />
              <span>{t(locale, step)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(stateStyles.failedSurface, "mt-4")} aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-red-50">
          {t(locale, "Unable to generate plan.")}
        </p>
        <span className={cn(badgeStyles.base, badgeStyles.danger)}>
          {t(locale, "Manual review")}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-red-50">{t(locale, missionCycle.message)}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <p className={cn(textStyles.strongLabel, "text-red-100/80")}>
            {t(locale, "Possible Causes")}
          </p>
          <div className="mt-2 grid gap-2">
            {missionCycle.possibleCauses.map((cause) => (
              <div className={listStyles.item} key={cause}>
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-red-200"
                  size={15}
                />
                <span>{t(locale, cause)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className={cn(textStyles.strongLabel, "text-red-100/80")}>
            {t(locale, "Suggested Actions")}
          </p>
          <div className="mt-2 grid gap-2">
            {missionCycle.suggestedActions.map((action) => (
              <div className={listStyles.item} key={action}>
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-amber-200"
                  size={15}
                />
                <span>{t(locale, action)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className={cn(buttonStyles.base, buttonStyles.compact, "mt-4")}
        onClick={onRun}
        type="button"
      >
        <RotateCw aria-hidden="true" size={15} />
        {t(locale, "Retry")}
      </button>
    </div>
  );
}

export function MissionInputPanel({
  locale,
  missionCycle,
  taskInput,
  isIncidentUpdating,
  onRun,
  onTaskInputChange,
}: MissionInputPanelProps) {
  const isRunning = missionCycle.status === "loading";
  const controlsDisabled = isRunning || isIncidentUpdating;

  return (
    <section className={panelStyles.base}>
      <PanelTitle
        icon={Activity}
        title={t(locale, "Mission Task")}
        meta={t(locale, "Natural language")}
      />

      <label className={cn(textStyles.strongLabel, "mt-4 block")} htmlFor="mission-task-input">
        {t(locale, "Mission Task Input")}
      </label>
      <textarea
        className={formStyles.textarea}
        disabled={controlsDisabled}
        id="mission-task-input"
        onChange={(event) => onTaskInputChange(event.target.value)}
        value={taskInput}
      />

      <button
        className={cn(buttonStyles.base, buttonStyles.primary, "mt-4 w-full")}
        disabled={controlsDisabled}
        onClick={onRun}
        type="button"
      >
        <GitBranch aria-hidden="true" size={17} />
        {t(locale, isRunning ? "Generating plan..." : "Generate Mission Plan")}
      </button>

      <MissionCycleStatusCard locale={locale} missionCycle={missionCycle} onRun={onRun} />
    </section>
  );
}

export function IncidentControlPanel({
  locale,
  missionCycle,
  selectedIncident,
  isIncidentUpdating,
  incidentUpdateError,
  onIncidentSelect,
}: IncidentControlPanelProps) {
  const isRunning = missionCycle.status === "loading";
  const controlsDisabled = isRunning || isIncidentUpdating;

  return (
    <section className={panelStyles.base}>
      <PanelTitle
        icon={GitBranch}
        title={t(locale, "Incident Injection")}
        meta={t(locale, "Replan trigger")}
      />

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={textStyles.strongLabel}>{t(locale, "Event Control Panel")}</p>
            <p className={cn(textStyles.subtle, "mt-1")}>
              {t(locale, "Select one incident to inject, then synchronize replanning and review.")}
            </p>
          </div>
          {isIncidentUpdating ? (
            <span className={cn(badgeStyles.base, badgeStyles.warning)}>
              {t(locale, "Updating")}
            </span>
          ) : (
            <DataSourceBadge
              locale={locale}
              sourceType={selectedIncident.source_type}
              label="Incident"
            />
          )}
        </div>

        <div className="mt-4 grid gap-3">
          {incidentPresets.map((preset) => {
            const Icon = preset.icon;
            const incident = preset.event;
            const isActive = selectedIncident.id === incident.id;
            const isPending = isIncidentUpdating && isActive;

            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  "w-full border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 disabled:cursor-not-allowed disabled:opacity-60",
                  isActive
                    ? "border-teal-300 bg-teal-300/10 shadow-[inset_3px_0_0_rgba(94,234,212,0.85)]"
                    : "border-zinc-800 bg-zinc-950/80 hover:border-zinc-600",
                )}
                disabled={controlsDisabled}
                key={incident.id}
                onClick={() => onIncidentSelect(incident)}
                type="button"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border",
                        isActive
                          ? "border-teal-300/50 bg-teal-300/15 text-teal-100"
                          : "border-zinc-700 bg-zinc-900 text-zinc-300",
                      )}
                    >
                      <Icon aria-hidden="true" size={17} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words text-sm font-semibold text-white">
                          {t(locale, incident.event_type)}
                        </p>
                        {isPending ? (
                          <span className={cn(badgeStyles.base, badgeStyles.warning)}>
                            {t(locale, "Updating")}
                          </span>
                        ) : null}
                      </div>
                      <p className={cn(textStyles.muted, "mt-1")}>
                        {t(locale, preset.label)} {t(locale, "Incident")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      badgeStyles.base,
                      incident.severity === "critical" || incident.severity === "high"
                        ? badgeStyles.danger
                        : incident.severity === "medium"
                          ? badgeStyles.warning
                          : badgeStyles.success,
                    )}
                  >
                    {t(locale, incident.severity)}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <p className={textStyles.label}>{t(locale, "Observed Value")}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-zinc-100">
                      {t(locale, incident.observed_value)}
                    </p>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <p className={textStyles.label}>{t(locale, "Threshold")}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-zinc-100">
                      {t(locale, incident.threshold)}
                    </p>
                  </div>
                </div>

                <p className={cn(textStyles.body, "mt-3")}>{t(locale, incident.description)}</p>
              </button>
            );
          })}
        </div>

        {incidentUpdateError ? (
          <div className={cn(stateStyles.failedSurface, "mt-4")} role="alert">
            <p className="text-sm font-semibold text-red-50">
              {t(locale, "Unable to replan.")}
            </p>
            <p className="mt-2 text-xs leading-5 text-red-50">{t(locale, incidentUpdateError)}</p>
          </div>
        ) : null}
      </div>

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={textStyles.strongLabel}>{t(locale, "Active Incident")}</p>
          <DataSourceBadge
            locale={locale}
            sourceType={selectedIncident.source_type}
            label="Incident"
          />
        </div>
        <p className="mt-2 text-sm font-semibold text-white">
          {t(locale, selectedIncident.event_type)}
        </p>
        <p className={cn(textStyles.subtle, "mt-1")}>
          {t(locale, selectedIncident.observed_value)} / {t(locale, selectedIncident.threshold)}
        </p>
        <p className={cn(textStyles.subtle, "mt-2")}>
          {t(locale, selectedIncident.description)}
        </p>
      </div>
    </section>
  );
}
