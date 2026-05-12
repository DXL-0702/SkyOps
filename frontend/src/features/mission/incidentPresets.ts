import { Battery, CloudSun, RadioTower, ShieldAlert, Signal, Users } from "lucide-react";

import { DEFAULT_MISSION_ID } from "../../api/mission";
import type { IncidentPreset } from "./types";

export const incidentPresets: IncidentPreset[] = [
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
