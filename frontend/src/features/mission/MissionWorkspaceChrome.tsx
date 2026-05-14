import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  GitBranch,
  Route,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { MissionConsoleCopy, Locale } from "./i18n";
import { t } from "./i18n";
import type { MissionCycleState } from "./types";
import { badgeStyles, cn, panelStyles, textStyles } from "./uiTokens";

export type ConsoleViewId = "task" | "plan" | "risk" | "incident" | "review";

export type ConsoleView = {
  id: ConsoleViewId;
  icon: LucideIcon;
};

export const consoleViews: ConsoleView[] = [
  { id: "task", icon: ClipboardCheck },
  { id: "plan", icon: Route },
  { id: "risk", icon: AlertTriangle },
  { id: "incident", icon: GitBranch },
  { id: "review", icon: CheckCircle2 },
];

type WorkspaceCopy = MissionConsoleCopy["workspace"];

function getActiveViewStatus(
  viewId: ConsoleViewId,
  missionCycle: MissionCycleState,
  copy: WorkspaceCopy,
): string {
  if (missionCycle.status === "failed") {
    return copy.viewStatus.manualReview;
  }

  if (missionCycle.status === "loading") {
    return viewId === "task" ? copy.viewStatus.running : copy.viewStatus.waiting;
  }

  return viewId === "task" ? copy.viewStatus.ready : copy.viewStatus.available;
}

function getActiveIncidentLabel(
  missionCycle: MissionCycleState,
  locale: Locale,
  copy: WorkspaceCopy,
): string {
  if (missionCycle.status !== "ready") {
    return copy.pendingIncident;
  }

  return t(locale, missionCycle.incidentEvent.event_type);
}

function getMissionObjectLabel(
  missionCycle: MissionCycleState,
  locale: Locale,
  copy: WorkspaceCopy,
): string {
  if (missionCycle.status !== "ready") {
    return copy.fallbackObject;
  }

  return t(locale, missionCycle.plan.mission_task.operation_object);
}

function getMissionRiskSummary(missionCycle: MissionCycleState, copy: WorkspaceCopy): string {
  if (missionCycle.status !== "ready") {
    return copy.pendingRisk;
  }

  const highPriorityCount = missionCycle.plan.risks.filter(
    (risk) => risk.risk_level === "critical" || risk.risk_level === "high",
  ).length;

  return copy.highPriorityRisks(highPriorityCount);
}

export function MissionFlowSidebar({
  activeView,
  copy,
  locale,
  missionCycle,
  onViewChange,
}: {
  activeView: ConsoleViewId;
  copy: WorkspaceCopy;
  locale: Locale;
  missionCycle: MissionCycleState;
  onViewChange: (viewId: ConsoleViewId) => void;
}) {
  return (
    <aside className={cn(panelStyles.base, "lg:sticky lg:top-5 lg:self-start")}>
      <div>
        <p className={textStyles.eyebrow}>{copy.flowTitle}</p>
        <p className="mt-2 text-sm font-semibold text-white">{copy.flowSubtitle}</p>
      </div>

      <nav aria-label={t(locale, "Mission console sections")} className="mt-4 grid gap-2">
        {consoleViews.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.id;
          const viewCopy = copy.views[view.id];

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-full border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300",
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
                  <p className="text-sm font-semibold">{viewCopy.label}</p>
                  <p className={cn(textStyles.muted, "mt-0.5")}>{viewCopy.eyebrow}</p>
                </div>
              </div>
              <p className={cn(textStyles.subtle, "mt-3")}>
                {getActiveViewStatus(view.id, missionCycle, copy)}
              </p>
            </button>
          );
        })}
      </nav>

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <p className={textStyles.strongLabel}>{copy.currentFocus}</p>
        <p className="mt-2 break-words text-sm font-semibold text-white">
          {getMissionObjectLabel(missionCycle, locale, copy)}
        </p>
        <p className={cn(textStyles.subtle, "mt-2")}>
          {getMissionRiskSummary(missionCycle, copy)}
        </p>
      </div>
    </aside>
  );
}

export function ActiveViewHeader({
  activeView,
  copy,
  locale,
  missionCycle,
}: {
  activeView: ConsoleView;
  copy: WorkspaceCopy;
  locale: Locale;
  missionCycle: MissionCycleState;
}) {
  const activeViewCopy = copy.views[activeView.id];

  return (
    <section className={panelStyles.base}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={textStyles.eyebrow}>{activeViewCopy.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{activeViewCopy.title}</h2>
          <p className={cn(textStyles.body, "mt-2 max-w-3xl")}>{activeViewCopy.description}</p>
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
          {t(locale, missionCycle.status)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{copy.missionObject}</p>
          <p className="mt-2 break-words text-sm font-semibold text-white">
            {getMissionObjectLabel(missionCycle, locale, copy)}
          </p>
        </div>
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{copy.activeIncident}</p>
          <p className="mt-2 break-words text-sm font-semibold text-white">
            {getActiveIncidentLabel(missionCycle, locale, copy)}
          </p>
        </div>
        <div className={panelStyles.surfacePadded}>
          <p className={textStyles.strongLabel}>{copy.riskFocus}</p>
          <p className="mt-2 break-words text-sm font-semibold text-white">
            {getMissionRiskSummary(missionCycle, copy)}
          </p>
        </div>
      </div>
    </section>
  );
}
