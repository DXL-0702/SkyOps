import { Activity, AlertTriangle, CheckCircle2, GitBranch, Radar, Route } from "lucide-react";
import { useEffect, useState } from "react";

import { type BackendHealth, fetchBackendHealth } from "./api/health";
import {
  DEFAULT_INCIDENT_EVENT,
  DEFAULT_SCENARIO_ID,
  DEFAULT_TASK_INPUT,
  type MissionPlanResponse,
  type MissionReplanResponse,
  type MissionReviewResponse,
  createMissionPlan,
  createMissionReview,
  createReplanDecision,
} from "./api/mission";

type HealthState =
  | { status: "loading" }
  | { status: "online"; data: BackendHealth }
  | { status: "offline"; message: string };

type MissionContractState =
  | { status: "loading" }
  | {
      status: "ready";
      plan: MissionPlanResponse;
      replan: MissionReplanResponse;
      review: MissionReviewResponse;
    }
  | { status: "failed"; message: string };

const capabilityCards = [
  {
    title: "Mission Intake",
    description: "Natural-language task input and constraint extraction scaffold.",
    icon: Activity,
  },
  {
    title: "Risk Simulation",
    description: "What-if risk tree and safety threshold visualization area.",
    icon: Radar,
  },
  {
    title: "Route Strategy",
    description: "Launch point, route split, abort condition, and backup plan workspace.",
    icon: Route,
  },
  {
    title: "Incident Replanning",
    description: "Wind, GPS, data link, battery, airspace, and crowd event controls.",
    icon: GitBranch,
  },
];

export function App() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });
  const [missionContract, setMissionContract] = useState<MissionContractState>({
    status: "loading",
  });

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
          setHealth({
            status: "offline",
            message: error instanceof Error ? error.message : "Backend health check failed.",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMissionContracts() {
      const plan = await createMissionPlan({
        raw_user_input: DEFAULT_TASK_INPUT,
        scenario_id: DEFAULT_SCENARIO_ID,
      });
      const replan = await createReplanDecision({
        scenario_id: DEFAULT_SCENARIO_ID,
        incident_event: DEFAULT_INCIDENT_EVENT,
      });
      const review = await createMissionReview({
        scenario_id: DEFAULT_SCENARIO_ID,
        incident_events: [DEFAULT_INCIDENT_EVENT],
      });

      if (isMounted) {
        setMissionContract({ status: "ready", plan, replan, review });
      }
    }

    loadMissionContracts().catch((error: unknown) => {
      if (isMounted) {
        setMissionContract({
          status: "failed",
          message: error instanceof Error ? error.message : "Mission contract check failed.",
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              SkyOps Agent
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-5xl">
              Low-altitude mission autonomy console
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Phase 0 scaffold for task-level risk simulation, incident replanning, and mission
              review workflows. Demo data and operational states must be clearly marked before use.
            </p>
          </div>

          <BackendStatus health={health} />
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilityCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                className="border border-slate-800 bg-slate-900/70 p-5 shadow-sm"
                key={card.title}
              >
                <div className="flex h-10 w-10 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
                  <Icon aria-hidden="true" size={20} />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-white">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
              </article>
            );
          })}
        </section>

        <section className="grid flex-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Mission workspace</h2>
                <p className="mt-2 text-sm text-slate-400">
                  The first functional slice will connect task intake, mock constraints, safety
                  rules, and a deterministic planner.
                </p>
              </div>
              <span className="border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-200">
                Mock first
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                "Natural-language task input",
                "Mock environment and airspace constraints",
                "Safety rule evaluation",
                "Mission plan and incident response output",
              ].map((item) => (
                <div
                  className="flex items-center gap-3 border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                  key={item}
                >
                  <CheckCircle2 aria-hidden="true" className="text-emerald-300" size={18} />
                  {item}
                </div>
              ))}
            </div>

            <MissionContractPreview missionContract={missionContract} />
          </div>

          <aside className="border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle aria-hidden="true" className="text-amber-300" size={22} />
              <h2 className="text-xl font-semibold text-white">Safety boundary</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              SkyOps Agent is a decision-support system. It must never recommend bypassing
              restricted airspace, ignoring approvals, reducing safety margins, or presenting mock
              data as real operational data.
            </p>
          </aside>
        </section>
      </section>
    </main>
  );
}

function MissionContractPreview({
  missionContract,
}: {
  missionContract: MissionContractState;
}) {
  if (missionContract.status === "loading") {
    return (
      <div className="mt-6 border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
        Loading Phase 1 mission contracts...
      </div>
    );
  }

  if (missionContract.status === "failed") {
    return (
      <div className="mt-6 border border-rose-400/40 bg-rose-400/10 p-4 text-sm text-rose-100">
        Mission contract check failed: {missionContract.message}
      </div>
    );
  }

  const { plan, replan, review } = missionContract;

  return (
    <div className="mt-6 grid gap-3 lg:grid-cols-3">
      <ContractMetric
        label="Plan"
        title={plan.mission_plan.recommended_time_window}
        detail={`${plan.risks.length} risks / ${plan.mission_plan.expected_coverage_percent}% coverage`}
      />
      <ContractMetric
        label="Replan"
        title={replan.replan_decision.decision}
        detail={
          replan.replan_decision.human_takeover_required
            ? "Human takeover required"
            : "Autonomous continuation allowed"
        }
      />
      <ContractMetric
        label="Review"
        title={`${review.mission_review.completion_rate}% complete`}
        detail={`${review.mission_review.data_quality_score}% data quality`}
      />
    </div>
  );
}

function ContractMetric({
  label,
  title,
  detail,
}: {
  label: string;
  title: string;
  detail: string;
}) {
  return (
    <article className="border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{label}</p>
      <h3 className="mt-3 text-sm font-semibold leading-5 text-white">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
    </article>
  );
}

function BackendStatus({ health }: { health: HealthState }) {
  if (health.status === "loading") {
    return (
      <div className="border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
        Checking backend...
      </div>
    );
  }

  if (health.status === "offline") {
    return (
      <div className="border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
        Backend offline: {health.message}
      </div>
    );
  }

  return (
    <div className="border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
      Backend online: {health.data.service} / {health.data.mode}
    </div>
  );
}
