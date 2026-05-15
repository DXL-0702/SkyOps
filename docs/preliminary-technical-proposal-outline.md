# SkyOps Agent 初赛技术方案 Outline

> 本文档是初赛技术方案的施工图，不是最终提交版。
>
> 当前版本只基于仓库中已经完成的工程内容组织材料。后续不再单独维护 Demo 叙事脚本，本 outline 是初赛技术方案的唯一材料入口；最终提交前只需要补充最新测试结果、界面截图和必要代码片段，再扩写为 PDF 技术方案。

## 0. 写作原则

### 0.1 技术方案定位

初赛技术方案必须证明 SkyOps Agent 不是传统无人机巡检缺陷识别系统，而是面向低空作业的任务级自治与风险推演智能体。

核心叙事：

```text
低空经济规模化的问题不只是无人机会不会飞，也不只是图像里有没有缺陷，
而是每一次低空作业能否在复杂约束下被安全、合规、可解释地运营。
```

### 0.2 代码证据原则

凡是描述关键功能已经实现，应尽量附上真实代码或真实数据结构作为证据。

推荐写法：

```text
技术主张
-> 关键代码片段
-> 工程意义解释
```

控制原则：

- 每个关键功能最多放 1 段代码。
- 每段代码建议控制在 15-40 行。
- 不贴完整文件。
- 代码片段必须对应仓库中的真实实现。
- 未完成内容只能写为“正在实现”或“后续计划”，不能写成已完成。

### 0.3 当前实现状态口径

已完成内容可以写：

- 前后端基础工程。
- mock/simulated 单场景任务规划闭环。
- 显式硬约束规则引擎。
- 异常注入与重规划。
- 任务复盘与补飞建议。
- Mission Operations Console 前端 Demo。
- Phase 3 评测数据模型、数据集、loader、指标合约、评分器、runner、report JSON 和前端评测摘要面板。
- Phase 3 regression tests，用于约束评测数据、评分器、runner、report 的稳定性。

Phase 4-lite 当前已完成：

- LLM adapter contract。
- LLM 安全边界文档。
- LLM contract 基础安全边界测试。
- MockLLMProvider。
- Mock provider 基础输出稳定性测试。
- LLM adapter contract regression tests。
- 技术方案中的 LLM 角色说明。

当前不写：

- 不写“已接入真实 LLM API”。
- 不写“系统可替代法规审批或人工安全责任人”。
- 不写“Demo 脚本/演示叙事”作为独立交付物；相关说明统一收进本技术方案。

## 1. 项目背景与问题定义

### 1.1 低空经济中的任务级运营问题

要讲清楚：

- 无人机硬件、飞控、机库、图像采集、热成像、LiDAR 等能力已经相对成熟。
- 规模化低空作业的瓶颈在于安全、调度、风险、异常处置和任务闭环。
- SkyOps Agent 关注的是“该不该飞、何时飞、如何飞、异常时怎么办、如何补飞和复盘”。

建议表达：

```text
SkyOps Agent 解决的不是“无人机会不会飞”，而是“低空作业任务能不能被安全、合规、可解释地运营”。
```

### 1.2 与传统巡检系统的区别

建议放表格：

| 传统巡检/识别系统 | SkyOps Agent |
| --- | --- |
| 关注图像中是否有缺陷 | 关注任务是否安全可执行 |
| 重点是 CV 模型准确率 | 重点是约束推理、风险推演和异常重规划 |
| 输出检测报告 | 输出任务方案、风险解释、补飞计划和复盘 |
| 通常在任务后处理数据 | 在任务前、中、后形成闭环决策 |

注意：

- 可以提“建筑外立面巡检是 Demo 场景”。
- 不要让评委误以为产品本体是裂缝识别。

## 2. 产品定位

### 2.1 一句话定位

```text
SkyOps Agent 是面向深圳低空经济场景的低空作业任务自治与风险推演智能体。
```

### 2.2 三层系统位置

建议放结构图：

```text
城市级低空监管 / 空域管理 / UTM 平台
                 |
SkyOps Agent：任务自治与风险推演层
                 |
无人机 / 机库 / 飞控 / 载荷 / 巡检平台
```

说明：

- 不替代政府监管平台。
- 不替代 DJI 等飞控系统。
- 作为任务需求和执行系统之间的智能决策层。

### 2.3 可扩展场景

当前 Demo：

- 深圳某高层建筑外立面巡检任务自治与风险推演。

可扩展场景：

- 园区光伏巡检。
- 工地安全巡查。
- 园区安防。
- 应急救援。
- 消防巡查。
- 城市治理。
- 低空测绘。
- 园区物流配送。

## 3. 系统总体架构

### 3.1 当前工程架构

建议用图或表描述：

```text
Frontend Mission Operations Console
        |
FastAPI Mission API
        |
Mission Orchestrator
        |
Rules / Replanner / Reviewer / Evaluation
        |
Mock Scenarios + Evaluation Dataset
```

当前真实代码路径：

| 模块 | 路径 | 说明 |
| --- | --- | --- |
| Mission API | `backend/app/api/routes/mission.py` | 任务规划、异常重规划、复盘接口 |
| 任务规划编排 | `backend/app/core/orchestration/mission_planner.py` | 汇总任务、环境、空域、设备和硬约束 |
| 硬约束规则 | `backend/app/core/rules/engine.py` | 风速、电量、GPS、图传、人流、空域规则 |
| 异常重规划 | `backend/app/core/orchestration/incident_replanner.py` | 风速、GPS、图传、电量、人流等异常处置 |
| 任务复盘 | `backend/app/core/orchestration/mission_reviewer.py` | 任务完成度、风险记录、补飞建议 |
| 评测模型 | `backend/app/core/models/evaluation.py` | EvaluationCase / EvaluationResult |
| 评测合约 | `backend/app/core/evaluation/contracts.py` | 指标定义、安全优先级、统一输出 |
| 评测数据 | `backend/app/data/evaluation/*.yaml` | 39 个 mock/simulated 评测 case |
| 前端控制台 | `frontend/src/features/mission/` | 可视化任务规划、风险、异常和复盘 |

### 3.2 多 Agent 能力映射

当前版本使用确定性 orchestrator 和模块化组件实现 Agent 能力雏形：

| Agent 能力 | 当前实现映射 |
| --- | --- |
| 任务理解 | `MissionTask` + mock scenario task fields |
| 环境感知 | `EnvironmentState` |
| 空域合规 | `AirspaceConstraint` + hard rules |
| 设备状态 | `DroneState` + battery/link/payload constraints |
| 任务规划 | `mission_planner.py` |
| 风险推演 | `RiskItem` + hard rule risks + evaluation cases |
| 异常处置 | `incident_replanner.py` |
| 报告复盘 | `mission_reviewer.py` |
| 能力量化 | evaluation dataset + metric contracts |

注意写法：

- 当前不是多进程/多模型 Agent 框架。
- 当前是“模块化 Agent 能力实现”。
- 后续可替换为更复杂的 Agent workflow，但不作为初赛必要条件。

## 4. 核心实现一：任务规划编排

### 4.1 技术主张

SkyOps Agent 不只是接收自然语言后生成文本，而是将任务需求、环境状态、空域约束、无人机状态和显式安全规则统一进入任务规划上下文，输出结构化任务方案、风险列表和可解释说明。

### 4.2 建议引用代码

文件：

`backend/app/core/orchestration/mission_planner.py`

建议引用函数：

```python
def build_mission_planning_result(
    scenario: dict[str, Any],
    raw_user_input: str,
) -> MissionPlanningResult:
    mission_task_data = scenario["mission_task"] | {"raw_user_input": raw_user_input}
    environment_state = EnvironmentState.model_validate(scenario["environment_state"])
    airspace_constraint = AirspaceConstraint.model_validate(scenario["airspace_constraint"])
    drone_state = DroneState.model_validate(scenario["drone_state"])
    scenario_risks = [RiskItem.model_validate(risk) for risk in scenario["risks"]]
    rule_evaluation = evaluate_hard_constraints(
        environment_state=environment_state,
        airspace_constraint=airspace_constraint,
        drone_state=drone_state,
    )
    human_explanation = Explanation.model_validate(scenario["human_explanation"])
    human_explanation.facts.append(
        f"Hard constraint evaluation passed: {str(rule_evaluation.passed).lower()}."
    )
    human_explanation.inferences.extend(check.reason for check in rule_evaluation.checks)

    return MissionPlanningResult(
        mission_task=MissionTask.model_validate(mission_task_data),
        environment_state=environment_state,
        airspace_constraint=airspace_constraint,
        drone_state=drone_state,
        risks=[*scenario_risks, *rule_evaluation.risks],
        mission_plan=MissionPlan.model_validate(scenario["mission_plan"]),
        human_explanation=human_explanation,
    )
```

### 4.3 工程意义

这段代码证明：

- 系统有明确的任务级编排入口。
- 任务规划依赖结构化约束，而不是自由文本猜测。
- 硬约束评估结果会进入风险列表和解释链路。
- 输出是可被前端、测试和评测系统复用的结构化对象。

## 5. 核心实现二：显式硬约束规则引擎

### 5.1 技术主张

低空作业安全不能藏在 prompt 里。SkyOps Agent 将风速、电量、GPS、图传、人流、空域等硬安全条件实现为显式、可配置、可测试的规则。

### 5.2 建议引用代码

文件：

`backend/app/core/rules/engine.py`

建议引用函数：

```python
def evaluate_hard_constraints(
    environment_state: EnvironmentState,
    airspace_constraint: AirspaceConstraint,
    drone_state: DroneState,
    config: SafetyRuleConfig | None = None,
) -> RuleEvaluationResult:
    active_config = config or load_safety_rule_config()
    checks = [
        evaluate_wind(environment_state, active_config),
        evaluate_battery(drone_state, active_config),
        evaluate_gps(environment_state, active_config),
        evaluate_video_latency(drone_state, active_config),
        evaluate_crowd(environment_state, active_config),
        evaluate_airspace(airspace_constraint, active_config),
    ]

    return RuleEvaluationResult(
        passed=all(check.passed for check in checks),
        checks=checks,
    )
```

### 5.3 工程意义

这段代码证明：

- 硬约束以确定性规则执行。
- 任一硬安全检查失败都会影响总体通过结果。
- 风险产生过程可解释，并可被复盘和评测引用。
- 后续即使接入 LLM，也不能绕过这层规则。

## 6. 核心实现三：异常重规划

### 6.1 技术主张

SkyOps Agent 的任务级自治不是“一次性生成方案”，而是在异常发生时主动选择暂停、返航、降级、补飞或人工接管等保守策略。

### 6.2 建议引用代码

文件：

`backend/app/core/orchestration/incident_replanner.py`

建议引用 `wind_speed_spike` 分支：

```python
case "wind_speed_spike":
    return ReplanDecision(
        incident_id=incident_event.id,
        decision="pause_and_return_to_standby",
        actions=[
            "pause current facade scan",
            "return to launch or standby point",
            "preserve collected imagery and telemetry",
            "generate makeup flight for unfinished facade segments",
            "resume only after wind speed returns below threshold",
        ],
        affected_segments=affected_segments,
        makeup_flight_required=True,
        human_takeover_required=severity_requires_takeover,
        reason=(
            "Observed wind condition exceeds the mission safety threshold, so coverage is "
            "deprioritized in favor of aircraft stability and pedestrian safety."
        ),
        alternatives_considered=[
            "rejected: continue with reduced speed",
            "rejected: switch to closer facade route",
            "rejected: wait in hover near target area",
        ],
    )
```

### 6.3 工程意义

这段代码证明：

- Agent 能在异常事件下主动重规划。
- 风险升高时覆盖率让位于安全。
- 系统会保留已采集数据并生成补飞计划。
- 被拒绝的替代方案被记录，支持可解释和可复盘。

## 7. 核心实现四：闭环复盘与补飞

### 7.1 技术主张

低空作业任务完成后，系统需要生成复盘结果、风险触发记录、未覆盖区域、补飞建议和下次优化建议。

### 7.2 待引用代码

文件：

`backend/app/core/orchestration/mission_reviewer.py`

最终方案中应选择 1 段代码展示：

- 如何计算任务完成度。
- 如何收集 incident events。
- 如何生成补飞建议。
- 如何输出下次优化建议。

### 7.3 工程意义

这部分应强调：

- SkyOps Agent 形成任务闭环。
- 异常不是只被处理一次，而会进入复盘和下次优化。
- 复盘结果为企业/园区低空作业运营提供持续改进依据。

## 8. 核心实现五：评测数据集与量化指标

### 8.1 技术主张

项目必须可测试、可量化，而不是只讲概念。SkyOps Agent 的评测对象不是无人机硬件或 CV 缺陷识别，而是 Agent 在复杂约束下的任务决策能力。

### 8.2 当前已完成

已完成：

- `EvaluationCase` / `EvaluationResult` 数据模型。
- evaluation dataset loader。
- 39 个 mock/simulated evaluation cases。
- Phase 3 指标合约与安全优先级。
- 评测数据集 guardrail 测试。
- Hard Constraint Pass Rate scorer。
- Risk Recall scorer。
- Incident Response Score scorer。
- Explainability Score scorer。
- Plan Efficiency scorer。
- Evaluation runner。
- Evaluation report JSON。
- Evaluation regression tests。
- 前端 Evaluation Summary Panel。

初赛技术方案应强调：

- 评测对象是任务级自治决策能力，不是无人机硬件能力或 CV 缺陷识别准确率。
- 评测数据来自本地 mock/simulated dataset，不依赖真实天气、地图、空域、无人机、GPS、图传或人群接口。
- 硬约束是 blocking safety gate，方案效率不能抵消安全失败。
- failed cases 和 failure reasons 会进入 report，支持复盘和改进。

### 8.3 建议引用代码一：评测合约

文件：

`backend/app/core/evaluation/contracts.py`

建议引用：

```python
class EvaluationMetricContract(BaseModel):
    metric: EvaluationMetricName
    display_name: str
    description: str
    scoring_focus: str
    priority_order: int = Field(ge=1)
    role: EvaluationMetricRole
    required_output_fields: tuple[str, ...] = REQUIRED_METRIC_OUTPUT_FIELDS
    blocks_overall_pass: bool = False
    can_be_offset_by_plan_efficiency: bool = False

    @model_validator(mode="after")
    def require_safety_gate_to_block_without_efficiency_offset(
        self,
    ) -> "EvaluationMetricContract":
        if self.role != EvaluationMetricRole.BLOCKING_SAFETY_GATE:
            return self

        if not self.blocks_overall_pass:
            raise ValueError("Blocking safety gates must block the overall result.")
        if self.can_be_offset_by_plan_efficiency:
            raise ValueError("Blocking safety gates cannot be offset by plan efficiency.")

        return self
```

说明重点：

- 每个评分器共享同一输出结构。
- 硬约束是 blocking safety gate。
- 方案效率不能抵消安全失败。

### 8.4 建议引用代码二：评测数据 guardrail

文件：

`backend/tests/test_evaluation_loader.py`

建议引用：

```python
def test_phase_3_evaluation_dataset_has_task_autonomy_guardrails() -> None:
    fixtures = load_all_evaluation_case_fixtures()
    cases = [fixture.evaluation_case for fixture in fixtures]
    case_ids = [case.case_id for case in cases]

    assert PHASE_3_MIN_CASE_COUNT <= len(cases) <= PHASE_3_MAX_CASE_COUNT
    assert len(case_ids) == len(set(case_ids))
    assert PHASE_3_REQUIRED_OPERATION_CATEGORIES <= {case.scenario_type for case in cases}

    for fixture in fixtures:
        case = fixture.evaluation_case

        assert_core_case_fields(case)
        assert_baseline_fixture(fixture)
        assert_not_cv_detection_case(case)
        assert_expected_actions_exclude(case, UNSAFE_EXPECTED_ACTION_PHRASES)
```

说明重点：

- 评测集本身也有方向守门。
- case 必须覆盖低空作业场景。
- 禁止滑向 CV 缺陷识别。
- 禁止危险动作进入期望输出。

### 8.5 建议引用代码三：评测 runner

文件：

`backend/app/core/evaluation/runner.py`

建议引用：

```python
def run_evaluation_case_fixture(fixture: EvaluationCaseFixture) -> EvaluationResult:
    planning_result = build_mission_planning_result(
        scenario=_build_runner_scenario(fixture),
        raw_user_input=fixture.evaluation_case.raw_user_input,
    )
    replan_decisions = [
        build_replan_decision(
            incident_event=incident_event,
            mission_plan=planning_result.mission_plan,
        )
        for incident_event in fixture.evaluation_case.incident_events
    ]
    mission_review = build_mission_review(
        mission_plan=planning_result.mission_plan,
        incident_events=fixture.evaluation_case.incident_events,
        replan_decisions=replan_decisions,
    )
    result = score_evaluation_case(
        evaluation_case=fixture.evaluation_case,
        mission_plan=planning_result.mission_plan,
        risks=planning_result.risks,
        human_explanation=planning_result.human_explanation,
        replan_decisions=replan_decisions,
        mission_review=mission_review,
    )
    return result.model_copy(update={"generated_at": DETERMINISTIC_EVALUATION_GENERATED_AT})
```

说明重点：

- 每个 case 会经过任务规划、异常重规划、任务复盘和评分。
- runner 使用固定 timestamp，保证回归结果可复现。
- 评测链路复用现有任务决策模块，而不是另写一套孤立测试逻辑。

### 8.6 建议引用代码四：评测 report JSON

文件：

`backend/app/core/evaluation/report.py`

建议引用：

```python
def build_evaluation_report(
    *,
    results: Sequence[EvaluationResult],
    cases: Sequence[EvaluationCase] | Mapping[str, EvaluationCase] | None = None,
) -> dict[str, Any]:
    case_results = [
        _brief_case_result(result=result, evaluation_case=case_lookup.get(result.case_id))
        for result in sorted_results
    ]
    failed_cases = [
        {
            "case_id": case_result["case_id"],
            "case_name": case_result["case_name"],
            "category": case_result["category"],
            "failure_reasons": case_result["failure_reasons"],
        }
        for case_result in case_results
        if not case_result["passed"]
    ]

    return {
        "report_type": REPORT_TYPE,
        "data_origin": DATA_ORIGIN,
        "uses_real_api": False,
        "case_count": case_count,
        "passed_count": passed_count,
        "failed_count": case_count - passed_count,
        "hard_constraint_pass_rate": _average_metric(case_results, "hard_constraint_pass_rate"),
        "risk_recall_avg": _average_metric(case_results, "risk_recall"),
        "incident_response_avg": _average_metric(case_results, "incident_response_score"),
        "explainability_avg": _average_metric(case_results, "explainability_score"),
        "case_results": case_results,
        "failed_cases": failed_cases,
    }
```

说明重点：

- report 明确标记 `mock/simulated` 与 `uses_real_api: False`。
- report 同时面向前端展示、技术方案数据表和后续回归分析。
- 失败用例不被隐藏，而是作为系统改进依据。

## 9. Phase 4-lite：LLM 接口边界

### 9.1 技术方案口径

当前技术方案应明确写成：

```text
SkyOps Agent 已预留 LLM adapter contract，并使用 MockLLMProvider 验证任务解析、约束补齐、解释生成和复盘摘要等辅助能力。初赛 Demo 不接入真实 LLM API；低空作业中的硬安全判断仍由显式规则、合规约束、评测系统和人工复核共同约束。
```

不要写成：

```text
系统已接入真实大模型并由大模型自动决定是否飞行。
```

核心安全声明：

```text
LLM can suggest, but cannot approve flight.
```

### 9.2 三层智能边界

Phase 4-lite 用于说明 SkyOps Agent 具备未来接入真实 LLM 的清晰边界，而不是把安全责任交给 LLM。

建议最终方案使用三层结构说明：

| 层级 | 职责 | 当前实现 | 安全边界 |
| --- | --- | --- | --- |
| Deterministic Safety Layer | 风速、电量、GPS、图传、人流、空域等硬约束判断 | `backend/app/core/rules/engine.py`、evaluation scoring | 阻断不安全或不合规方案，不能被 LLM 覆盖 |
| Agent Reasoning Layer | 任务理解、多源约束推理、任务规划、异常重规划、闭环复盘 | `mission_planner.py`、`incident_replanner.py`、`mission_reviewer.py`、evaluation runner | 生成结构化方案、风险、补飞与复盘，接受规则和评测约束 |
| LLM Assistance Layer | 自然语言解析、主动澄清、解释生成、复盘摘要润色 | `LLMProvider` contract、`MockLLMProvider` | 只输出 draft / suggestion / explanation，不批准飞行 |

这三层关系的表达重点：

- LLM 增强交互和解释，不替代安全规则。
- 规则与评测约束安全决策，不依赖 LLM 自由文本。
- 人工安全责任人和法规审批不能被系统绕过。

### 9.3 当前已实现证据

已完成：

- `backend/app/integrations/llm/contracts.py`
  - `LLMProvider` adapter contract。
  - `TaskUnderstandingDraft`、`ConstraintQuestionDraft`、`ExplanationDraft`、`ReviewNarrativeDraft`。
  - `LLMUsagePolicy`，禁止 LLM 批准飞行、覆盖硬约束、绕过人工复核或修改安全阈值。
  - `LLMFailureMode`，覆盖超时、无效 JSON、安全边界冲突、缺少字段和 provider 不可用。
- `backend/app/integrations/llm/mock_provider.py`
  - `MockLLMProvider`，用于初赛 Demo 和测试展示 LLM 接口已预留但不调用真实模型。
  - 所有输出均标记 `source_type=mock`、`provider=mock`、`deterministic=true`。
- `docs/llm-safety-boundary.md`
  - 明确 “LLM can suggest, but cannot approve flight.”。
- `backend/tests/test_llm_contracts.py`
  - 覆盖基础安全边界、输出标记和 provider protocol。
- `backend/tests/test_mock_llm_provider.py`
  - 覆盖 mock provider 稳定输出、缺失字段、解释草稿和复盘摘要草稿。
- `backend/tests/test_llm_adapter_contract_regression.py`
  - 覆盖 LLM 输出不能覆盖硬约束、无效输出触发 fallback、人机复核和敏感配置不泄漏。

### 9.4 为什么初赛 Demo 不接真实 LLM

初赛阶段选择 `MockLLMProvider`，不是因为系统没有 LLM 扩展能力，而是因为低空作业场景需要优先证明安全边界和可复现性。

建议最终方案写成：

```text
初赛 Demo 使用 MockLLMProvider，是为了保证演示结果可复现、避免 API key 和网络依赖，并防止评委误解为系统将飞行许可、禁飞区、风速中止、电量返航、人流安全等硬安全判断交给不稳定的自由文本输出。
```

具体原因：

- 保证演示可复现：同一输入得到稳定结构化草稿。
- 避免外部依赖：不要求网络、API key 或真实 provider 可用。
- 避免安全误解：LLM 只做辅助表达，硬安全判断仍由显式规则和评测系统控制。
- 方便后续替换：真实 LLM provider 只需遵守同一 adapter contract。

### 9.5 LLM 能做什么

- 从自然语言中生成任务理解草稿。
- 主动建议补齐关键约束，例如作业边界、时间窗口、是否允许拆分补飞、是否启用保守航线。
- 将确定性规则和任务方案转换为用户可理解的解释草稿。
- 将复盘结果整理为更自然的总结文本。
- 改善人机交互体验，使用户像对专业低空调度员说话，而不是填写复杂工业表单。

### 9.6 LLM 不能做什么

- 不能批准飞行。
- 不能绕过禁飞区或审批要求。
- 不能覆盖风速、电量、GPS、图传、人流、空域等硬约束规则。
- 不能压低安全阈值来提高覆盖率或效率。
- 不能替代人工安全责任人或法规审批。
- 不能在信息不足时给出冒险执行建议。

### 9.7 未来真实 LLM 接入方式

后续可新增真实 provider，例如 OpenAI、通义、智谱或本地模型 provider，但必须满足：

- 实现同一 `LLMProvider` adapter contract。
- 输出仍为 `draft`、`suggestion` 或 `explanation`。
- 所有输出必须经过确定性规则校验。
- 安全边界冲突必须触发 fallback 和人工复核。
- 不保存或提交 API key。
- 不把 LLM 放入硬安全规则执行链路。

最终技术方案可强调：

```text
SkyOps Agent 的 Agent 能力不是依赖一个大模型直接给结论，而是由确定性安全层、任务推理层和 LLM 辅助层共同组成。LLM 负责更自然的理解与表达，安全与合规由显式规则、评测系统和人工复核约束。
```

## 10. 初赛技术方案中的界面证据

### 10.1 写作口径

当前不单独维护 Demo 叙事脚本。初赛技术方案中只需要把前端界面作为“工程证据”使用，证明系统已经具备可操作的任务级自治工作台。

界面证据建议按功能面板组织：

```text
1. 任务方案：时间窗口、起降点、航线策略、安全阈值、中止条件。
2. 风险解释：风速、GPS、人流、空域、电量、图传等风险依据。
3. 异常重规划：暂停、返航/待命、保留数据、补飞、人工复核。
4. 任务复盘：完成度、未覆盖区域、风险记录、补飞建议、下次优化建议。
5. 评测摘要：硬约束通过率、风险召回、异常响应、可解释性和 failed cases。
```

### 10.2 截图建议

最终方案建议放 3-5 张图：

- Mission Operations Console 总览图。
- 任务方案面板。
- 风险解释 / 风险图表。
- 异常重规划面板。
- 复盘与补飞建议面板。
- Evaluation Summary Panel。

截图应避免：

- 只展示 landing page。
- 长篇说明文字太多。
- 让页面看起来像传统巡检缺陷报告工具。

### 10.3 前端证据写法

技术方案中建议把截图和工程能力绑定，而不是把截图写成演示流程：

| 截图 | 证明内容 |
| --- | --- |
| Mission Operations Console 总览 | 系统不是聊天机器人，而是任务运营工作台 |
| 任务方案面板 | 输出结构化时间窗口、航线策略、安全阈值和中止条件 |
| 风险面板 | 多源约束和风险推演可解释 |
| 异常重规划面板 | 异常发生后能给出保守处置和补飞建议 |
| Evaluation Summary Panel | Agent 决策能力可量化、可回归、可复盘 |

## 11. 安全与合规边界

必须明确：

- SkyOps Agent 是低空作业任务决策辅助系统，不是规避监管工具。
- 不承诺绕过审批。
- 不替代政府监管、UTM 平台或人工安全责任人。
- 当前版本使用 mock/simulated 数据，不控制真实无人机起飞。
- 当数据不足或风险不确定时，系统应建议人工复核、暂停执行或启用保守方案。

建议放一句醒目的边界声明：

```text
当任务安全与覆盖效率发生冲突时，SkyOps Agent 始终优先安全与合规。
```

## 12. 当前测试与质量证据

### 12.1 当前可写入方案的测试证据

已具备：

- 后端 pytest 测试。
- Ruff lint。
- evaluation loader tests。
- evaluation contract tests。
- evaluation scoring tests。
- evaluation runner tests。
- evaluation report tests。
- evaluation regression tests。
- hard constraint rule tests。
- mission plan contract tests。
- incident replanner tests。
- mission reviewer tests。
- LLM contract tests。
- MockLLMProvider tests。
- LLM adapter contract regression tests。

如果最终提交前测试结果稳定，可以写：

```text
当前后端测试覆盖任务规划、硬约束、异常重规划、复盘、评测数据集、评测评分器、评测报告和 LLM adapter 安全边界等核心模块。
```

注意：

- 不要写虚假的覆盖率百分比，除非实际生成 coverage report。
- 可以写测试数量，但最终方案前应以最新 `uv run pytest` 输出为准。

### 12.2 最终提交前需要补充的测试材料

- 最新 `uv run pytest` 输出。
- 最新 `npm run build` 输出。
- Evaluation report JSON 摘要。
- 评测指标结果表。
- 1-2 个失败 case 的 failure reasons 示例。

## 13. 后续路线

### 13.1 初赛前

当前核心工程能力已经完成，初赛前优先做材料收口：

1. 把本 outline 扩写成最终技术方案。
2. 补充最新测试命令输出和评测 report 摘要。
3. 补充前端界面截图，作为工程实现证据。
4. 精简文案，确保不把产品写成缺陷识别工具或真实飞控系统。
5. 明确 mock/simulated 数据、MockLLMProvider 和安全合规边界。

### 13.2 初赛后

可扩展：

- 真实天气 API adapter。
- 地图/OSM adapter。
- UTM/空域平台 adapter。
- DJI Pilot / 机库系统 adapter。
- 任务历史与评测历史存储。
- 更大规模低空作业评测集。

## 14. 最终技术方案待补清单

Phase 3 材料整理：

- [x] 评分器代码片段候选。
- [x] Evaluation runner 代码片段候选。
- [x] Evaluation report JSON 结构说明。
- [ ] 最新测试结果。
- [ ] 评测指标结果表。
- [ ] 失败 case failure reasons 示例。

Phase 4-lite 材料整理：

- [x] LLM adapter contract 代码片段。
- [x] LLM 安全边界文档。
- [x] MockLLMProvider 代码片段。
- [x] LLM 安全边界测试代码片段。
- [x] “为什么初赛不接真实 LLM”说明。
- [x] “LLM can suggest, but cannot approve flight.” 安全声明。

前端界面证据：

- [ ] 前端总览截图。
- [ ] 风险面板截图。
- [ ] 异常重规划截图。
- [ ] 复盘报告截图。
- [ ] 评测摘要面板截图。

## 15. 建议最终方案标题

可选标题：

```text
SkyOps Agent：面向低空作业的任务级自治与风险推演智能体
```

副标题：

```text
从“能飞”走向“会运营”的深圳低空经济任务决策层
```

## 16. 关键代码索引

| 能力 | 文件 | 最终方案用途 |
| --- | --- | --- |
| 任务规划编排 | `backend/app/core/orchestration/mission_planner.py` | 证明任务、环境、空域、设备和硬约束进入同一规划链路 |
| 硬约束规则 | `backend/app/core/rules/engine.py` | 证明安全判断是显式规则，不依赖 LLM 自由文本 |
| 异常重规划 | `backend/app/core/orchestration/incident_replanner.py` | 证明异常时能暂停、返航、补飞、人工复核 |
| 任务复盘 | `backend/app/core/orchestration/mission_reviewer.py` | 证明任务完成后有闭环复盘 |
| 评测数据模型 | `backend/app/core/models/evaluation.py` | 证明评测对象结构化 |
| 评测合约 | `backend/app/core/evaluation/contracts.py` | 证明指标口径和安全优先级已工程化 |
| 评测数据集 | `backend/app/data/evaluation/*.yaml` | 证明已有多场景 mock/simulated 评测集 |
| 评测 loader | `backend/app/data/evaluation/loader.py` | 证明评测数据可稳定加载和校验 |
| 评测 guardrail | `backend/tests/test_evaluation_loader.py` | 证明测试约束项目方向和数据质量 |
| 前端控制台 | `frontend/src/features/mission/` | 证明 Demo 可视化体验已实现 |
