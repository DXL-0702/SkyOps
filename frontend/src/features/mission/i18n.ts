export type Locale = "zh" | "en";

export type MissionConsoleCopy = {
  appBadge: string;
  dataBadge: string;
  pageTitle: string;
  languageLabel: string;
  backendFallback: string;
  status: {
    backend: string;
    scenario: string;
    scenarioValue: string;
    dataMode: string;
    dataModeValue: string;
    loop: string;
    loopReady: string;
    loopFailed: string;
    loopRunning: string;
  };
  workspace: {
    flowTitle: string;
    flowSubtitle: string;
    currentFocus: string;
    missionObject: string;
    activeIncident: string;
    riskFocus: string;
    pendingIncident: string;
    fallbackObject: string;
    pendingRisk: string;
    highPriorityRisks: (count: number) => string;
    viewStatus: {
      manualReview: string;
      running: string;
      waiting: string;
      ready: string;
      available: string;
    };
    views: {
      task: {
        label: string;
        eyebrow: string;
        title: string;
        description: string;
      };
      plan: {
        label: string;
        eyebrow: string;
        title: string;
        description: string;
      };
      risk: {
        label: string;
        eyebrow: string;
        title: string;
        description: string;
      };
      incident: {
        label: string;
        eyebrow: string;
        title: string;
        description: string;
      };
      review: {
        label: string;
        eyebrow: string;
        title: string;
        description: string;
      };
    };
  };
};

export const missionConsoleCopy: Record<Locale, MissionConsoleCopy> = {
  zh: {
    appBadge: "SkyOps Agent",
    dataBadge: "演示数据",
    pageTitle: "低空作业任务自治控制台",
    languageLabel: "界面语言",
    backendFallback: "Vite 代理 -> 127.0.0.1:8000",
    status: {
      backend: "后端服务",
      scenario: "演示场景",
      scenarioValue: "深圳高层建筑",
      dataMode: "数据模式",
      dataModeValue: "Mock / 仿真",
      loop: "决策闭环",
      loopReady: "决策闭环已就绪",
      loopFailed: "决策闭环失败",
      loopRunning: "决策闭环运行中",
    },
    workspace: {
      flowTitle: "任务流程",
      flowSubtitle: "任务级自治工作台",
      currentFocus: "当前焦点",
      missionObject: "作业对象",
      activeIncident: "当前异常",
      riskFocus: "风险焦点",
      pendingIncident: "等待决策闭环",
      fallbackObject: "深圳高层建筑演示",
      pendingRisk: "风险栈待生成",
      highPriorityRisks: (count: number) => `${count} 个高优先级风险`,
      viewStatus: {
        manualReview: "人工复核",
        running: "运行中",
        waiting: "等待中",
        ready: "已就绪",
        available: "可查看",
      },
      views: {
        task: {
          label: "任务",
          eyebrow: "步骤 01",
          title: "任务输入",
          description: "从自然语言任务开始，运行完整的演示决策闭环。",
        },
        plan: {
          label: "方案",
          eyebrow: "步骤 02",
          title: "任务方案",
          description: "查看推荐时间窗口、航线策略、环境、设备状态和中止阈值。",
        },
        risk: {
          label: "风险",
          eyebrow: "步骤 03",
          title: "风险推理",
          description: "检查排序后的风险、决策影响、证据和面向人的解释依据。",
        },
        incident: {
          label: "异常",
          eyebrow: "步骤 04",
          title: "异常重规划",
          description: "注入模拟异常，查看暂停、返航、绕行或人工复核决策。",
        },
        review: {
          label: "复盘",
          eyebrow: "步骤 05",
          title: "任务复盘",
          description: "查看完成度、数据质量、风险记录、补飞建议和复核动作。",
        },
      },
    },
  },
  en: {
    appBadge: "SkyOps Agent",
    dataBadge: "Demo Data",
    pageTitle: "Low-Altitude Operations Console",
    languageLabel: "Interface language",
    backendFallback: "Vite proxy -> 127.0.0.1:8000",
    status: {
      backend: "Backend",
      scenario: "Scenario",
      scenarioValue: "Shenzhen high-rise",
      dataMode: "Data Mode",
      dataModeValue: "Mock / simulated",
      loop: "Loop",
      loopReady: "Decision loop ready",
      loopFailed: "Decision loop failed",
      loopRunning: "Decision loop running",
    },
    workspace: {
      flowTitle: "Mission Flow",
      flowSubtitle: "Task-level autonomy workspace",
      currentFocus: "Current Focus",
      missionObject: "Mission Object",
      activeIncident: "Active Incident",
      riskFocus: "Risk Focus",
      pendingIncident: "Pending decision loop",
      fallbackObject: "Shenzhen high-rise demo",
      pendingRisk: "Risk stack pending",
      highPriorityRisks: (count: number) => `${count} high-priority risks`,
      viewStatus: {
        manualReview: "Manual Review",
        running: "Running",
        waiting: "Waiting",
        ready: "Ready",
        available: "Available",
      },
      views: {
        task: {
          label: "Task",
          eyebrow: "Step 01",
          title: "Task Intake",
          description: "Start from natural-language task input and run the demo decision loop.",
        },
        plan: {
          label: "Plan",
          eyebrow: "Step 02",
          title: "Mission Plan",
          description:
            "Review recommended time window, route strategy, environment, drone state, and abort thresholds.",
        },
        risk: {
          label: "Risk",
          eyebrow: "Step 03",
          title: "Risk Reasoning",
          description:
            "Inspect sorted risks, decision impacts, evidence, and explainable human-facing rationale.",
        },
        incident: {
          label: "Incident",
          eyebrow: "Step 04",
          title: "Incident Replanning",
          description:
            "Inject a simulated incident and inspect the resulting pause, return, reroute, or review decision.",
        },
        review: {
          label: "Review",
          eyebrow: "Step 05",
          title: "Mission Review",
          description:
            "Close the loop with completion, data quality, risk logs, makeup flight advice, and review actions.",
        },
      },
    },
  },
};
