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
      failure_reasons: [
        "hard-airspace-flyable: Airspace is not flyable under current constraints.",
        "Unexpected risks detected: hard-risk-airspace-flyable.",
        "No replan decision found for incident type no_fly_zone_overlap.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "空域合规禁飞区阻断评测用例",
          category: "空域合规-禁飞区",
          failure_reasons: [
            "硬约束：当前空域约束下不可飞行。",
            "风险识别：发现禁飞区重叠风险。",
            "异常处置：缺少针对禁飞区重叠的重规划决策。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-device-insufficient-battery",
      case_name: "Device-state insufficient battery evaluation case",
      category: "device_state_insufficient_battery",
      failure_reasons: [
        "hard-battery-margin: Battery margin is below the configured safe threshold.",
        "Unexpected risks detected: hard-risk-battery-margin, runner-return_reserve_already_violated.",
        "No replan decision found for incident type insufficient_battery.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "设备电量不足评测用例",
          category: "设备状态-电量不足",
          failure_reasons: [
            "硬约束：电量安全余量低于配置阈值。",
            "风险识别：发现返航电量余量不足风险。",
            "异常处置：缺少针对电量不足的重规划决策。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-device-video-latency-too-high",
      case_name: "Device-state video transmission latency evaluation case",
      category: "device_state_video_latency",
      failure_reasons: [
        "hard-video-latency: Video latency exceeds the configured safe threshold.",
        "Unexpected risks detected: hard-risk-video-latency.",
        "No replan decision found for incident type video_latency_too_high.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "图传延迟过高评测用例",
          category: "设备状态-图传延迟",
          failure_reasons: [
            "硬约束：图传延迟超过安全阈值。",
            "风险识别：发现图传链路延迟风险。",
            "异常处置：缺少针对图传延迟过高的重规划决策。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-high-risk-crowd-low-altitude-hovering",
      case_name: "High-risk crowd and low-altitude hovering evaluation case",
      category: "high_risk_crowd_safety",
      failure_reasons: [
        "hard-crowd-level: Crowd level blocks safe low-altitude operation.",
        "hard-crowd-low-altitude-hover: High crowd level is paired with low-altitude hovering.",
        "Unexpected risks detected: hard-risk-crowd-level, runner-people_safety_distance_violation.",
        "No replan decision found for incident type crowd_low_altitude_hovering_risk.",
        "No-fly or delayed time decision must explain why the time is unsafe.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "高人流低空悬停风险评测用例",
          category: "人群安全-低空悬停",
          failure_reasons: [
            "硬约束：人流等级阻断低空安全作业。",
            "硬约束：高人流区域叠加低空悬停风险。",
            "风险识别：发现人员安全距离不足风险。",
            "异常处置：缺少针对人群聚集低空悬停风险的重规划决策。",
            "可解释性：延后或禁飞决策需要解释该时段不安全的原因。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-high-risk-gps-confidence-degradation",
      case_name: "High-risk GPS confidence degradation evaluation case",
      category: "high_risk_gps_degradation",
      failure_reasons: [
        "hard-gps-confidence: GPS confidence is below the configured safe threshold.",
        "Unexpected risks detected: hard-risk-gps-confidence, runner-localization_uncertainty.",
        "No replan decision found for incident type gps_confidence_degradation.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "GPS 置信度下降评测用例",
          category: "导航定位-GPS 置信度",
          failure_reasons: [
            "硬约束：GPS 置信度低于安全阈值。",
            "风险识别：发现定位不确定性风险。",
            "异常处置：缺少针对 GPS 置信度下降的重规划决策。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-high-risk-wind-exceeds-threshold",
      case_name: "High-risk wind exceeds threshold evaluation case",
      category: "high_risk_weather_wind",
      failure_reasons: [
        "hard-wind-speed: Wind speed exceeds the safe operating threshold.",
        "Unexpected risks detected: hard-risk-wind-speed.",
        "No replan decision found for incident type weather_wind_threshold_exceeded.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "风速超过阈值评测用例",
          category: "天气风险-风速",
          failure_reasons: [
            "硬约束：风速超过安全作业阈值。",
            "风险识别：发现风速超限风险。",
            "异常处置：缺少针对风速超限的重规划决策。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-incident-battery-below-rth-threshold",
      case_name: "Incident injection battery below return threshold evaluation case",
      category: "incident_injection_battery_rth",
      failure_reasons: [
        "hard-battery-margin: Battery margin is below the configured safe threshold.",
        "Unexpected risks detected: hard-risk-battery-margin.",
        "Task split count exceeds baseline tolerance.",
        "Uncovered areas or makeup flight load are higher than expected.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "返航电量低于阈值异常注入用例",
          category: "异常注入-返航电量",
          failure_reasons: [
            "硬约束：电量安全余量低于配置阈值。",
            "风险识别：发现电量余量不足风险。",
            "方案效率：任务拆分次数超过基准容忍范围。",
            "补飞计划：未覆盖区域或补飞负载高于预期。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-incident-crowd-gathering-route",
      case_name: "Incident injection crowd gathering evaluation case",
      category: "incident_injection_crowd_safety",
      failure_reasons: [
        "hard-crowd-level: Crowd level blocks safe low-altitude operation.",
        "hard-crowd-low-altitude-hover: High crowd level is paired with low-altitude hovering.",
        "Unexpected risks detected: hard-risk-crowd-level.",
        "Makeup flight decision must explain unfinished or uncovered work.",
        "Uncovered areas or makeup flight load are higher than expected.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "航线周边人群聚集异常注入用例",
          category: "异常注入-人群安全",
          failure_reasons: [
            "硬约束：人流等级阻断低空安全作业。",
            "硬约束：高人流区域叠加低空悬停风险。",
            "风险识别：发现人群安全风险。",
            "可解释性：补飞决策需要解释未完成或未覆盖区域。",
            "补飞计划：未覆盖区域或补飞负载高于预期。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-incident-gps-confidence-drop",
      case_name: "Incident injection GPS confidence drop evaluation case",
      category: "incident_injection_gps_confidence",
      failure_reasons: [
        "hard-gps-confidence: GPS confidence is below the configured safe threshold.",
        "Unexpected risks detected: hard-risk-gps-confidence, runner-localization_uncertainty_near_obstacles.",
        "Uncovered areas or makeup flight load are higher than expected.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "GPS 置信度突降异常注入用例",
          category: "异常注入-GPS 置信度",
          failure_reasons: [
            "硬约束：GPS 置信度低于安全阈值。",
            "风险识别：发现近障碍物定位不确定性风险。",
            "补飞计划：未覆盖区域或补飞负载高于预期。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-incident-video-latency-increase",
      case_name: "Incident injection video latency increase evaluation case",
      category: "incident_injection_video_latency",
      failure_reasons: [
        "hard-video-latency: Video latency exceeds the configured safe threshold.",
        "Unexpected risks detected: hard-risk-video-latency.",
        "Task split count exceeds baseline tolerance.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "图传延迟增加异常注入用例",
          category: "异常注入-图传延迟",
          failure_reasons: [
            "硬约束：图传延迟超过安全阈值。",
            "风险识别：发现图传链路延迟风险。",
            "方案效率：任务拆分次数超过基准容忍范围。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
    {
      case_id: "eval-incident-wind-speed-spike",
      case_name: "Incident injection wind speed spike evaluation case",
      category: "incident_injection_wind_speed",
      failure_reasons: [
        "hard-wind-speed: Wind speed exceeds the safe operating threshold.",
        "Unexpected risks detected: hard-risk-wind-speed.",
        "Uncovered areas or makeup flight load are higher than expected.",
        "Plan efficiency cannot offset hard constraint failures.",
      ],
      localized: {
        zh: {
          case_name: "风速突增异常注入用例",
          category: "异常注入-风速",
          failure_reasons: [
            "硬约束：风速超过安全作业阈值。",
            "风险识别：发现风速突增风险。",
            "补飞计划：未覆盖区域或补飞负载高于预期。",
            "方案效率：不能用效率收益抵消硬约束失败。",
          ],
        },
      },
    },
  ],
};
