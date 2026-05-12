import { Activity, GitBranch } from "lucide-react";

import type { IncidentEvent } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelTitle } from "./components/PanelTitle";
import { incidentPresets } from "./incidentPresets";
import { buttonStyles, cn, formStyles, panelStyles, textStyles } from "./uiTokens";

type MissionInputPanelProps = {
  taskInput: string;
  selectedIncident: IncidentEvent;
  missionStatus: "loading" | "ready" | "failed";
  failureMessage?: string;
  onIncidentSelect: (incidentEvent: IncidentEvent) => void;
  onRun: () => void;
  onTaskInputChange: (value: string) => void;
};

export function MissionInputPanel({
  taskInput,
  selectedIncident,
  missionStatus,
  failureMessage,
  onIncidentSelect,
  onRun,
  onTaskInputChange,
}: MissionInputPanelProps) {
  const isRunning = missionStatus === "loading";

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={Activity} title="Mission Intake" meta="Natural language" />

      <textarea
        className={formStyles.textarea}
        value={taskInput}
        onChange={(event) => onTaskInputChange(event.target.value)}
        disabled={isRunning}
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
              key={preset.event.event_type}
              onClick={() => onIncidentSelect(preset.event)}
              type="button"
              disabled={isRunning}
            >
              <Icon aria-hidden="true" size={16} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      <button
        className={cn(
          buttonStyles.base,
          buttonStyles.primary,
          "mt-4 w-full",
          isRunning && "cursor-not-allowed opacity-60",
        )}
        onClick={onRun}
        type="button"
        disabled={isRunning}
      >
        <GitBranch aria-hidden="true" size={17} />
        {isRunning ? "Mission Loop Running…" : "Run Mission Loop"}
      </button>

      {missionStatus === "failed" ? (
        <div className={cn(panelStyles.surfacePadded, "mt-4 border-red-500/20 bg-red-500/10")}> 
          <p className="text-sm font-semibold text-red-100">Mission loop failed.</p>
          <p className={cn(textStyles.muted, "mt-2")}>{failureMessage ?? "Please retry the mission loop."}</p>
          <button
            className={cn(buttonStyles.base, buttonStyles.primary, "mt-4 w-full")}
            onClick={onRun}
            type="button"
          >
            Retry Mission Loop
          </button>
        </div>
      ) : missionStatus === "loading" ? (
        <div className={cn(panelStyles.surfacePadded, "mt-4")}> 
          <p className="text-sm font-semibold text-teal-100">Mission loop is running.</p>
          <p className={cn(textStyles.muted, "mt-2")}>Please wait while the system updates mission guidance.</p>
        </div>
      ) : null}

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

