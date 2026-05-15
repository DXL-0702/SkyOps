import type { EvaluationReportSummary } from "./types";

export const mockEvaluationReport: EvaluationReportSummary = {
  report_type: "mock_simulated_evaluation",
  data_origin: "mock/simulated",
  uses_real_api: false,
  note:
    "Local mock/simulated evaluation report for task-level autonomy, risk reasoning, incident response, and explainability.",
  case_count: 39,
  passed_count: 28,
  failed_count: 11,
  hard_constraint_pass_rate: 0.963,
  risk_recall_avg: 1,
  incident_response_avg: 0.359,
  explainability_avg: 0.9882,
  failed_cases: [
    {
      case_id: "eval-compliance-no-fly-zone-blocked",
      case_name: "Airspace compliance no-fly zone blocked evaluation case",
      category: "airspace_compliance_no_fly_zone",
      failure_reasons: ["hard-airspace-flyable: Airspace is not flyable under current constraints."],
    },
    {
      case_id: "eval-device-insufficient-battery",
      case_name: "Device-state insufficient battery evaluation case",
      category: "device_state_insufficient_battery",
      failure_reasons: ["hard-battery-margin: Battery margin is below the configured safe threshold."],
    },
    {
      case_id: "eval-device-video-latency-too-high",
      case_name: "Device-state video transmission latency evaluation case",
      category: "device_state_video_latency",
      failure_reasons: ["hard-video-latency: Video latency exceeds the configured safe threshold."],
    },
    {
      case_id: "eval-high-risk-crowd-low-altitude-hovering",
      case_name: "High-risk crowd and low-altitude hovering evaluation case",
      category: "high_risk_crowd_safety",
      failure_reasons: ["hard-crowd-level: Crowd level blocks safe low-altitude operation."],
    },
    {
      case_id: "eval-high-risk-gps-confidence-degradation",
      case_name: "High-risk GPS confidence degradation evaluation case",
      category: "high_risk_gps_degradation",
      failure_reasons: ["hard-gps-confidence: GPS confidence is below the configured safe threshold."],
    },
  ],
};
