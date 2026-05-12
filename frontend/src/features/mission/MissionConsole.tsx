import { useEffect, useState } from "react";

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

export function MissionConsole() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [taskInput, setTaskInput] = useState(DEFAULT_TASK_INPUT);
  const [selectedIncident, setSelectedIncident] = useState(incidentPresets[0].event);
  const [missionCycle, setMissionCycle] = useState<MissionCycleState>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    fetchBackendHealth()
      .then((data) => {
        if (isMounted) {
          setHealth({ status: "online", data });
        }
      })
      .catch(() => {
        if (isMounted) {
          setHealth({
            status: "offline",
            message: "Unable to reach backend. Confirm 127.0.0.1:8000 is running.",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function refreshBackendHealth() {
    fetchBackendHealth()
      .then((data) => setHealth({ status: "online", data }))
      .catch(() => setHealth({
        status: "offline",
        message: "Unable to reach backend. Confirm 127.0.0.1:8000 is running.",
      }));
  }

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
      setMissionCycle({
        status: "failed",
        message: error instanceof Error ? error.message : "Mission cycle failed.",
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
            taskInput={taskInput}
            selectedIncident={selectedIncident}
            missionStatus={missionCycle.status}
            failureMessage={missionCycle.status === "failed" ? missionCycle.message : undefined}
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
        </section>
      </section>
    </main>
  );
}
