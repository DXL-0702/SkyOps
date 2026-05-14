# SkyOps Agent 初赛技术方案 Outline

> 本文档是初赛技术方案的施工图，不是最终提交版。
>
> 当前版本只基于仓库中已经完成或正在开发的内容组织材料。Phase 3 剩余评分器与 Phase 4-lite LLM 接口边界完成后，应再次更新本 outline，再扩写为最终 PDF 技术方案。

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
- Phase 3 评测数据模型、数据集、loader、指标合约。

待 Phase 3 完成后补充：

- 具体评分器实现。
- Evaluation runner。
- Evaluation report JSON。
- 评测结果汇总截图或表格。

待 Phase 4-lite 完成后补充：

- LLM adapter contract。
- MockLLMProvider。
- LLM 安全边界测试。
- 技术方案中的 LLM 角色说明。

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

待 Phase 3 完成后补充：

- Hard Constraint Pass Rate scorer。
- Risk Recall scorer。
- Incident Response Score scorer。
- Explainability Score scorer。
- Plan Efficiency scorer。
- Evaluation runner。
- Evaluation report JSON。

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

## 9. Phase 4-lite：LLM 接口边界

### 9.1 当前写法

当前技术方案不要写“已接入真实 LLM”。

应写：

```text
当前版本优先完成可验证的任务自治闭环：任务解析、约束建模、硬规则评估、任务规划、异常重规划、复盘报告和评测合约。由于低空作业涉及安全与合规，系统不将 LLM 作为硬安全判断的唯一依据。
```

### 9.2 Phase 4-lite 完成后补充

待完成后补：

- `LLMProvider` 或等价 adapter contract。
- `MockLLMProvider`。
- LLM 输出类型：draft / suggestion / explanation。
- LLM 失败降级策略。
- LLM 安全边界测试。

建议核心表达：

```text
LLM can suggest, but cannot approve flight.
```

### 9.3 LLM 能做什么

- 自然语言任务理解。
- 缺失约束补全建议。
- 风险解释生成。
- 复盘报告润色。
- 人机交互体验增强。

### 9.4 LLM 不能做什么

- 不能绕过禁飞区。
- 不能忽略审批。
- 不能压低电量、风速、GPS、人流安全阈值。
- 不能替代人工安全责任人。
- 不能单独决定任务是否可飞。

## 10. Demo 展示流程

### 10.1 推荐 Demo 主线

建议初赛 Demo 视频或现场演示使用一条主线：

```text
1. 用户输入自然语言任务：
   “明天上午巡检南山区一栋 180 米高办公楼外立面，尽量减少对行人的影响。”
2. 系统生成任务方案：
   时间窗口、起降点、航线策略、安全阈值、中止条件。
3. 系统展示风险解释：
   风速、GPS、人流、空域、电量、图传等。
4. 注入异常事件：
   风速突增或 GPS 置信度下降。
5. 系统自动重规划：
   暂停、返航/待命、保留数据、补飞、人工复核。
6. 生成任务复盘：
   完成度、未覆盖区域、风险记录、补飞建议、下次优化建议。
```

### 10.2 截图建议

最终方案建议放 3-5 张图：

- Mission Operations Console 总览图。
- 任务方案面板。
- 风险解释 / 风险图表。
- 异常重规划面板。
- 复盘与补飞建议面板。

截图应避免：

- 只展示 landing page。
- 长篇说明文字太多。
- 让页面看起来像传统巡检缺陷报告工具。

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
- hard constraint rule tests。
- mission plan contract tests。
- incident replanner tests。
- mission reviewer tests。

如果最终提交前测试结果稳定，可以写：

```text
当前后端测试覆盖任务规划、硬约束、异常重规划、复盘和评测合约等核心模块。
```

注意：

- 不要写虚假的覆盖率百分比，除非实际生成 coverage report。
- 可以写测试数量，但最终方案前应以最新 `uv run pytest` 输出为准。

### 12.2 待 Phase 3 完成后补充

- Evaluation runner 运行结果。
- 每个指标的得分示例。
- 总评测报告 JSON。
- 失败 case 的解释示例。

## 13. 后续路线

### 13.1 初赛前

优先完成：

1. Phase 3 评分器和 runner。
2. Phase 4-lite LLM adapter contract 与 mock provider。
3. Demo 流程收口。
4. 技术方案最终版。
5. Demo 视频或演示说明。

### 13.2 初赛后

可扩展：

- 真实天气 API adapter。
- 地图/OSM adapter。
- UTM/空域平台 adapter。
- DJI Pilot / 机库系统 adapter。
- 任务历史与评测历史存储。
- 更大规模低空作业评测集。

## 14. 最终技术方案待补清单

Phase 3 完成后补：

- [ ] 评分器代码片段。
- [ ] Evaluation runner 代码片段。
- [ ] Evaluation report JSON 示例。
- [ ] 最新测试结果。
- [ ] 评测指标结果表。

Phase 4-lite 完成后补：

- [ ] LLM adapter contract 代码片段。
- [ ] MockLLMProvider 代码片段。
- [ ] LLM 安全边界测试代码片段。
- [ ] “为什么初赛不接真实 LLM”说明。
- [ ] “LLM can suggest, but cannot approve flight.” 安全声明。

Demo 完成后补：

- [ ] 前端总览截图。
- [ ] 风险面板截图。
- [ ] 异常重规划截图。
- [ ] 复盘报告截图。
- [ ] 2-3 分钟 Demo 讲解稿。

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

