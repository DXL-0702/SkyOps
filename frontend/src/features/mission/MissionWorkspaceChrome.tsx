import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  GitBranch,
  Route,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { MissionCycleState } from "./types";
import { badgeStyles, cn, panelStyles, textStyles } from "./uiTokens";

export type ConsoleViewId = "task" | "plan" | "risk" | "incident" | "review";

export type ConsoleView = {
  id: ConsoleViewId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const consoleViews: ConsoleView[] = [
  {
    id: "task",
    label: "Task",
    eyebrow: "Step 01",
    title: "Task Intake",
    description: "Start from natural-language task input and run the demo decision loop.",
    icon: ClipboardCheck,
  },
  {
    id: "plan",
    label: "Plan",
    eyebrow: "Step 02",
    title: "Mission Plan",
    description:
      "Review recommended time window, route strategy, environment, drone state, and abort thresholds.",
    icon: Route,
  },
  {
    id: "risk",
    label: "Risk",
    eyebrow: "Step 03",
    title: "Risk Reasoning",
    description:
      "Inspect sorted risks, decision impacts, evidence, and explainable human-facing rationale.",
    icon: AlertTriangle,
  },
  {
    id: "incident",
    label: "Incident",
    eyebrow: "Step 04",
    title: "Incident Replanning",
    description:
      "Inject a simulated incident and inspect the resulting pause, return, reroute, or review decision.",
    icon: GitBranch,
  },
  {
    id: "review",
    label: "Review",
    eyebrow: "Step 05",
    title: "Mission Review",
    description:
      "Close the loop with completion, data quality, risk logs, makeup flight advice, and review actions.",
    icon: CheckCircle2,
  },
];

function getActiveViewStatus(viewId: ConsoleViewId, missionCycle: MissionCycleState): string {
  if (missionCycle.status === "failed") {
    return "Manual Review";
  }

  if (missionCycle.status === "loading") {
    return viewId === "task" ? "Running" : "Waiting";
  }

  return viewId === "task" ? "Ready" : "Available";
}

function getActiveIncidentLabel(missionCycle: MissionCycleState): string {
  if (missionCycle.status !== "ready") {
    return "Pending decision loop";
  }

  return missionCycle.incidentEvent.event_type;
}

function getMissionObjectLabel(missionCycle: MissionCycleState): string {
  if (missionCycle.status !== "ready") {
    return "Shenzhen high-rise demo";
  }

  return missionCycle.plan.mission_task.operation_object;
}

function getMissionRiskSummary(missionCycle: MissionCycleState): string {
  if (missionCycle.status !== "ready") {
    return "Risk stack pending";
  }

  const highPriorityCount = missionCycle.plan.risks.filter(
    (risk) => risk.risk_level === "critical" || risk.risk_level === "high",
  ).length;

  return `${highPriorityCount} high-priority risks`;
}

export function MissionFlowSidebar({
  activeView,
  missionCycle,
  onViewChange,
}: {
  activeView: ConsoleViewId;
  missionCycle: MissionCycleState;
  onViewChange: (viewId: ConsoleViewId) => void;
}) {
  return (
    <aside className={cn(panelStyles.base, "lg:sticky lg:top-5 lg:self-start")}>
      <div>
        <p className={textStyles.eyebrow}>Mission Flow</p>
        <p className="mt-2 text-sm font-semibold text-white">Task-level autonomy workspace</p>
      </div>

      <nav aria-label="Mission console sections" className="mt-4 grid gap-2">
        {consoleViews.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.id;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-full border p-3 text-left transition",
                isActive
                  ? "border-teal-300 bg-teal-300/10 text-teal-50 shadow-[inset_3px_0_0_rgba(94,234,212,0.85)]"
                  : "border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100",
              )}
              key={view.id}
              onClick={() => onViewChange(view.id)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center border",
                    isActive
                      ? "border-teal-300/50 bg-teal-300/15 text-teal-100"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400",
                  )}
                >
                  <Icon aria-hidden="true" size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{view.label}</p>
                  <p className={cn(textStyles.muted, "mt-0.5")}>{view.eyebrow}</p>
                </div>
              </div>
              <p className={cn(textStyles.subtle, "mt-3")}>
                {getActiveViewStatus(view.id, missionCycle)}
              </p>
            </button>
          );
        })}
      </nav>

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <p className={textStyles.strongLabel}>Current Focus</p>
        <p className="mt-2 break-words text-sm font-semibold text-white">
          {getMissionObjectLabel(missionCycle)}
        </p>
        <p className={cn(textStyles.subtle, "mt-2")}>{getMissionRiskSummary(missionCycle)}</p>
      </div>
    </aside>
  );
}

export function ActiveViewHeader({
  activeView,
  missionCycle,
}: {
  activeView: ConsoleView;
  missionCycle: MissionCycleState;
}) {
  return (
    <section className={panelStyles.base}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={textStyles.eyebrow}>{activeView.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{activeView.title}</h2>
          <p className={cn(textStyles.body, "mt-2 max-w-3xl")}>{activeView.description}</p>
        </div>
        <span
          className={cn(
            badgeStyles.base,
            missionCycle.status === "failed"
              ? badgeStyles.danger
              : missionCycle.status === "loading"
                ? badgeStyles.warning
                : badgeStyles.success,
          )}
        >
          {missionCycle.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>Mission Object</p>
          <p className="mt-2 break-words text-sm font-semibold text-white">
            {getMissionObjectLabel(missionCycle)}
          </p>
        </div>
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>Active Incident</p>
          <p className="mt-2 break-words text-sm font-semibold text-white">
            {getActiveIncidentLabel(missionCycle)}
          </p>
        </div>
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>Risk Focus</p>
          <p className="mt-2 break-words text-sm font-semibold text-white">
            {getMissionRiskSummary(missionCycle)}
          </p>
        </div>
      </div>
    </section>
  );
}
