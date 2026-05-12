import {
  Activity,
  AlertTriangle,
  Battery,
  CheckCircle2,
  CircleDot,
  Clock3,
  CloudSun,
  GitBranch,
  MapPinned,
  RadioTower,
  Route,
  ShieldAlert,
  Signal,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { type BackendHealth, fetchBackendHealth } from "./api/health";
import {
  DEFAULT_MISSION_ID,
  DEFAULT_SCENARIO_ID,
  DEFAULT_TASK_INPUT,
  type IncidentEvent,
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

type MissionCycleState =
  | { status: "loading" }
  | {
      status: "ready";
      plan: MissionPlanResponse;
      replan: MissionReplanResponse;
      review: MissionReviewResponse;
      incidentEvent: IncidentEvent;
    }
  | { status: "failed"; message: string };

type IncidentPreset = {
  label: string;
  event: IncidentEvent;
  icon: typeof AlertTriangle;
};

const incidentPresets: IncidentPreset[] = [
  {
    label: "Wind",
    icon: CloudSun,
    event: {
      id: "incident-wind-001",
      mission_id: DEFAULT_MISSION_ID,
      event_type: "wind_speed_spike",
      observed_value: "9.4 m/s",
      threshold: "8.0 m/s",
      severity: "high",
      source_type: "mock",
      description: "Simulated sudden wind increase near the upper facade.",
    },
  },
  {
    label: "GPS",
    icon: Signal,
    event: {
      id: "incident-gps-001",
      mission_id: DEFAULT_MISSION_ID,
      event_type: "gps_confidence_drop",
      observed_value: "0.41",
      threshold: "0.65",
      severity: "high",
      source_type: "mock",
      description: "Simulated GPS confidence drop near the facade.",
    },
  },
  {
    label: "Video",
    icon: RadioTower,
    event: {
      id: "incident-video-001",
      mission_id: DEFAULT_MISSION_ID,
      event_type: "video_latency_increase",
      observed_value: "900 ms",
      threshold: "500 ms",
      severity: "high",
      source_type: "mock",
      description: "Simulated video transmission latency increase.",
    },
  },
  {
    label: "Battery",
    icon: Battery,
    event: {
      id: "incident-battery-001",
      mission_id: DEFAULT_MISSION_ID,
      event_type: "battery_low",
      observed_value: "34%",
      threshold: "35%",
      severity: "critical",
      source_type: "mock",
      description: "Simulated battery level crossing the safe return margin.",
    },
  },
  {
    label: "Crowd",
    icon: Users,
    event: {
      id: "incident-crowd-001",
      mission_id: DEFAULT_MISSION_ID,
      event_type: "crowd_gathering",
      observed_value: "high",
      threshold: "medium",
      severity: "critical",
      source_type: "mock",
      description: "Simulated pedestrian gathering near the launch area.",
    },
  },
  {
    label: "Airspace",
    icon: ShieldAlert,
    event: {
      id: "incident-airspace-001",
      mission_id: DEFAULT_MISSION_ID,
      event_type: "temporary_airspace_restriction",
      observed_value: "temporary restriction active",
      threshold: "no active restriction",
      severity: "critical",
      source_type: "mock",
      description: "Simulated temporary airspace restriction update.",
    },
  },
];

export function App() {
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
          <MissionInput
            taskInput={taskInput}
            selectedIncident={selectedIncident}
            onIncidentSelect={handleIncidentSelect}
            onRun={() => void runMissionCycle()}
            onTaskInputChange={setTaskInput}
          />

          <MissionPlanPanel missionCycle={missionCycle} />

          <RiskPanel missionCycle={missionCycle} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <ReplanPanel missionCycle={missionCycle} />
          <ReviewPanel missionCycle={missionCycle} />
        </section>
      </section>
    </main>
  );
}

function StatusStrip({
  health,
  missionCycle,
}: {
  health: HealthState;
  missionCycle: MissionCycleState;
}) {
  const missionStatus =
    missionCycle.status === "ready"
      ? "Decision loop ready"
      : missionCycle.status === "failed"
        ? "Decision loop failed"
        : "Decision loop running";

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <StatusTile label="Backend" value={health.status} icon={Activity} />
      <StatusTile label="Scenario" value="Shenzhen high-rise" icon={MapPinned} />
      <StatusTile label="Data Mode" value="Mock / simulated" icon={CircleDot} />
      <StatusTile label="Loop" value={missionStatus} icon={GitBranch} />
    </section>
  );
}

function MissionInput({
  taskInput,
  selectedIncident,
  onIncidentSelect,
  onRun,
  onTaskInputChange,
}: {
  taskInput: string;
  selectedIncident: IncidentEvent;
  onIncidentSelect: (incidentEvent: IncidentEvent) => void;
  onRun: () => void;
  onTaskInputChange: (value: string) => void;
}) {
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

function MissionPlanPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Mission Plan" state={missionCycle.status} />;
  }

  const { plan } = missionCycle;
  const thresholds = plan.mission_plan.safety_thresholds;
  const thresholdItems = [
    ["Wind", `${thresholds.max_wind_speed_mps} m/s`],
    ["Battery", `${thresholds.min_battery_percent}%`],
    ["GPS", thresholds.min_gps_confidence.toFixed(2)],
    ["Video", `${thresholds.max_video_latency_ms} ms`],
  ];

  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={Route} title="Mission Plan" meta={plan.mission_task.source_type} />

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label="Coverage" value={`${plan.mission_plan.expected_coverage_percent}%`} />
        <Metric label="Duration" value={`${plan.mission_plan.estimated_duration_minutes} min`} />
        <Metric label="Wind" value={`${plan.environment_state.wind_speed_mps} m/s`} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Time Window
          </p>
          <p className="mt-2 text-sm font-semibold leading-5 text-white">
            {plan.mission_plan.recommended_time_window}
          </p>
          <p className="mt-3 text-xs leading-5 text-zinc-400">
            {plan.mission_task.operation_object}
          </p>
        </div>

        <div className="border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Route Strategy
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-200">
            {plan.mission_plan.route_strategy}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionLabel label="Flight Segments" />
          <div className="mt-3 grid gap-2">
            {plan.mission_plan.flight_segments.map((segment, index) => (
              <div
                className="flex items-center gap-3 border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300"
                key={segment}
              >
                <span className="flex h-6 w-6 items-center justify-center bg-teal-300/15 text-xs font-semibold text-teal-200">
                  {index + 1}
                </span>
                {segment}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel label="Safety Thresholds" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {thresholdItems.map(([label, value]) => (
              <Metric key={label} label={label} value={value} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Risk Stack" state={missionCycle.status} />;
  }

  return (
    <aside className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={AlertTriangle} title="Risk Stack" meta="Explainable" />

      <div className="mt-4 grid gap-3">
        {missionCycle.plan.risks.map((risk) => (
          <article className="border border-zinc-800 bg-zinc-950/70 p-4" key={risk.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{risk.category}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {risk.trigger_condition}
                </p>
              </div>
              <RiskBadge level={risk.risk_level} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{risk.description}</p>
            <p className="mt-3 text-xs leading-5 text-zinc-500">{risk.mitigation}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}

function ReplanPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Incident Replanning" state={missionCycle.status} />;
  }

  const decision = missionCycle.replan.replan_decision;

  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={GitBranch} title="Incident Replanning" meta={decision.incident_id} />

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label="Decision" value={decision.decision} />
        <Metric label="Makeup" value={decision.makeup_flight_required ? "Required" : "No"} />
        <Metric label="Takeover" value={decision.human_takeover_required ? "Required" : "No"} />
      </div>

      <p className="mt-4 border border-zinc-800 bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-300">
        {decision.reason}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ActionList title="Actions" items={decision.actions} tone="teal" />
        <ActionList title="Rejected Alternatives" items={decision.alternatives_considered} tone="amber" />
      </div>
    </section>
  );
}

function ReviewPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Mission Review" state={missionCycle.status} />;
  }

  const review = missionCycle.review.mission_review;

  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={CheckCircle2} title="Mission Review" meta={review.mission_id} />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ProgressMetric label="Completion" value={review.completion_rate} />
        <ProgressMetric label="Data Quality" value={review.data_quality_score} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ActionList title="Makeup Flight" items={review.makeup_flight_plan} tone="teal" />
        <ActionList title="Human Review" items={review.human_review_checklist} tone="amber" />
      </div>
    </section>
  );
}

function PanelTitle({
  icon: Icon,
  title,
  meta,
}: {
  icon: typeof Activity;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-teal-300/30 bg-teal-300/10 text-teal-200">
          <Icon aria-hidden="true" size={19} />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <span className="max-w-40 truncate border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-zinc-400">
        {meta}
      </span>
    </div>
  );
}

function StatusTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
}) {
  return (
    <article className="flex min-h-20 items-center gap-3 border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex h-9 w-9 items-center justify-center border border-zinc-700 bg-zinc-950 text-teal-200">
        <Icon aria-hidden="true" size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-zinc-100">{value}</p>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <article className={`border border-zinc-800 bg-zinc-950/70 ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">{value}</p>
    </article>
  );
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <article className="border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className="text-sm font-semibold text-white">{value}%</p>
      </div>
      <div className="mt-3 h-2 bg-zinc-800">
        <div className="h-2 bg-teal-300" style={{ width: `${value}%` }} />
      </div>
    </article>
  );
}

function ActionList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "teal" | "amber";
}) {
  const color = tone === "teal" ? "text-teal-200" : "text-amber-200";

  return (
    <div>
      <SectionLabel label={title} />
      <div className="mt-3 grid gap-2">
        {items.slice(0, 4).map((item) => (
          <div
            className="flex items-start gap-2 border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm leading-5 text-zinc-300"
            key={item}
          >
            <CheckCircle2 aria-hidden="true" className={`mt-0.5 shrink-0 ${color}`} size={15} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const className = useMemo(() => {
    if (level === "critical") {
      return "border-red-400/40 bg-red-400/10 text-red-200";
    }
    if (level === "high") {
      return "border-amber-400/40 bg-amber-400/10 text-amber-200";
    }
    return "border-teal-400/40 bg-teal-400/10 text-teal-200";
  }, [level]);

  return (
    <span className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>
      {level}
    </span>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</p>;
}

function PanelFallback({
  title,
  state,
}: {
  title: string;
  state: "loading" | "failed";
}) {
  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={Clock3} title={title} meta={state} />
      <div className="mt-4 border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-300">
        {state === "loading" ? "Loading mock mission data..." : "Mission data unavailable."}
      </div>
    </section>
  );
}

function BackendStatus({ health }: { health: HealthState }) {
  if (health.status === "loading") {
    return (
      <div className="border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
        Checking backend...
      </div>
    );
  }

  if (health.status === "offline") {
    return (
      <div className="border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
        Backend offline: {health.message}
      </div>
    );
  }

  return (
    <div className="border border-teal-400/40 bg-teal-400/10 px-4 py-3 text-sm text-teal-100">
      Backend online: {health.data.service} / {health.data.mode}
    </div>
  );
}
