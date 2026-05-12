import { Activity, AlertTriangle, CheckCircle2, Clock3, GitBranch, RotateCw } from "lucide-react";

import type { IncidentEvent } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelTitle } from "./components/PanelTitle";
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
  missionCycle: MissionCycleState;
  taskInput: string;
  selectedIncident: IncidentEvent;
  onIncidentSelect: (incidentEvent: IncidentEvent) => void;
  onRun: () => void;
  onTaskInputChange: (value: string) => void;
};

const missionPipeline = [
  "Task parsing",
  "Constraint reasoning",
  "Risk simulation",
  "Replan and review",
];

function MissionCycleStatusCard({
  missionCycle,
  onRun,
}: {
  missionCycle: MissionCycleState;
  onRun: () => void;
}) {
  if (missionCycle.status === "ready") {
    return (
      <div className={cn(stateStyles.readySurface, "mt-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-teal-50">Decision loop ready</p>
          <span className={cn(badgeStyles.base, badgeStyles.success)}>Explainable plan</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-teal-100/80">
          Plan, risk stack, incident response, and review summary are generated from mock mission
          data.
        </p>
      </div>
    );
  }

  if (missionCycle.status === "loading") {
    return (
      <div className={cn(stateStyles.loadingSurface, "mt-4")} aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white">Mission decision loop running</p>
          <span className={cn(badgeStyles.base, badgeStyles.neutral)}>In progress</span>
        </div>
        <p className={cn(textStyles.subtle, "mt-2")}>
          SkyOps is turning the natural-language task into a constrained low-altitude operation
          plan.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {missionPipeline.map((step) => (
            <div className={stateStyles.pipelineItem} key={step}>
              <Clock3 aria-hidden="true" className="shrink-0 text-teal-200" size={14} />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(stateStyles.failedSurface, "mt-4")} aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-red-50">Mission decision loop unavailable</p>
        <span className={cn(badgeStyles.base, badgeStyles.danger)}>Manual review</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-red-50">{missionCycle.message}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <p className={cn(textStyles.strongLabel, "text-red-100/80")}>Possible Causes</p>
          <div className="mt-2 grid gap-2">
            {missionCycle.possibleCauses.map((cause) => (
              <div className={listStyles.item} key={cause}>
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-red-200"
                  size={15}
                />
                <span>{cause}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className={cn(textStyles.strongLabel, "text-red-100/80")}>Suggested Actions</p>
          <div className="mt-2 grid gap-2">
            {missionCycle.suggestedActions.map((action) => (
              <div className={listStyles.item} key={action}>
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-amber-200"
                  size={15}
                />
                <span>{action}</span>
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
        Retry Mission Loop
      </button>
    </div>
  );
}

export function MissionInputPanel({
  missionCycle,
  taskInput,
  selectedIncident,
  onIncidentSelect,
  onRun,
  onTaskInputChange,
}: MissionInputPanelProps) {
  const isRunning = missionCycle.status === "loading";

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={Activity} title="Mission Intake" meta="Natural language" />

      <textarea
        className={formStyles.textarea}
        disabled={isRunning}
        onChange={(event) => onTaskInputChange(event.target.value)}
        value={taskInput}
      />

      <div className="mt-4 grid grid-cols-3 gap-2">
        {incidentPresets.map((preset) => {
          const Icon = preset.icon;
          const isActive = selectedIncident.event_type === preset.event.event_type;
          return (
            <button
              className={cn(
                buttonStyles.base,
                buttonStyles.incident,
                isActive ? buttonStyles.incidentActive : buttonStyles.incidentIdle,
              )}
              disabled={isRunning}
              key={preset.event.event_type}
              onClick={() => onIncidentSelect(preset.event)}
              type="button"
            >
              <Icon aria-hidden="true" size={16} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      <button
        className={cn(buttonStyles.base, buttonStyles.primary, "mt-4 w-full")}
        disabled={isRunning}
        onClick={onRun}
        type="button"
      >
        <GitBranch aria-hidden="true" size={17} />
        {isRunning ? "Mission Loop Running" : "Run Mission Loop"}
      </button>

      <MissionCycleStatusCard missionCycle={missionCycle} onRun={onRun} />

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={textStyles.strongLabel}>Active Incident</p>
          <DataSourceBadge sourceType={selectedIncident.source_type} label="Incident" />
        </div>
        <p className="mt-2 text-sm font-semibold text-white">{selectedIncident.event_type}</p>
        <p className={cn(textStyles.subtle, "mt-1")}>
          {selectedIncident.observed_value} / {selectedIncident.threshold}
        </p>
      </div>
    </section>
  );
}
