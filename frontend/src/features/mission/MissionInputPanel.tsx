import { Activity, GitBranch } from "lucide-react";

import type { IncidentEvent } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelTitle } from "./components/PanelTitle";
import { incidentPresets } from "./incidentPresets";
import { buttonStyles, cn, formStyles, panelStyles, textStyles } from "./uiTokens";

type MissionInputPanelProps = {
  taskInput: string;
  selectedIncident: IncidentEvent;
  onIncidentSelect: (incidentEvent: IncidentEvent) => void;
  onRun: () => void;
  onTaskInputChange: (value: string) => void;
};

export function MissionInputPanel({
  taskInput,
  selectedIncident,
  onIncidentSelect,
  onRun,
  onTaskInputChange,
}: MissionInputPanelProps) {
  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={Activity} title="Mission Intake" meta="Natural language" />

      <textarea
        className={formStyles.textarea}
        value={taskInput}
        onChange={(event) => onTaskInputChange(event.target.value)}
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
            >
              <Icon aria-hidden="true" size={16} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      <button
        className={cn(buttonStyles.base, buttonStyles.primary, "mt-4 w-full")}
        onClick={onRun}
        type="button"
      >
        <GitBranch aria-hidden="true" size={17} />
        Run Mission Loop
      </button>

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
