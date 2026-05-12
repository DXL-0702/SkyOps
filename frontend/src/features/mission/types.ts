import type { LucideIcon } from "lucide-react";

import type { BackendHealth } from "../../api/health";
import type {
  IncidentEvent,
  MissionPlanResponse,
  MissionReplanResponse,
  MissionReviewResponse,
} from "../../api/mission";

export type HealthState =
  | { status: "loading" }
  | { status: "online"; data: BackendHealth }
  | { status: "offline"; message: string };

export type MissionCycleState =
  | { status: "loading" }
  | {
      status: "ready";
      plan: MissionPlanResponse;
      replan: MissionReplanResponse;
      review: MissionReviewResponse;
      incidentEvent: IncidentEvent;
    }
  | { status: "failed"; message: string };

export type IncidentPreset = {
  label: string;
  event: IncidentEvent;
  icon: LucideIcon;
};
