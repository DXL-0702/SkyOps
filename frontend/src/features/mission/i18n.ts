export type Locale = "zh" | "en";

const zhText: Record<string, string> = {
  loading: "加载中",
  online: "在线",
  offline: "离线",
  ready: "已就绪",
  failed: "失败",
  waiting: "等待中",
  available: "可查看",
  mock: "模拟",
  simulated: "仿真",
  real: "真实",
  MOCK: "模拟",
  SIMULATED: "仿真",
  REAL: "真实",
  critical: "严重",
  high: "高",
  medium: "中",
  low: "低",
  "Manual review": "人工复核",
  "Manual Review": "人工复核",
  "Backend online": "后端在线",
  "Backend offline": "后端离线",
  "Checking mission autonomy backend": "正在检查任务自治后端",
  "Retry health check": "重新检查后端",
  "Open backend URL": "打开后端地址",
  Endpoint: "接口地址",
  "Vite proxy -> 127.0.0.1:8000": "Vite 代理 -> 127.0.0.1:8000",
  "Mission console sections": "任务控制台分区",

  "Mission Task": "任务输入",
  "Mission Task Source": "任务来源",
  "Natural language": "自然语言",
  "Generate Mission Plan": "生成任务方案",
  "Decision loop ready": "决策闭环已就绪",
  "Plan ready": "方案已生成",
  "Explainable plan": "可解释方案",
  "Plan, risk explanation, incident response, and review report are generated from mock mission data.":
    "任务方案、风险解释、异常响应和复盘报告均由模拟任务数据生成。",
  "Plan, risk stack, incident response, and review summary are generated from mock mission data.":
    "任务方案、风险栈、异常处置和复盘摘要均由模拟任务数据生成。",
  "Generating plan...": "正在生成方案...",
  "Mission decision loop running": "任务决策闭环运行中",
  "In progress": "进行中",
  "Checking task, constraints, and risks.": "正在检查任务、约束和风险。",
  "SkyOps is turning the natural-language task into a constrained low-altitude operation plan.":
    "SkyOps 正在将自然语言任务转化为带约束的低空作业方案。",
  "Task parsing": "任务解析",
  "Constraint reasoning": "约束推理",
  "Risk simulation": "风险推演",
  "Replan and review": "重规划与复盘",
  "Mission decision loop unavailable": "任务决策闭环不可用",
  "Unable to generate plan.": "无法生成方案。",
  "Possible Causes": "可能原因",
  "Suggested Actions": "建议动作",
  "Retry Mission Loop": "重试任务闭环",
  Retry: "重试",
  "Incident Control": "异常控制",
  "Incident Injection": "异常注入",
  "Replan trigger": "重规划触发",
  "Event Control Panel": "事件控制面板",
  "Select one incident to inject, then synchronize replanning and review.":
    "选择一个异常注入事件，然后同步更新重规划与复盘。",
  Updating: "更新中",
  Incident: "异常",
  Crowd: "人流",
  "Observed Value": "观测值",
  Threshold: "阈值",
  "Incident update unavailable": "异常更新不可用",
  "Unable to replan.": "无法重规划。",
  "Inject an incident to view replanning.": "注入异常后查看重规划决策。",
  "Active Incident": "当前异常",
  "Mission Task Input": "任务描述",

  "Mission Plan": "任务方案",
  Plan: "方案",
  Planning: "规划",
  Environment: "环境",
  Airspace: "空域",
  Drone: "设备",
  Coverage: "覆盖率",
  Duration: "时长",
  Wind: "风速",
  GPS: "GPS",
  Video: "图传",
  Battery: "电量",
  battery: "电量",
  data_link: "数据链路",
  "Data Link": "数据链路",
  "data link": "数据链路",
  crowd: "人流",
  airspace: "空域",
  "Operation Object": "作业对象",
  "Operation Area": "作业区域",
  "Risk Preference": "风险偏好",
  "Operation Goals": "作业目标",
  "Time Window": "时间窗口",
  Requested: "用户要求",
  "Route Strategy": "航线策略",
  "Launch And Landing Points": "起降点",
  "Flight Segments": "飞行分段",
  "Safety Thresholds": "安全阈值",

  "Environment & Drone": "环境与设备",
  "Planning Inputs": "规划输入",
  "Environment State": "环境状态",
  Visibility: "能见度",
  "GPS Confidence": "GPS 置信度",
  "Data Confidence": "数据置信度",
  "Crowd level": "人流等级",
  "Data confidence": "数据置信度",
  "Drone State": "设备状态",
  Endurance: "续航",
  "RTH Battery": "返航电量",
  "Video Latency": "图传延迟",
  Aircraft: "无人机",
  AVAILABLE: "可用",
  UNAVAILABLE: "不可用",
  "Link Quality": "链路质量",

  "Risk Stack": "风险栈",
  "Risk Explanation": "风险解释",
  Explainable: "可解释",
  "Risk Assessment": "风险评估",
  "Sorted by severity": "按严重程度排序",
  Filter: "筛选",
  All: "全部",
  Critical: "严重",
  High: "高",
  Medium: "中",
  Low: "低",
  "Visible Risks": "当前风险",
  "High Priority": "高优先级",
  "Human Confirm": "人工确认",
  "Blocking risk": "阻断风险",
  "Abort or manual review": "中止或人工复核",
  "Watch and constrain": "观察并约束",
  Monitor: "监控",
  Mitigation: "缓解措施",
  "Human Confirmation": "人工确认",
  "Decision Impact": "决策影响",
  Evidence: "证据",
  "Show less": "收起",
  "Show less evidence": "收起证据",
  "Show more evidence": "展开更多证据",
  "No evidence items provided by this risk response.": "该风险响应未提供证据项。",
  "Required before execution or replanning.": "执行或重规划前需要人工确认。",
  "Not required by this risk item; continue monitoring.": "该风险项暂不要求人工确认，继续监控。",
  "May shift the recommended time window or trigger wind abort thresholds.":
    "可能调整推荐时间窗口，或触发风速中止阈值。",
  "May require a conservative route strategy and larger standoff distance.":
    "可能需要保守航线策略和更大的安全距离。",
  "May force task splitting, return-to-home, or supplement flight planning.":
    "可能迫使任务拆分、返航或生成补飞计划。",
  "May pause low-altitude work or move launch and landing operations.":
    "可能暂停低空作业，或调整起降操作。",
  "May block execution until compliance review or approval is confirmed.":
    "可能阻断执行，直到合规复核或审批确认。",
  "May pause close-range segments or request manual takeover.":
    "可能暂停近距离航段，或请求人工接管。",
  "Review before execution and keep this risk visible during replanning.":
    "执行前需要复核，并在重规划时保持该风险可见。",
  "No risks match this filter. The complete risk assessment is still available under other severity levels.":
    "当前筛选条件下没有风险项。完整风险评估仍可在其他严重等级中查看。",
  "Waiting for risk simulation results from the mission decision loop.":
    "正在等待任务决策闭环返回风险推演结果。",
  "Generate a plan to view risk explanation.": "生成任务方案后查看风险解释。",

  "Simulated Sandbox": "仿真沙盘",
  "Mock Spatial Layer": "模拟空间层",
  Sandbox: "沙盘",
  "Not a real map": "非真实地图",
  "Simulated route and risk sandbox": "仿真航线与风险沙盘",
  "Building Facade": "建筑外立面",
  "GPS Weak Zone": "GPS 弱信号区",
  "Restricted Zone": "限制区",
  "Crowd Zone": "人流风险区",
  "Segment 1": "航段 1",
  "Segment 2": "航段 2",
  "Segment 3": "航段 3",
  "Segment 4": "航段 4",
  Launch: "起降点",
  "Standby Point": "待命点",
  "Sandbox Legend": "沙盘图例",
  "Spatial Notes": "空间提示",
  "Launch Point": "起降点",
  "Route Segments": "航线航段",
  "Sandbox is simulated and not suitable for real navigation.":
    "该沙盘为仿真展示，不适用于真实导航。",
  "Route keeps standoff near GPS weak and crowd-sensitive zones.":
    "航线在 GPS 弱信号区和人流敏感区附近保持安全距离。",
  "No real coordinates, map tiles, or airspace service are used in this panel.":
    "本面板未使用真实坐标、地图瓦片或空域服务。",

  "Risk Mini Charts": "风险小图表",
  "Review Mini Charts": "复盘小图表",
  "Completion And Quality": "完成度与质量",
  "Risk Distribution": "风险分布",
  "Chart Data": "图表数据",
  "Risk Level Counts": "风险等级数量",
  "Review Scores": "复盘评分",
  "Text fallback": "文字备份",
  "High priority risks": "高优先级风险",
  Count: "数量",
  value: "数量",

  "Abort Logic": "中止逻辑",
  Rules: "规则",
  "Wind Speed": "风速",
  "Battery Reserve": "电量余量",
  TRIGGERED: "已触发",
  WATCH: "观察",
  "WITHIN LIMIT": "限值内",
  Current: "当前",
  Limit: "限制",
  "Abort Conditions": "中止条件",
  "ABORT RULE": "中止规则",
  "RULE ONLY": "仅规则",
  "Rule is defined as a conservative stop condition. It stays neutral until current telemetry enters watch or triggered range.":
    "该规则定义为保守中止条件。在当前遥测进入观察或触发区间前保持中立。",
  "Abort if wind reaches the configured limit. Upper facade operations should keep extra margin for gust exposure.":
    "风速达到配置上限时中止。高层外立面作业应为阵风暴露预留额外余量。",
  "Abort if battery crosses the safe return margin. The plan should preserve enough reserve for return and contingency.":
    "电量越过安全返航余量时中止。任务方案必须保留足够返航和应急余量。",
  "Abort or switch to conservative standoff if GPS confidence drops below the navigation threshold.":
    "GPS 置信度低于导航阈值时中止，或切换到保守安全距离航线。",
  "Abort or pause close-range work if video latency exceeds the maximum safe monitoring threshold.":
    "图传延迟超过安全监控上限时，中止或暂停近距离作业。",

  "Incident Replanning": "异常重规划",
  "Replan Decision": "重规划决策",
  "Replan Result": "重规划结果",
  "Decision Summary": "决策摘要",
  "Selected Decision": "已选择决策",
  Reason: "原因",
  "Makeup Flight Required": "需要补飞",
  "Human Takeover Required": "需要人工接管",
  Required: "需要",
  "Not Required": "不需要",
  "Affected Segments": "受影响航段",
  "No affected segment listed": "未列出受影响航段",
  "The current mock replan result did not provide route segments. Keep the active segment under manual review.":
    "当前模拟重规划结果未提供航段信息。请将当前活动航段保留在人工复核中。",
  "Replan Actions Timeline": "重规划动作时间线",
  "Action Timeline": "动作时间线",
  "Replan action sequence": "重规划动作序列",
  "No replan actions available": "无可用重规划动作",
  "The mock response returned no ordered action list. Keep this decision in manual review before execution.":
    "模拟响应未返回有序动作列表。执行前请保持人工复核。",
  Step: "步骤",
  "Alternatives Considered": "已评估备选方案",
  "Rejected Alternatives": "已拒绝备选方案",
  "Not Recommended": "不推荐",
  Rejected: "已拒绝",
  "No rejected alternatives recorded": "未记录已拒绝备选方案",
  "The current mock replan result did not return alternative options. Treat the selected decision as requiring human review.":
    "当前模拟重规划结果未返回备选方案。请将已选择决策视为需要人工复核。",
  "These options were evaluated by the replan rule and explicitly rejected. They are not recommended next steps.":
    "这些方案已由重规划规则评估并明确拒绝，不应作为下一步推荐动作。",
  "The selected decision is shown with rejected alternatives from the deterministic replan rule.":
    "当前展示的是确定性重规划规则选中的决策及其已拒绝备选方案。",
  "No rejected alternatives were returned by the mock replan rule, so the selected decision should remain reviewable.":
    "模拟重规划规则未返回已拒绝备选方案，因此该决策仍应保持可复核。",

  "Mission Review": "任务复盘",
  Mission: "任务",
  "Review Result": "复盘结果",
  "Review Report": "复盘报告",
  "No Incident Injected": "未注入异常",
  "Makeup Flight Suggested": "建议补飞",
  "No Makeup Flight Required": "无需补飞",
  "Mission completion, data quality, triggered risks, uncovered work, and next-step review items are generated from mock review data.":
    "任务完成度、数据质量、风险触发、未覆盖工作和下一步复核项均由模拟复盘数据生成。",
  "Mission Completion": "任务完成度",
  "Data Quality": "数据质量",
  "Incident Events": "异常事件",
  "Risk Trigger Log": "风险触发记录",
  "Uncovered Areas": "未覆盖区域",
  "Makeup Flight Plan": "补飞计划",
  "Human Review Checklist": "人工复核清单",
  "Next Mission Optimizations": "下次任务优化",
  "No incident recorded": "未记录异常",
  "The current mock review did not include injected incident events.":
    "当前模拟复盘未包含注入异常事件。",
  "No risk trigger recorded": "未记录风险触发",
  "No incident-derived risk trigger is present in this mock review.":
    "当前模拟复盘中没有由异常生成的风险触发项。",
  "No uncovered area": "无未覆盖区域",
  "The mock review did not list unfinished work. Keep final completion subject to human review.":
    "模拟复盘未列出未完成工作。最终完成情况仍需人工复核。",
  "No makeup flight required": "无需补飞",
  "The mock review did not recommend a makeup flight. This is not a regulatory clearance.":
    "模拟复盘未建议补飞。这不代表获得合规放行。",
  "No checklist item recorded": "未记录复核项",
  "No human review checklist item was returned by the mock review.":
    "模拟复盘未返回人工复核清单项。",
  "No optimization recorded": "未记录优化建议",
  "No next-mission optimization was returned by the mock review.":
    "模拟复盘未返回下次任务优化建议。",
  "No incident was injected in this mock mission review.":
    "本次模拟任务复盘未注入异常。",
  "No makeup flight is required by the current mock review.":
    "当前模拟复盘无需补飞。",
  "Run review to view mission results.": "运行复盘后查看任务结果。",
  Nominal: "正常",
  Review: "复核",
  Attention: "注意",

  "Human Explanation": "决策解释",
  "Decision Evidence": "决策证据",
  "Decision Basis": "决策依据",
  Inputs: "输入",
  "Not flight permission": "不是飞行许可",
  "Decision support only": "仅作决策辅助",
  "These explanations make the mission plan auditable. They do not replace airspace approval, site safety responsibility, or manual go/no-go confirmation.":
    "这些解释用于让任务方案可审计，不替代空域审批、现场安全责任或人工放飞确认。",
  "Fact Inputs": "事实输入",
  Observed: "已观测",
  "Data and rule outputs used as decision evidence.": "作为决策证据的数据和规则输出。",
  "Model Inferences": "模型推理",
  Reasoned: "已推理",
  "Derived judgments from task, environment, airspace, and drone constraints.":
    "基于任务、环境、空域和设备约束得出的判断。",
  "Recommended Actions": "建议动作",
  Advisory: "建议",
  "Operational actions proposed by the task autonomy layer.": "任务自治层提出的作业动作。",
  "Items that must remain under human safety or compliance review.":
    "必须保留给人工安全或合规复核的事项。",
  "Waiting for facts, inferences, recommended actions, and human confirmation items.":
    "正在等待事实输入、模型推理、建议动作和人工确认项。",
  "Generate a plan to view decision evidence.": "生成任务方案后查看决策证据。",
  "Please retry or keep this task under manual review.":
    "请重试，或将该任务保持在人工复核中。",

  "Mission decision loop is running.": "任务决策闭环运行中。",
  "Mission data unavailable.": "任务数据不可用。",
  "SkyOps is parsing the task, checking constraints, simulating risks, and preparing an explainable plan.":
    "SkyOps 正在解析任务、检查约束、推演风险并生成可解释方案。",
  "No flight recommendation should be used until the failed state is reviewed.":
    "失败状态完成复核前，不应使用任何飞行建议。",
  "Task understanding": "任务理解",
  "Constraint check": "约束检查",
  "Plan assembly": "方案组装",
  "Pause execution and keep the task under manual review.": "暂停执行，并保持人工复核。",
  "Retry after backend status and mock scenario data are confirmed.":
    "确认后端状态和模拟场景数据后重试。",

  "Mission autonomy backend is unavailable. Keep the current plan in review mode until the service is reachable.":
    "任务自治后端不可用。在服务恢复前，请将当前方案保持在复核模式。",
  "Mission decision loop is temporarily unavailable. No flight recommendation was generated for this request.":
    "任务决策闭环暂时不可用。本次请求未生成飞行建议。",
  "The FastAPI backend is not running or the API endpoint is unreachable.":
    "FastAPI 后端未运行，或 API 地址不可达。",
  "The mission planning, replanning, or review endpoint returned an invalid response.":
    "任务规划、重规划或复盘接口返回了无效响应。",
  "The current mock scenario is unavailable or does not match the frontend contract.":
    "当前模拟场景不可用，或与前端契约不匹配。",
  "Restart the backend service and run the mission loop again.":
    "重启后端服务并重新运行任务闭环。",
  "Pause execution and request manual review before using this task plan.":
    "暂停执行，并在使用该任务方案前请求人工复核。",
  "Incident update failed. The previous mission plan and active incident are preserved for manual review.":
    "异常更新失败。已保留上一版任务方案和当前异常，等待人工复核。",

  "180m high-rise office building facade": "180米高层办公楼外立面",
  "Nanshan District, Shenzhen": "深圳市南山区",
  "curtain wall crack screening": "幕墙裂缝排查",
  "detachment risk screening": "脱落风险排查",
  "tomorrow morning": "明天上午",
  "safety first; minimize pedestrian impact": "安全优先；尽量减少对行人影响",
  "good": "良好",
  "partial urban canyon risk near the building facade": "建筑外立面附近存在局部城市峡谷风险",
  "Simulated partly cloudy morning with moderate wind.": "模拟多云上午，风速中等。",
  "DJI Matrice class mock platform": "DJI Matrice 级模拟平台",
  "zoom camera": "变焦相机",
  "wide camera": "广角相机",
  weather: "天气",
  navigation: "导航",
  "Wind gusts may increase near the upper facade.": "高层外立面附近阵风可能增强。",
  "Facade geometry may reduce GPS confidence in close-range flight.":
    "外立面几何结构可能降低近距离飞行的 GPS 置信度。",
  "wind_speed_mps >= 8.0": "风速 >= 8.0 m/s",
  "gps_confidence < 0.65": "GPS 置信度 < 0.65",
  "Pause facade segment and return to standby point if gust threshold is exceeded.":
    "如超过阵风阈值，暂停外立面航段并返回待命点。",
  "Switch to conservative standoff route and request pilot confirmation.":
    "切换到保守安全距离航线，并请求飞手确认。",
  "mock weather profile": "模拟天气画像",
  "high-rise facade wind exposure": "高层外立面风暴露",
  "mock urban canyon zone": "模拟城市峡谷区域",
  "building height 180m": "建筑高度 180米",
  "09:45-11:15 simulated local time": "09:45-11:15 模拟本地时间",
  "South plaza buffer point": "南侧广场缓冲点",
  "Mock launch point away from pedestrian peak flow.": "远离行人高峰流线的模拟起飞点。",
  "keep pedestrian separation": "保持人机/行人隔离",
  "manual confirmation required before takeoff": "起飞前需要人工确认",
  "Two-segment conservative vertical facade scan with increased standoff distance near GPS-risk area.":
    "采用两段式保守垂直外立面扫描，并在 GPS 风险区域增加安全距离。",
  "south facade lower segment": "南立面下部航段",
  "south facade upper segment": "南立面上部航段",
  "battery_percent <= 35": "电量 <= 35%",
  "crowd_level == high": "人流等级 == 高",
  "Input mission targets a high-rise facade in Nanshan District.":
    "输入任务目标为南山区高层建筑外立面。",
  "All environment, airspace, and drone states are mock data.":
    "所有环境、空域和无人机状态均为模拟数据。",
  "The mission should use a conservative route because GPS confidence may drop near the facade.":
    "由于外立面附近 GPS 置信度可能下降，任务应采用保守航线。",
  "Approval is required before execution according to the mock airspace constraint.":
    "根据模拟空域约束，执行前需要审批。",
  "Use the recommended late-morning window.": "使用推荐的上午偏后时间窗口。",
  "Confirm approval status and pedestrian separation before takeoff.":
    "起飞前确认审批状态和行人隔离。",
  "Prepare a makeup flight for uncovered upper facade areas.":
    "为未覆盖的上部外立面区域准备补飞。",
  "Airspace approval": "空域审批",
  "Launch point safety": "起降点安全",
  "Pilot readiness for manual takeover": "飞手人工接管准备",
  "avoid pedestrian peak periods": "避开行人高峰时段",
  "use conservative route": "使用保守航线",
  building_facade_inspection: "建筑外立面巡检",
  "mock temporary control buffer north-east of target block": "目标楼宇东北侧模拟临时管控缓冲区",
  "Mock airspace data indicates flight is possible only with approval and a conservative altitude profile.":
    "模拟空域数据表明，仅在完成审批并采用保守高度剖面时可以执行飞行。",
  "Mock plan prioritizes approval, pedestrian separation, GPS confidence, and safe return margin over full single-flight coverage.":
    "模拟方案优先考虑审批、行人隔离、GPS 置信度和安全返航余量，而不是追求单次飞行全覆盖。",
  "Hard constraint evaluation passed: true.": "硬约束评估通过：是。",
  "Hard constraint evaluation passed: false.": "硬约束评估通过：否。",
  "Wind speed is below threshold.": "风速低于安全阈值。",
  "Battery margin is sufficient.": "电量余量充足。",
  "Battery margin is below the configured safe threshold.": "电量余量低于已配置的安全阈值。",
  "GPS confidence is acceptable.": "GPS 置信度处于可接受范围。",
  "Video latency is acceptable.": "图传延迟处于可接受范围。",
  "Video latency exceeds the configured safe threshold.": "图传延迟超过已配置的安全阈值。",
  "Crowd level does not block the mission.": "当前人流等级不会阻断任务。",
  "Airspace is marked flyable by the current constraint data.":
    "当前约束数据将该空域标记为可飞。",

  wind_speed_spike: "风速突增",
  gps_confidence_drop: "GPS 置信度下降",
  video_latency_increase: "图传延迟增加",
  battery_low: "电量不足",
  crowd_gathering: "人流聚集",
  temporary_airspace_restriction: "临时空域限制",
  "Simulated sudden wind increase near the upper facade.": "模拟高层外立面附近风速突然升高。",
  "Simulated GPS confidence drop near the facade.": "模拟外立面附近 GPS 置信度下降。",
  "Simulated video transmission latency increase.": "模拟图传延迟增加。",
  "Simulated battery level crossing the safe return margin.": "模拟电量越过安全返航余量。",
  "Simulated pedestrian gathering near the launch area.": "模拟起飞区域附近出现行人聚集。",
  "Simulated temporary airspace restriction update.": "模拟临时空域限制更新。",
  "temporary restriction active": "临时限制生效",
  "no active restriction": "无生效限制",

  pause_and_return_to_standby: "暂停任务并返回待命点",
  switch_to_conservative_standoff_route: "切换到保守安全距离航线",
  pause_until_link_recovers: "暂停至链路恢复",
  return_to_home_and_split_makeup_flight: "返航并拆分补飞",
  pause_and_clear_pedestrian_risk: "暂停并清除行人风险",
  abort_and_request_compliance_review: "中止任务并请求合规复核",
  pause_for_manual_review: "暂停并请求人工复核",
  "pause current facade scan": "暂停当前外立面扫描",
  "return to launch or standby point": "返回起飞点或待命点",
  "preserve collected imagery and telemetry": "保留已采集影像和遥测数据",
  "generate makeup flight for unfinished facade segments": "为未完成外立面航段生成补飞计划",
  "resume only after wind speed returns below threshold": "仅在风速回落至阈值以下后恢复",
  "pause close-range facade segment": "暂停近距离外立面航段",
  "increase standoff distance": "增加安全距离",
  "switch to conservative waypoint path": "切换到保守航点路径",
  "request pilot readiness for manual takeover": "请求飞手做好人工接管准备",
  "mark low-confidence area for makeup flight": "将低置信度区域标记为补飞区域",
  "pause mission progress": "暂停任务进度",
  "hold or return to standby point based on pilot confirmation": "根据飞手确认悬停或返回待命点",
  "check video transmission quality": "检查图传质量",
  "preserve collected data before retrying": "重试前保留已采集数据",
  "resume only after latency returns below threshold": "仅在延迟回落至阈值以下后恢复",
  "stop new data collection": "停止新增数据采集",
  "return to launch point immediately": "立即返回起飞点",
  "preserve completed segment data": "保留已完成航段数据",
  "record unfinished coverage": "记录未完成覆盖区域",
  "create makeup flight after battery replacement": "换电后创建补飞任务",
  "pause low-altitude operation": "暂停低空作业",
  "avoid hovering above crowd area": "避免在人群区域上方悬停",
  "move to safe standby point": "移动至安全待命点",
  "notify human safety responsible person": "通知人工安全负责人",
  "reschedule affected area to lower crowd window": "将受影响区域改排至低人流时段",
  "abort mission execution": "中止任务执行",
  "record restricted area update": "记录限制区域更新",
  "request compliance review before makeup flight": "补飞前请求合规复核",
  "pause mission": "暂停任务",
  "return to launch point": "返回起飞点",
  "preserve collected data": "保留已采集数据",
  "generate makeup flight plan for uncovered facade zones": "为未覆盖外立面区域生成补飞计划",
  "request human review of unknown incident": "请求人工复核未知异常",
  "resume only after explicit confirmation": "仅在明确确认后恢复",
  "Observed wind condition exceeds the mission safety threshold, so coverage is deprioritized in favor of aircraft stability and pedestrian safety.":
    "观测到的风况超过任务安全阈值，因此应优先保障飞行器稳定和行人安全，而不是继续追求覆盖率。",
  "GPS confidence has fallen below the navigation safety threshold near the building facade, so close-range autonomous flight should be degraded.":
    "建筑外立面附近 GPS 置信度已低于导航安全阈值，因此应降级近距离自主飞行。",
  "Video transmission latency exceeds the configured safety threshold, reducing operator situational awareness during low-altitude work.":
    "图传延迟超过配置的安全阈值，会降低操作员在低空作业中的态势感知。",
  "Battery level is at or below the safe return margin, so the mission must protect return-to-home capability before coverage.":
    "电量已达到或低于安全返航余量，因此任务必须优先保障返航能力，而不是继续覆盖。",
  "A crowd gathering increases ground safety risk, so low-altitude operation should pause until pedestrian separation is restored.":
    "人群聚集会增加地面安全风险，因此低空作业应暂停，直到恢复行人隔离。",
  "A temporary airspace restriction changes mission compliance status, so the system must stop instead of attempting to route around it without review.":
    "临时空域限制改变了任务合规状态，因此系统必须停止，而不是在未经复核时尝试绕飞。",
  "The incident type is not covered by deterministic replan rules, so the safe default is to pause and request manual review.":
    "该异常类型未被确定性重规划规则覆盖，因此安全默认动作是暂停并请求人工复核。",
  "continue with reduced speed": "降低速度继续执行",
  "switch to closer facade route": "切换到更贴近外立面的航线",
  "wait in hover near target area": "在目标区域附近悬停等待",
  "continue original route": "继续原航线",
  "descend along current facade path": "沿当前外立面路径下降",
  "complete remaining coverage without makeup flight": "不补飞并完成剩余覆盖",
  "continue without live video confidence": "在缺乏实时图传信心时继续执行",
  "ignore video latency while telemetry remains active": "在遥测仍可用时忽略图传延迟",
  "increase speed to finish the segment": "提高速度完成航段",
  "finish the current segment before return": "返航前完成当前航段",
  "reduce payload usage and continue": "降低载荷使用并继续执行",
  "continue until critical battery warning": "继续执行直到严重低电量告警",
  "continue at lower altitude": "降低高度继续执行",
  "hover until crowd disperses": "悬停等待人群散开",
  "complete the facade segment above the crowd": "在人群上方完成外立面航段",
  "fly around the restricted area without review": "未经复核绕开限制区域飞行",
  "continue below the altitude limit": "在高度限制以下继续执行",
  "complete only the remaining short segment": "仅完成剩余短航段",
  "continue with original plan": "继续原方案",
  "infer a new route without a known rule": "在没有已知规则时推断新航线",
  "current active segment": "当前活动航段",
  "planned uncovered facade zones outside initial mock coverage": "初始模拟覆盖外的计划未覆盖外立面区域",
  "Schedule makeup flight for uncovered areas: planned uncovered facade zones outside initial mock coverage, south facade lower segment, south facade upper segment.":
    "为未覆盖区域安排补飞：初始模拟覆盖外的计划未覆盖外立面区域、南立面下部航段、南立面上部航段。",
  "Recheck wind, GPS confidence, video latency, battery margin, crowd level, and airspace.":
    "重新检查风速、GPS 置信度、图传延迟、电量余量、人流等级和空域状态。",
  "Use conservative route and preserve previously collected data before retrying.":
    "重试前使用保守航线并保留此前已采集数据。",
  "Require human safety confirmation before makeup flight execution.":
    "补飞执行前需要人工安全确认。",
  "Confirm all review inputs are mock or simulated data before presenting the result.":
    "展示结果前确认所有复盘输入均为 mock 或仿真数据。",
  "Review airspace approval, launch safety, and pilot readiness before reuse.":
    "复用前复核空域审批、起飞安全和飞手准备情况。",
  "Review human takeover requirement for incident incident-wind-001.":
    "复核异常 incident-wind-001 的人工接管要求。",
  "Compare planned coverage, completed coverage, and makeup areas before the next mission.":
    "下次任务前比较计划覆盖、已完成覆盖和补飞区域。",
  "Move the next flight to a calmer wind window or split upper facade work.":
    "将下次飞行调整到风况更平稳的窗口，或拆分上部外立面作业。",
  "Maintain conservative route settings and review whether 82% coverage is enough.":
    "保持保守航线设置，并复核 82% 覆盖率是否满足任务要求。",
  "Increase facade standoff distance in GPS-shadowed segments.":
    "在 GPS 遮挡航段增加外立面安全距离。",
  "Run data link checks before entering close-range facade segments.":
    "进入近距离外立面航段前先执行数据链路检查。",
  "Split the next mission earlier and reserve a larger return battery margin.":
    "下次任务更早拆分，并预留更大的返航电量余量。",
  "Schedule pedestrian-sensitive segments outside high crowd windows.":
    "将对行人敏感的航段安排在人流低峰窗口。",
  "Refresh airspace compliance data immediately before launch.":
    "起飞前立即刷新空域合规数据。",
  "Add deterministic replan rules for newly observed unknown incident types.":
    "为新观察到的未知异常类型补充确定性重规划规则。",
  "Wind speed exceeds the configured safe operating threshold.":
    "风速超过已配置的安全作业阈值。",
  "Pause mission and wait for safer wind conditions.":
    "暂停任务，等待更安全的风况。",
  "Battery level is not sufficient for safe mission execution and return.":
    "电量不足以支持安全执行任务并返航。",
  "Do not launch. Replace battery or split the mission.":
    "不要起飞。更换电池或拆分任务。",
  "GPS confidence is below the configured safe threshold.":
    "GPS 置信度低于已配置的安全阈值。",
  "Use conservative standoff route or request manual takeover readiness.":
    "使用保守安全距离航线，或请求人工接管准备。",
  "Video transmission latency exceeds the configured safe threshold.":
    "图传延迟超过已配置的安全阈值。",
  "Pause mission and restore data link quality before continuing.":
    "暂停任务，恢复数据链路质量后再继续。",
  "Crowd level blocks safe low-altitude operation.":
    "当前人流等级阻断安全低空作业。",
  "Pause mission or move to a safer time window.":
    "暂停任务，或调整到更安全的时间窗口。",
  "Airspace constraints indicate the mission is not flyable.":
    "空域约束显示当前任务不可飞。",
  "Do not launch. Request compliance review or choose a different plan.":
    "不要起飞。请求合规复核或选择其他方案。",
};

export function t(locale: Locale, value: string): string {
  if (locale === "en") {
    return value;
  }

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.replace(/\s+/g, " ");

  return zhText[value] ?? zhText[trimmedValue] ?? zhText[normalizedValue] ?? value;
}

export function formatCheckEndpoint(locale: Locale, endpoint: string): string {
  return locale === "zh"
    ? `检查当前 API 地址：${endpoint}。`
    : `Check the configured API endpoint: ${endpoint}.`;
}

export function formatApiEndpointLabel(locale: Locale, endpoint: string): string {
  if (endpoint !== "") {
    return endpoint;
  }

  return t(locale, "Vite proxy -> 127.0.0.1:8000");
}

export function formatMoreCount(locale: Locale, count: number): string {
  return locale === "zh" ? `还有 ${count} 项` : `+${count} more`;
}

export function formatIncidentObservation(
  locale: Locale,
  eventType: string,
  observedValue: string,
  threshold: string,
): string {
  if (locale === "zh") {
    return `${t(locale, eventType)}：观测值 ${t(locale, observedValue)}，阈值 ${t(locale, threshold)}。`;
  }

  return `${eventType}: observed ${observedValue} against threshold ${threshold}.`;
}

export function formatRiskTriggerSummary(
  locale: Locale,
  incidentId: string,
  eventType: string,
  observedValue: string,
  threshold: string,
  decision: string,
): string {
  if (locale === "zh") {
    return `${incidentId}：${t(locale, eventType)}触发，观测值 ${t(locale, observedValue)}，阈值 ${t(locale, threshold)}；决策=${t(locale, decision)}。`;
  }

  return `${incidentId}: ${eventType} observed ${observedValue} against threshold ${threshold}; decision=${decision}.`;
}

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
      dataModeValue: "模拟 / 仿真",
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
