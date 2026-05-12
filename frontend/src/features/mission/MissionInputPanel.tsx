import { Activity, GitBranch } from "lucide-react";

import type { IncidentEvent } from "../../api/mission";
import { PanelTitle } from "./components/PanelTitle";
import { incidentPresets } from "./incidentPresets";

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
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={Activity} title="Mission Intake" meta="Natural language" />

      <textarea
        className="mt-4 min-h-36 w-full resize-none border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100 outline-none transition focus:border-teal-400"
        value={taskInput}
        onChange={(event) => onTaskInputChange(event.target.value)}
      />

      <div className="mt-4 grid grid-cols-3 gap-2">
        {incidentPresets.map((preset) => {
          const Icon = preset.icon;
          const isActive = selectedIncident.event_type === preset.event.event_type;
          return (
            <button
              className={`flex h-11 items-center justify-center gap-2 border px-2 text-sm font-medium transition ${
                isActive
                  ? "border-teal-300 bg-teal-300/15 text-teal-100"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600"
              }`}
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
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-teal-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-teal-200"
        onClick={onRun}
        type="button"
      >
        <GitBranch aria-hidden="true" size={17} />
        Run Mission Loop
      </button>

      <div className="mt-4 border border-zinc-800 bg-zinc-950/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Active Incident
        </p>
        <p className="mt-2 text-sm font-semibold text-white">{selectedIncident.event_type}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {selectedIncident.observed_value} / {selectedIncident.threshold}
        </p>
      </div>
    </section>
  );
}
