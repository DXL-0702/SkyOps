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
import { IncidentReplanPanel } from "./IncidentReplanPanel";
import { MissionInputPanel } from "./MissionInputPanel";
import { MissionPlanPanel } from "./MissionPlanPanel";
import { MissionReviewPanel } from "./MissionReviewPanel";
import { RiskPanel } from "./RiskPanel";
import { StatusStrip } from "./StatusStrip";
import { incidentPresets } from "./incidentPresets";
import type { HealthState, MissionCycleState } from "./types";

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
          setHealth({ status: "offline" });
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
    } catch {
      setMissionCycle({ status: "failed" });
    }
  }

  useEffect(() => {
    void runMissionCycle(incidentPresets[0].event);
    // Initial mock mission cycle only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleIncidentSelect(incidentEvent: IncidentEvent) {
    if (missionCycle.status === "loading") {
      return;
    }

    setSelectedIncident(incidentEvent);
    void runMissionCycle(incidentEvent);
  }

  const isMissionRunning = missionCycle.status === "loading";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-teal-400/40 bg-teal-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
                SkyOps Agent
              </span>
              <span className="border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                Mock Data
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-4xl">
              Low-Altitude Operations Console
            </h1>
          </div>

          <BackendStatus health={health} />
        </header>

        <StatusStrip health={health} missionCycle={missionCycle} />

        <section className="grid gap-5 xl:grid-cols-[1.05fr_1.55fr_0.9fr]">
          <MissionInputPanel
            taskInput={taskInput}
            selectedIncident={selectedIncident}
            isRunning={isMissionRunning}
            onIncidentSelect={handleIncidentSelect}
            onRun={() => void runMissionCycle()}
            onTaskInputChange={setTaskInput}
          />

          <MissionPlanPanel missionCycle={missionCycle} />

          <RiskPanel missionCycle={missionCycle} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <IncidentReplanPanel missionCycle={missionCycle} />
          <MissionReviewPanel missionCycle={missionCycle} />
        </section>
      </section>
    </main>
  );
}
