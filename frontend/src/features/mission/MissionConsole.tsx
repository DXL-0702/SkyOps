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
import { EnvironmentDronePanel } from "./EnvironmentDronePanel";
import { HumanExplanationPanel } from "./HumanExplanationPanel";
import { IncidentReplanPanel } from "./IncidentReplanPanel";
import { MissionInputPanel } from "./MissionInputPanel";
import { MissionPlanPanel } from "./MissionPlanPanel";
import { MissionReviewPanel } from "./MissionReviewPanel";
import { RiskPanel } from "./RiskPanel";
import { SafetyThresholdPanel } from "./SafetyThresholdPanel";
import { StatusStrip } from "./StatusStrip";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { incidentPresets } from "./incidentPresets";
import type { HealthState, MissionCycleState } from "./types";
import { badgeStyles, cn, layoutStyles } from "./uiTokens";

const configuredApiEndpoint = API_BASE_URL === "" ? "Vite proxy -> 127.0.0.1:8000" : API_BASE_URL;

const healthOfflineMessage =
  "Mission autonomy backend is unavailable. Keep the current plan in review mode until the service is reachable.";

const missionFailureMessage =
  "Mission decision loop is temporarily unavailable. No flight recommendation was generated for this request.";

const missionFailurePossibleCauses = [
  "The FastAPI backend is not running or the API endpoint is unreachable.",
  "The mission planning, replanning, or review endpoint returned an invalid response.",
  "The current mock scenario is unavailable or does not match the frontend contract.",
];

const missionFailureSuggestedActions = [
  `Check the configured API endpoint: ${configuredApiEndpoint}.`,
  "Restart the backend service and run the mission loop again.",
  "Pause execution and request manual review before using this task plan.",
];

export function MissionConsole() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [taskInput, setTaskInput] = useState(DEFAULT_TASK_INPUT);
  const [selectedIncident, setSelectedIncident] = useState(incidentPresets[0].event);
  const [missionCycle, setMissionCycle] = useState<MissionCycleState>({ status: "loading" });

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

  async function runMissionCycle(incidentEvent: IncidentEvent = selectedIncident) {
    setMissionCycle({ status: "loading" });

    try {
      const plan = await createMissionPlan({
        raw_user_input: taskInput,
        scenario_id: DEFAULT_SCENARIO_ID,
      });
      const replan = await createReplanDecision({
        scenario_id: DEFAULT_SCENARIO_ID,
        incident_event: incidentEvent,
      });
      const review = await createMissionReview({
        scenario_id: DEFAULT_SCENARIO_ID,
        incident_events: [incidentEvent],
      });

      setMissionCycle({ status: "ready", plan, replan, review, incidentEvent });
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
    void runMissionCycle(incidentPresets[0].event);
    // Initial mock mission cycle only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleIncidentSelect(incidentEvent: IncidentEvent) {
    setSelectedIncident(incidentEvent);
    void runMissionCycle(incidentEvent);
  }

  return (
    <main className={layoutStyles.page}>
      <section className={layoutStyles.shell}>
        <header className={layoutStyles.header}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(badgeStyles.base, badgeStyles.brand, "tracking-[0.18em]")}>
                SkyOps Agent
              </span>
              <DataSourceBadge sourceType="mock" label="Demo Data" />
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-4xl">
              Low-Altitude Operations Console
            </h1>
          </div>

          <BackendStatus health={health} onRetry={refreshBackendHealth} />
        </header>

        <StatusStrip health={health} missionCycle={missionCycle} />

        <section className={layoutStyles.primaryGrid}>
          <MissionInputPanel
            missionCycle={missionCycle}
            taskInput={taskInput}
            selectedIncident={selectedIncident}
            onIncidentSelect={handleIncidentSelect}
            onRun={() => void runMissionCycle()}
            onTaskInputChange={setTaskInput}
          />

          <MissionPlanPanel missionCycle={missionCycle} />

          <RiskPanel missionCycle={missionCycle} />
        </section>

        <section className={layoutStyles.evidenceGrid}>
          <EnvironmentDronePanel missionCycle={missionCycle} />
          <IncidentReplanPanel missionCycle={missionCycle} />
          <MissionReviewPanel missionCycle={missionCycle} />
        </section>

        <section className={layoutStyles.fullWidthGrid}>
          <SafetyThresholdPanel missionCycle={missionCycle} />
          <HumanExplanationPanel missionCycle={missionCycle} />
        </section>
      </section>
    </main>
  );
}
