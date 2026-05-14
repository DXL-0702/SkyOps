import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { useEffect, useState } from "react";

import { API_BASE_URL } from "../../api/client";
import { fetchBackendHealth } from "../../api/health";
import {
  DEFAULT_SCENARIO_ID,
  DEFAULT_TASK_INPUT,
  type IncidentEvent,
  createMissionPlan,
  createMissionReview,
  createReplanDecision,
} from "../../api/mission";
import { BackendStatus } from "./BackendStatus";
import { HumanExplanationPanel } from "./HumanExplanationPanel";
import { IncidentReplanPanel } from "./IncidentReplanPanel";
import { IncidentControlPanel, MissionInputPanel } from "./MissionInputPanel";
import { MissionPlanPanel } from "./MissionPlanPanel";
import { MissionReviewPanel } from "./MissionReviewPanel";
import { RiskPanel } from "./RiskPanel";
import { StatusStrip } from "./StatusStrip";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { formatCheckEndpoint, missionConsoleCopy, t, type Locale } from "./i18n";
import { incidentPresets } from "./incidentPresets";
import type { HealthState, MissionCycleState } from "./types";
import { badgeStyles, buttonStyles, cn, layoutStyles, panelStyles, textStyles } from "./uiTokens";

type DemoStepId =
  | "task_input"
  | "mission_plan"
  | "risk_explanation"
  | "incident_injection"
  | "replan"
  | "review";

const demoSteps: Array<{
  id: DemoStepId;
  label: string;
  description: string;
}> = [
  {
    id: "task_input",
    label: "Task Input",
    description: "Enter the mission request.",
  },
  {
    id: "mission_plan",
    label: "Mission Plan",
    description: "Generate an executable plan.",
  },
  {
    id: "risk_explanation",
    label: "Risk Explanation",
    description: "Review constraints and risk evidence.",
  },
  {
    id: "incident_injection",
    label: "Incident Injection",
    description: "Trigger a simulated exception.",
  },
  {
    id: "replan",
    label: "Replan",
    description: "Inspect the response sequence.",
  },
  {
    id: "review",
    label: "Review & Makeup Flight",
    description: "Close the loop with review output.",
  },
];

function getDemoStepIndex(stepId: DemoStepId): number {
  return demoSteps.findIndex((step) => step.id === stepId);
}

function DemoStepIndicator({
  activeStep,
  locale,
  missionCycle,
}: {
  activeStep: DemoStepId;
  locale: Locale;
  missionCycle: MissionCycleState;
}) {
  const activeStepIndex = getDemoStepIndex(activeStep);
  const allStepsComplete = missionCycle.status === "ready" && activeStep === "review";

  return (
    <section className={panelStyles.base} aria-label="Current demo flow step">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={textStyles.eyebrow}>{t(locale, "1-2 Minute Demo Flow")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {t(locale, "Task-level autonomy sequence")}
          </h2>
        </div>
        <span className={cn(badgeStyles.base, badgeStyles.neutral)}>
          {t(locale, "Planning, risk, review")}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {demoSteps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = allStepsComplete || index < activeStepIndex;
          const StepIcon = isComplete ? CheckCircle2 : isActive ? CircleDot : Circle;

          return (
            <article
              className={cn(
                "min-w-0 border p-3",
                isActive
                  ? "border-teal-300 bg-teal-300/10 shadow-[inset_3px_0_0_rgba(94,234,212,0.85)]"
                  : isComplete
                    ? "border-teal-400/30 bg-teal-400/5"
                    : "border-zinc-800 bg-zinc-950/70",
              )}
              key={step.id}
            >
              <div className="flex items-start gap-2">
                <StepIcon
                  aria-hidden="true"
                  className={isActive || isComplete ? "shrink-0 text-teal-200" : "shrink-0 text-zinc-500"}
                  size={16}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {t(locale, "Step")} {index + 1}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-white">
                    {t(locale, step.label)}
                  </p>
                </div>
              </div>
              <p className={cn(textStyles.subtle, "mt-2")}>{t(locale, step.description)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DemoPositioningPanel({ locale }: { locale: Locale }) {
  return (
    <section className={panelStyles.base}>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className={textStyles.eyebrow}>{t(locale, "Competition Demo")}</p>
          <h2 className="mt-2 max-w-4xl text-2xl font-semibold leading-tight text-white md:text-3xl">
            {t(locale, "Task-level autonomy for low-altitude inspection missions")}
          </h2>
          <p className={cn(textStyles.body, "mt-3 max-w-3xl")}>
            {t(
              locale,
              "Plan missions, simulate risks, trigger replanning, and review makeup flight needs.",
            )}
          </p>
        </div>
        <div className="border border-amber-400/40 bg-amber-400/10 p-4">
          <p className="text-sm font-semibold text-amber-100">
            {t(locale, "Positioning note")}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-100/85">
            {t(
              locale,
              "This demo focuses on mission planning and risk response, not image inspection.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function LanguageToggle({
  locale,
  label,
  onLocaleChange,
}: {
  locale: Locale;
  label: string;
  onLocaleChange: (locale: Locale) => void;
}) {
  const languageOptions: Array<{ label: string; value: Locale }> = [
    { label: "中文", value: "zh" },
    { label: "EN", value: "en" },
  ];

  return (
    <div aria-label={label} className="flex items-center gap-2" role="group">
      <span className={cn(textStyles.label, "hidden sm:inline")}>{label}</span>
      <div className="flex border border-zinc-800 bg-zinc-950 p-1">
        {languageOptions.map((option) => {
          const isActive = locale === option.value;

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                buttonStyles.base,
                "h-8 px-3 text-xs font-semibold",
                isActive
                  ? "bg-teal-300 text-zinc-950"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              )}
              key={option.value}
              onClick={() => onLocaleChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const healthOfflineMessage =
  "Mission autonomy backend is unavailable. Keep the current plan in review mode until the service is reachable.";

const missionFailureMessage =
  "Mission decision loop is temporarily unavailable. No flight recommendation was generated for this request.";

const missionFailurePossibleCauses = [
  "The FastAPI backend is not running or the API endpoint is unreachable.",
  "The mission planning, replanning, or review endpoint returned an invalid response.",
  "The current mock scenario is unavailable or does not match the frontend contract.",
];

export function MissionConsole() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [taskInput, setTaskInput] = useState(DEFAULT_TASK_INPUT);
  const [selectedIncident, setSelectedIncident] = useState(incidentPresets[0].event);
  const [missionCycle, setMissionCycle] = useState<MissionCycleState>({ status: "loading" });
  const [activeDemoStep, setActiveDemoStep] = useState<DemoStepId>("task_input");
  const [isIncidentUpdating, setIsIncidentUpdating] = useState(false);
  const [incidentUpdateError, setIncidentUpdateError] = useState<string | null>(null);
  const copy = missionConsoleCopy[locale];
  const configuredApiEndpoint = API_BASE_URL === "" ? copy.backendFallback : API_BASE_URL;
  const missionFailureSuggestedActions = [
    formatCheckEndpoint(locale, configuredApiEndpoint),
    "Restart the backend service and run the mission loop again.",
    "Pause execution and request manual review before using this task plan.",
  ];

  function refreshBackendHealth() {
    setHealth({ status: "loading" });

    fetchBackendHealth()
      .then((data) => setHealth({ status: "online", data }))
      .catch((error: unknown) => {
        console.warn("Backend health check failed.", error);
        setHealth({
          status: "offline",
          message: healthOfflineMessage,
        });
      });
  }

  useEffect(() => {
    let isMounted = true;

    fetchBackendHealth()
      .then((data) => {
        if (isMounted) {
          setHealth({ status: "online", data });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          console.warn("Backend health check failed.", error);
          setHealth({
            status: "offline",
            message: healthOfflineMessage,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function runAllDemoFlow(incidentEvent: IncidentEvent = selectedIncident) {
    setSelectedIncident(incidentEvent);
    setMissionCycle({ status: "loading" });
    setIsIncidentUpdating(false);
    setIncidentUpdateError(null);
    setActiveDemoStep("task_input");

    try {
      const plan = await createMissionPlan({
        raw_user_input: taskInput,
        scenario_id: DEFAULT_SCENARIO_ID,
      });
      setActiveDemoStep("mission_plan");
      setActiveDemoStep("risk_explanation");

      const replan = await createReplanDecision({
        scenario_id: DEFAULT_SCENARIO_ID,
        incident_event: incidentEvent,
      });
      setActiveDemoStep("incident_injection");
      setActiveDemoStep("replan");

      const review = await createMissionReview({
        scenario_id: DEFAULT_SCENARIO_ID,
        incident_events: [incidentEvent],
      });

      setMissionCycle({ status: "ready", plan, replan, review, incidentEvent });
      setActiveDemoStep("review");
    } catch (error: unknown) {
      console.error("Mission decision loop failed.", error);
      setMissionCycle({
        status: "failed",
        message: missionFailureMessage,
        possibleCauses: missionFailurePossibleCauses,
        suggestedActions: missionFailureSuggestedActions,
      });
    }
  }

  useEffect(() => {
    void runAllDemoFlow(incidentPresets[0].event);
    // Initial mock mission cycle only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleIncidentSelect(incidentEvent: IncidentEvent) {
    if (missionCycle.status !== "ready") {
      await runAllDemoFlow(incidentEvent);
      return;
    }

    const previousIncident = selectedIncident;
    setSelectedIncident(incidentEvent);
    setIsIncidentUpdating(true);
    setIncidentUpdateError(null);
    setActiveDemoStep("incident_injection");

    try {
      const [replan, review] = await Promise.all([
        createReplanDecision({
          scenario_id: DEFAULT_SCENARIO_ID,
          incident_event: incidentEvent,
        }),
        createMissionReview({
          scenario_id: DEFAULT_SCENARIO_ID,
          incident_events: [incidentEvent],
        }),
      ]);
      setActiveDemoStep("replan");

      setMissionCycle((currentCycle) => {
        if (currentCycle.status !== "ready") {
          return currentCycle;
        }

        return {
          status: "ready",
          plan: currentCycle.plan,
          replan,
          review,
          incidentEvent,
        };
      });
      setActiveDemoStep("review");
    } catch (error: unknown) {
      console.error("Incident replan or review update failed.", error);
      setSelectedIncident(previousIncident);
      setIncidentUpdateError(
        "Incident update failed. The previous mission plan and active incident are preserved for manual review.",
      );
    } finally {
      setIsIncidentUpdating(false);
    }
  }

  return (
    <main className={layoutStyles.page}>
      <section className={layoutStyles.shell}>
        <header className={layoutStyles.header}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(badgeStyles.base, badgeStyles.brand, "tracking-[0.18em]")}>
                {copy.appBadge}
              </span>
              <DataSourceBadge locale={locale} sourceType="mock" label={copy.dataBadge} />
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-4xl">
              {copy.pageTitle}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LanguageToggle
              label={copy.languageLabel}
              locale={locale}
              onLocaleChange={setLocale}
            />
            <BackendStatus health={health} locale={locale} onRetry={refreshBackendHealth} />
          </div>
        </header>

        <StatusStrip copy={copy.status} health={health} locale={locale} missionCycle={missionCycle} />

        <DemoPositioningPanel locale={locale} />
        <DemoStepIndicator
          activeStep={activeDemoStep}
          locale={locale}
          missionCycle={missionCycle}
        />

        <section className={layoutStyles.fullWidthGrid}>
          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <MissionInputPanel
              locale={locale}
              missionCycle={missionCycle}
              taskInput={taskInput}
              isIncidentUpdating={isIncidentUpdating}
              onRun={() => void runAllDemoFlow()}
              onTaskInputChange={(value) => {
                setTaskInput(value);
                setActiveDemoStep("task_input");
              }}
            />
            <MissionPlanPanel locale={locale} missionCycle={missionCycle} />
          </section>

          <section className={layoutStyles.secondaryGrid}>
            <RiskPanel locale={locale} missionCycle={missionCycle} />
            <HumanExplanationPanel locale={locale} missionCycle={missionCycle} />
          </section>

          <section className={layoutStyles.secondaryGrid}>
            <IncidentControlPanel
              locale={locale}
              missionCycle={missionCycle}
              selectedIncident={selectedIncident}
              isIncidentUpdating={isIncidentUpdating}
              incidentUpdateError={incidentUpdateError}
              onIncidentSelect={handleIncidentSelect}
            />
            <IncidentReplanPanel locale={locale} missionCycle={missionCycle} />
          </section>

          <MissionReviewPanel locale={locale} missionCycle={missionCycle} />
        </section>
      </section>
    </main>
  );
}
