# SkyOps Agent Active Issues Backlog

本文件用于维护 SkyOps Agent 当前阶段的可执行开发任务，供组长分配给自己和组员。历史 Phase 2 任务已完成归档；当前只保留必要的 Phase 2 尾项，并正式进入 Phase 3：评测集与指标开发。初赛前追加一个轻量 Phase 4-lite，用于定义 LLM 接口和 Agent 安全边界，不接入真实 LLM。

## 使用规则

- **P0**：阻塞后续开发、影响评测架构或数据契约，优先由组长完成。
- **P1**：Phase 3 核心能力，优先完成。
- **P2**：体验增强、展示增强或非阻塞补充。
- **Difficulty S**：边界清晰，适合组员在明确说明下完成。
- **Difficulty M**：需要一定 Python/TypeScript/测试经验，适合拆给组员并由组长 review。
- **Difficulty L**：涉及 schema、评测口径、执行链路、报告结构或页面信息架构，建议组长完成。
- **Owner Suggestion: Leader**：影响整体架构、数据模型、评测指标、API/CLI 形态或前端信息架构，由组长完成。
- **Owner Suggestion: Member**：局部场景数据、测试用例、展示字段、文档和样式，可分配给组员。

所有 issue 必须遵守：

- SkyOps Agent 是低空作业任务自治与风险推演系统，不是缺陷识别工具。
- mock/simulated 数据必须清晰标注，不伪装成真实数据。
- Phase 3 评测不得依赖实时外部 API、真实无人机、真实地图、真实空域或真实天气。
- 评测逻辑必须可重复运行、可解释、可定位失败原因。
- 硬约束和安全余量优先级高于方案效率。
- Phase 4-lite 只定义 LLM adapter contract、mock provider 和安全边界，不接入真实 LLM API。
- LLM 输出只能作为任务解析、约束补齐、解释生成和报告润色草稿，不能覆盖硬约束、安全规则或合规判断。
- 不得修改后端 API contract、公共模型字段、orchestrator 调用顺序或安全规则格式，除非该 issue 明确标注由组长负责。
- 组员 PR 不应混入无关格式化、架构重排或依赖新增。

## Phase 2 收口状态

Phase 2 可视化 Demo 除以下保留项外，均视为已完成并归档：

- `P1-L-018: Demo Flow Polish For Competition Presentation`
- `P2-S-023: Copywriting Polish`

已完成归档范围包括：

- 前端 API contract 对齐。
- Mission Operations Console 基础界面。
- 组件拆分与 UI tokens。
- 任务方案、环境设备、安全阈值、风险栈、解释、异常重规划、复盘报告。
- Header 中英文切换。
- 响应式布局与基础可访问性。
- 简化沙盘地图面板。
- Recharts 风险小图表。

后续不再围绕已完成 Phase 2 任务开新 PR，除非是明确 bugfix 或组长指定的展示优化。

---

## Phase 2 保留项

### Issue P1-L-018: Demo Flow Polish For Competition Presentation

**Status:** Retained

**Priority:** P1

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** Phase 2 completed console

**Goal:** 保留并维护比赛演示主流程，确保评委能在 1-2 分钟内看懂产品本体。

**Scope:**

- 演示流程必须保持清晰：
  1. 输入自然语言任务。
  2. 生成任务方案。
  3. 查看风险解释。
  4. 注入异常。
  5. 查看重规划。
  6. 查看复盘与补飞计划。
- 继续强调产品定位：任务级自治与风险推演，不是缺陷识别工具。
- 如 Phase 3 增加评测入口，不得破坏当前主 Demo 首屏理解成本。

**Out of Scope:**

- 不重新设计整套前端信息架构。
- 不引入真实地图或真实无人机接口。
- 不把 Demo 改成营销 landing page。

**Acceptance Criteria:**

- 主 Demo 流程仍可从界面顺畅演示。
- mock/simulated 数据标识仍然清楚。
- `npm run build` 通过。

---

### Issue P2-S-023: Copywriting Polish

**Status:** Backlog

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P1-L-018

**Goal:** 统一页面中英文文案，使其专业、简洁、可演示。

**Scope:**

- 统一面板标题。
- 统一按钮文案。
- 统一 empty/loading/error 文案。
- 检查中文模式下是否仍有未映射英文 UI。
- 避免长篇功能说明。
- 避免“无人机缺陷识别系统”等错误产品定位。

**Out of Scope:**

- 不修改后端 mock 数据原文。
- 不引入 i18n 框架或新依赖。
- 不改变页面结构。

**Acceptance Criteria:**

- 文案不超过必要长度。
- 中文界面中关键 UI 不出现裸露英文。
- 英文界面表达专业、克制、面向低空作业运营。
- `npm run build` 通过。

---

# Phase 3: Evaluation Dataset And Metrics

Phase 3 的目标是把 SkyOps Agent 的任务级自治能力变成可量化、可回归、可复盘的评测结果。测试对象不是无人机硬件，也不是 CV 缺陷识别，而是 Agent 在复杂约束下的任务决策能力。

Phase 3 推荐最终形成：

- 可重复运行的 `EvaluationCase` 数据集。
- 可稳定输出的 `EvaluationResult`。
- 硬约束通过率、风险识别召回率、方案效率、异常处置得分、可解释性得分。
- JSON 测试报告。
- 可选前端评测摘要面板。

## Phase 3.0：评测契约与数据基线

### Issue P0-L-024: Define EvaluationCase And EvaluationResult Schema

**Status:** Done

**Priority:** P0

**Difficulty:** L

**Owner Suggestion:** Leader

**Goal:** 定义 Phase 3 评测集的核心数据结构，作为后续所有评测数据、评分器和报告的契约。

**Scope:**

- 定义 `EvaluationCase` schema，至少包含：
  - `case_id`
  - `title`
  - `scenario_type`
  - `raw_user_input`
  - `environment_state`
  - `airspace_constraint`
  - `drone_state`
  - `incident_events`
  - `expected_hard_constraints`
  - `expected_risks`
  - `expected_response_behaviors`
  - `baseline_plan`
  - `tags`
  - `source_type`
- 定义 `EvaluationResult` schema，至少包含：
  - `case_id`
  - `passed`
  - `scores`
  - `hard_constraint_results`
  - `risk_recall_results`
  - `incident_response_results`
  - `explainability_results`
  - `failure_reasons`
  - `generated_at`
- 明确哪些字段是事实输入、哪些是期望答案、哪些是评分输出。
- 明确 JSON/YAML 文件组织方式。

**Out of Scope:**

- 不一次性实现全部评分器。
- 不修改现有 `/missions/plan`、`/missions/replan`、`/missions/review` API contract。
- 不新增数据库。

**Acceptance Criteria:**

- schema 可被 Pydantic v2 校验。
- 至少有 1 个最小 `EvaluationCase` fixture 能通过校验。
- 字段命名与现有 mission models 保持风格一致。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 `backend/app/core/models/evaluation.py`，定义 `EvaluationCase`、`EvaluationResult`、`EvaluationScores`、`MetricScore`、期望硬约束、期望风险、期望异常响应和 baseline plan 等模型。
- `EvaluationCase` 复用现有 `EnvironmentState`、`AirspaceConstraint`、`DroneState`、`IncidentEvent`、`MissionPlan` 等核心模型，不修改现有 mission API contract。
- 已新增最小 smoke fixture：`backend/app/data/evaluation/smoke_highrise_nominal.yaml`，用于验证 Phase 3 评测数据形态。
- 已新增 `backend/tests/test_evaluation_models.py`，覆盖 fixture 校验、Phase 3 禁止 case/result/nested sources 使用 `source_type: real`、`EvaluationResult.generated_at` 时区字段。
- 本 issue 不包含 dataset loader、评分器、runner 或前端展示，这些继续由后续 Phase 3 issue 跟进。

---

### Issue P0-M-025: Create Evaluation Dataset Loader

**Status:** Done

**Priority:** P0

**Difficulty:** M

**Owner Suggestion:** Leader

**Depends On:** P0-L-024

**Goal:** 建立评测数据加载器，让后续 30-50 个场景可以稳定加载、校验和枚举。

**Scope:**

- 在既定目录下加载评测用例文件。
- 支持按 `case_id` 加载单个用例。
- 支持加载全部用例。
- 校验重复 `case_id`。
- 对不存在、格式错误、schema 不匹配给出明确错误。
- 增加 loader 单元测试。

**Out of Scope:**

- 不实现评分逻辑。
- 不接外部数据源。
- 不改变现有 scenario loader 的行为，除非组长确认合并抽象。

**Acceptance Criteria:**

- 可加载 1 个示例 case。
- 未知 case id 返回稳定异常。
- 重复 case id 能被测试捕获。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 `backend/app/data/evaluation/loader.py` 和 `backend/app/data/evaluation/__init__.py`，建立独立 evaluation dataset loader。
- loader 支持加载全部 fixtures、加载全部 `EvaluationCase`、按 `case_id` 加载单个 fixture 或 case。
- 已定义稳定异常：dataset 目录不存在、case id 不存在、重复 case id、YAML 非 mapping、schema 校验失败。
- loader 支持测试传入临时目录，便于后续评测数据 PR 验证重复 id 和坏数据。
- 已新增 `backend/tests/test_evaluation_loader.py`，覆盖默认 smoke case、单 case 加载、未知 id、重复 id、格式错误、schema 错误和缺失目录。
- 本 issue 不包含评分器、runner、报告生成或现有 scenario loader 抽象合并。

---

### Issue P1-S-026: Add Evaluation Smoke Cases

**Status:** Done

**Priority:** P1

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P0-L-024, P0-M-025

**Goal:** 先添加 3-5 个最小 smoke cases，用于验证评测数据结构和 loader 可用。

**Scope:**

- 添加 3-5 个简单评测场景。
- 场景应覆盖：
  - 正常建筑外立面任务。
  - 风速接近阈值任务。
  - 电量接近安全返航阈值任务。
- 每个 case 必须包含自然语言任务、环境、空域、设备、期望硬约束。
- 标注 `mock` 或 `simulated`。

**Out of Scope:**

- 不追求 30-50 个完整场景。
- 不写评分器。

**Acceptance Criteria:**

- 所有 smoke cases 可被 loader 加载。
- 所有 smoke cases 通过 schema 校验。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 3 个建筑外立面 smoke cases，覆盖正常任务、风速接近阈值、电量接近返航阈值。
- 已在 evaluation loader 测试中加入 smoke case 存在性和基础字段校验。
- 数据来源保持 `mock`/`simulated`，不接入真实无人机或真实外部 API。

---

## Phase 3.1：评测场景数据集

### Issue P1-M-027: Add Normal Operation Evaluation Cases

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-S-026

**Goal:** 增加一组正常低风险任务，用作 Agent 基准表现评测。

**Scope:**

- 添加 5 个正常任务评测 case。
- 至少覆盖：
  - 高层建筑外立面巡检。
  - 园区光伏巡检。
  - 工地安全巡查。
  - 园区安防巡逻。
  - 低空测绘或城市治理巡查。
- 每个 case 应包含明确的期望硬约束和期望风险点。

**Acceptance Criteria:**

- 新增 case 均可被 loader 加载。
- case 不依赖真实 API。
- 不出现缺陷识别模型输出作为核心评测目标。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 5 个正常低风险任务 case，覆盖建筑外立面、园区光伏、工地安全、园区安防和城市治理/测绘类任务。
- 每个 case 均包含期望硬约束、期望风险点和 baseline plan。
- 已通过测试守门，确保评测目标保持在任务规划、安全约束和运营决策层。

---

### Issue P1-M-028: Add Weather GPS And Crowd Risk Evaluation Cases

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-S-026

**Goal:** 增加天气、GPS 和人流相关高风险场景，用于评估风险识别和保守决策能力。

**Scope:**

- 添加 5 个风险场景。
- 至少覆盖：
  - 风速超过阈值。
  - 阵风接近阈值。
  - GPS 置信度下降。
  - 建筑峡谷导致导航风险。
  - 人流聚集或低空悬停风险。
- 每个 case 都应配置 `expected_risks`。

**Acceptance Criteria:**

- Agent 应能识别主要风险点。
- case 中硬约束和风险点可被评分器引用。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 5 个天气、GPS 和人流相关高风险 case。
- 覆盖风速超阈值、阵风接近阈值、GPS 置信度下降、建筑峡谷导航风险和人流聚集低空悬停风险。
- 测试已校验这些 case 均包含 `expected_risks` 和安全保守的响应行为。

---

### Issue P1-M-029: Add Airspace And Compliance Evaluation Cases

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-S-026

**Goal:** 增加禁飞区、限飞区、审批和临时管控相关场景，确保合规约束优先。

**Scope:**

- 添加 5 个空域合规场景。
- 至少覆盖：
  - 禁飞区不可飞。
  - 限飞区需要审批。
  - 临时管控区更新。
  - 高度限制与任务目标冲突。
  - 合规信息不足，需要人工复核。
- 每个 case 都要明确 `expected_hard_constraints`。

**Acceptance Criteria:**

- 不允许 case 期望中出现绕过禁飞区、忽略审批等行为。
- 合规风险必须可解释。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 5 个空域合规 case，覆盖禁飞区、限飞审批、临时管控、高度限制冲突和信息不足人工复核。
- 已在测试中加入禁用危险期望动作校验，避免出现绕过禁飞区、默认审批通过或执行过期航线等错误方向。
- case 继续保持 mock/simulated 数据来源，并为后续硬约束评分器提供可引用约束 id。

---

### Issue P1-M-030: Add Drone Battery Payload And Link Evaluation Cases

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-S-026

**Goal:** 增加设备、电量、载荷和图传相关场景，用于评估任务拆分、返航和降级决策。

**Scope:**

- 添加 5 个设备状态场景。
- 至少覆盖：
  - 电量不足。
  - 返航余量不足。
  - 续航无法一次完成任务。
  - 图传延迟过高。
  - 载荷不满足任务要求。
- 每个 case 应包含期望的安全动作，例如拆分任务、返航、补飞或人工接管。

**Acceptance Criteria:**

- 设备约束不得被方案效率覆盖。
- 需要补飞的 case 必须明确未覆盖区域或补飞触发条件。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 5 个设备状态 case，覆盖电量不足、返航余量不足、续航限制、图传延迟和载荷能力不足。
- 需要补飞或任务拆分的 case 已明确未覆盖区域、补飞触发条件或人工确认要求。
- 测试已校验设备安全约束优先于覆盖率和效率目标。

---

### Issue P1-M-031: Add Incident Injection Evaluation Cases

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-S-026

**Goal:** 增加异常事件注入场景，用于评估异常重规划能力。

**Scope:**

- 添加 5 个异常注入 case。
- 至少覆盖：
  - 风速突增。
  - GPS 置信度下降。
  - 图传延迟增加。
  - 电量跌破安全返航阈值。
  - 人群聚集或临时空域限制。
- 每个 case 应包含 `expected_response_behaviors`，例如暂停、返航、绕行、补飞、人工接管。

**Acceptance Criteria:**

- 每个 incident case 都能调用现有 replan 逻辑。
- 期望动作必须安全保守。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 5 个异常注入 case，覆盖风速突增、GPS 置信度下降、图传延迟增加、电量跌破返航阈值和人群聚集。
- 每个 case 都包含 `incident_events` 与 `expected_response_behaviors`，用于后续异常处置评分。
- 测试已校验异常期望动作包含暂停、返航/待命、保留数据、补飞或人工复核等保守动作。

---

### Issue P2-M-032: Add Multi-Domain Expansion Evaluation Cases

**Status:** Done

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-M-027, P1-M-028, P1-M-029, P1-M-030, P1-M-031

**Goal:** 扩展评测集场景覆盖，证明产品不局限于建筑外立面巡检。

**Scope:**

- 新增 10-20 个扩展 case。
- 建议覆盖：
  - 应急救援。
  - 消防巡查。
  - 城市治理。
  - 园区物流配送。
  - 夜间安防巡逻。
  - 台风前工地安全巡查。
- 保持任务级自治视角，不把评测目标写成缺陷识别准确率。

**Acceptance Criteria:**

- 总评测集规模达到 30-50 个 case。
- 至少覆盖 4 类低空作业业务场景。
- 所有 case 可重复运行并通过 schema 校验。

**Implementation Notes:**

- 已新增 10 个扩展业务 case，总评测集规模达到 39 个 case。
- 扩展覆盖应急救援、消防巡查、城市治理、园区物流配送、夜间安防巡逻和台风前工地安全巡查。
- 已新增全局评测集 guardrail 测试，持续校验 30-50 个 case 规模、mock/simulated 来源、baseline plan、业务覆盖和非 CV 缺陷识别方向。

---

## Phase 3.2：评分指标实现

### Issue P0-L-033: Define Evaluation Metric Contracts And Scoring Priority

**Status:** Done

**Priority:** P0

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-L-024

**Goal:** 明确 Phase 3 各项指标的计算口径和安全优先级，避免组员各自实现不一致评分逻辑。

**Scope:**

- 定义总分结构和单项指标字段。
- 明确硬约束优先级：
  - 违反禁飞、审批、风速、电量、人流安全等硬约束时，方案效率不得弥补安全失败。
- 明确每个评分器输出：
  - score
  - passed
  - matched_items
  - missing_items
  - failure_reasons
- 明确指标包括：
  - Hard Constraint Pass Rate
  - Risk Recall
  - Plan Efficiency
  - Incident Response Score
  - Explainability Score

**Out of Scope:**

- 不实现所有评分器。
- 不引入 LLM judge。

**Acceptance Criteria:**

- 指标口径写入代码注释或 docs。
- 后续评分器能共享同一结果结构。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 `backend/app/core/evaluation/contracts.py`，定义 Phase 3 指标合约、共享 scorer 输出字段和评分优先级。
- 已新增 `docs/evaluation-metrics.md`，说明 Hard Constraint Pass Rate、Risk Recall、Plan Efficiency、Incident Response Score 和 Explainability Score 的计算口径。
- 已明确硬约束是 blocking safety gate：禁飞区、审批、风速、电量、GPS、人流安全等硬约束失败时，总体评测失败，方案效率不得抵消安全失败。
- 已明确 Phase 3 不引入 LLM judge，LLM 不能作为硬安全评分依据。
- 已新增 `backend/tests/test_evaluation_contracts.py`，锁住指标覆盖、共享输出字段、安全优先级和禁止效率抵消硬约束失败。
- 本 issue 不实现具体评分器，后续由 P1-M-034 到 P2-M-037 分别实现。

---

### Issue P1-M-034: Implement Hard Constraint Pass Rate

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-033

**Goal:** 自动评估 Agent 方案是否违反硬约束。

**Scope:**

- 检查是否违反：
  - 禁飞区或不可飞空域。
  - 未满足审批要求。
  - 超风速阈值。
  - 电量低于安全返航余量。
  - GPS 置信度低于安全阈值但仍建议近距离自主飞行。
  - 人流高风险区域低空悬停。
- 输出每条硬约束的 pass/fail 和原因。

**Acceptance Criteria:**

- 至少覆盖已有安全规则中的核心硬约束。
- fail 时能指出违反字段和原因。
- 单元测试覆盖 pass 和 fail 场景。
- `uv run pytest` 通过。

---

### Issue P1-M-035: Implement Risk Recall Metric

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-033, P1-M-028

**Goal:** 自动评估 Agent 是否识别出评测 case 中埋设的关键风险点。

**Scope:**

- 从 `EvaluationCase.expected_risks` 读取期望风险。
- 从 mission plan response 的 `risks` 读取实际风险。
- 支持基于风险类别、触发条件、风险等级的匹配。
- 输出：
  - recalled risks
  - missing risks
  - unexpected risks
  - recall score

**Acceptance Criteria:**

- 至少覆盖风速、GPS、人流、空域、电量、图传六类风险。
- missing risk 能清楚指出 case id 和缺失项。
- 单元测试覆盖全召回、部分召回、零召回。
- `uv run pytest` 通过。

---

### Issue P1-M-036: Implement Incident Response Score

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-033, P1-M-031

**Goal:** 自动评估突发事件发生后，Agent 的重规划动作是否符合期望安全行为。

**Scope:**

- 从 `expected_response_behaviors` 读取期望动作。
- 检查 replan decision 是否包含：
  - 暂停任务。
  - 返航或返回待命点。
  - 切换保守航线。
  - 保留已采集数据。
  - 生成补飞计划。
  - 请求人工接管或人工复核。
- 输出动作匹配结果和缺失动作。

**Acceptance Criteria:**

- 至少覆盖 5 类异常事件。
- 对高风险事件，继续原方案应判为失败。
- 单元测试覆盖安全动作匹配与危险动作失败。
- `uv run pytest` 通过。

---

### Issue P2-M-037: Implement Explainability Score

**Status:** Done

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-033

**Goal:** 自动检查关键决策是否具备基本解释字段，避免输出只有结论没有依据。

**Scope:**

- 检查 `human_explanation` 是否区分：
  - fact inputs
  - model inferences
  - recommended actions
  - human confirmation required
- 检查关键决策是否说明：
  - 为什么不建议某个时间飞。
  - 为什么需要拆分任务。
  - 为什么触发返航。
  - 为什么需要补飞。
- 输出缺失解释字段和基础得分。

**Out of Scope:**

- 不使用 LLM judge 判断解释质量。
- 不做语义相似度复杂评分。

**Acceptance Criteria:**

- 空解释或只有结论的输出会被扣分。
- 每个失败项能定位到缺失字段。
- `uv run pytest` 通过。

---

### Issue P2-L-038: Implement Plan Efficiency Metric

**Status:** Done

**Priority:** P2

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-L-033

**Goal:** 在不牺牲安全的前提下，评估任务方案的效率。

**Scope:**

- 与 `baseline_plan` 比较：
  - 预计飞行时间。
  - 任务拆分次数。
  - 覆盖率。
  - 补飞面积或未覆盖区域。
  - 人工介入次数。
  - 安全余量。
- 当硬约束失败时，效率分不得掩盖安全失败。
- 输出效率评分和权衡解释。

**Out of Scope:**

- 不追求复杂路径优化算法。
- 不引入真实地图路线计算。

**Acceptance Criteria:**

- 至少能对已有 mock mission plan 计算基础效率分。
- 能解释“更慢但更安全”的方案为什么可接受。
- `uv run pytest` 通过。

---

## Phase 3.3：评测运行器与报告

### Issue P1-L-039: Implement Evaluation Runner

**Status:** Done

**Priority:** P1

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-M-025, P1-M-034, P1-M-035

**Goal:** 实现可重复运行的评测执行器，把 evaluation cases 跑过现有 mission planning / replanning / review 逻辑。

**Scope:**

- 支持运行单个 case。
- 支持运行全部 cases。
- 调用现有 deterministic orchestrator。
- 组合各评分器输出 `EvaluationResult`。
- 失败时保留 case id、阶段、失败原因。

**Out of Scope:**

- 不接真实外部 API。
- 不修改现有 HTTP API contract。
- 不引入 Celery、Redis 或任务队列。

**Acceptance Criteria:**

- 可在测试中运行 smoke cases。
- 输出稳定 `EvaluationResult`。
- 重复运行结果一致。
- `uv run pytest` 通过。

---

### Issue P1-M-040: Generate Evaluation Report JSON

**Status:** Backlog

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-L-039

**Goal:** 生成整体评测报告 JSON，便于后续前端展示和比赛演示。

**Scope:**

- 汇总所有 case 的结果。
- 输出整体指标：
  - case_count
  - passed_count
  - failed_count
  - hard_constraint_pass_rate
  - risk_recall_avg
  - incident_response_avg
  - explainability_avg
- 输出失败 case 列表和原因。
- 明确报告数据为 mock/simulated evaluation。

**Acceptance Criteria:**

- JSON 结构稳定。
- report 中包含每个 case 的简要结果。
- 单元测试覆盖报告汇总。
- `uv run pytest` 通过。

---

### Issue P2-M-041: Add Evaluation CLI Entry

**Status:** Backlog

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Leader

**Depends On:** P1-L-039, P1-M-040

**Goal:** 提供一个轻量命令入口，方便组长和组员本地运行评测。

**Scope:**

- 支持运行全部评测。
- 支持按 case id 运行。
- 支持输出 JSON 到指定路径。
- 命令示例写入文档。

**Out of Scope:**

- 不引入 Typer/Click 等新依赖，除非组长批准。
- 不做复杂命令行交互。

**Acceptance Criteria:**

- 本地命令可运行。
- 错误 case id 有明确提示。
- `uv run pytest` 通过。

---

### Issue P2-M-042: Add Evaluation Summary Panel

**Status:** Backlog

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Leader

**Depends On:** P1-M-040

**Goal:** 在前端增加轻量评测摘要展示，让 Demo 不只展示单任务，也能展示 Agent 的可量化能力。

**Scope:**

- 展示整体通过率。
- 展示硬约束通过率、风险召回率、异常处置得分、可解释性得分。
- 展示失败 case 简表。
- 明确标注 evaluation report 来自 mock/simulated dataset。

**Out of Scope:**

- 不引入新图表库。
- 不改变主 Mission Console 演示路径。
- 不新增真实后端 API，除非组长单独开 issue。

**Acceptance Criteria:**

- 页面展示不干扰 Phase 2 主演示。
- 指标含义清晰、不过度营销。
- `npm run build` 通过。

---

## Phase 3.4：测试、文档与演示收口

### Issue P1-M-043: Add Evaluation Regression Tests

**Status:** Backlog

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-L-039

**Goal:** 为评测 runner、评分器和数据集增加回归测试，避免后续改动破坏评测可信度。

**Scope:**

- 测试 loader。
- 测试每个评分器。
- 测试 runner 汇总结果。
- 测试典型失败 case 的 failure reasons。
- 确保评测不依赖随机数或实时外部接口。

**Acceptance Criteria:**

- `uv run pytest` 稳定通过。
- 失败 case 能定位原因。
- 测试名称清晰，方便组员理解。

---

### Issue P2-S-044: Document Evaluation Dataset Authoring Guide

**Status:** Backlog

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P0-L-024, P1-S-026

**Goal:** 编写评测用例编写指南，方便组员持续补充场景。

**Scope:**

- 说明 case 字段含义。
- 给出一个正常任务示例。
- 给出一个高风险任务示例。
- 说明 mock/simulated 标注要求。
- 说明不要把缺陷识别准确率作为评测目标。

**Acceptance Criteria:**

- 新组员能按文档补充一个合法 case。
- 文档与实际 schema 字段一致。
- 不出现与 AGENTS.md 冲突的开发建议。

---

### Issue P2-S-045: Update Demo Script With Evaluation Story

**Status:** Backlog

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P1-M-040, P2-M-042

**Goal:** 更新比赛演示脚本，把 Phase 3 评测能力讲清楚。

**Scope:**

- 说明单任务 Demo 展示 Agent 如何决策。
- 说明评测集展示 Agent 能力如何量化。
- 解释硬约束通过率、风险召回率、异常处置得分和可解释性得分。
- 保持文案简洁，不写成技术论文。

**Acceptance Criteria:**

- 演示脚本可在 2-3 分钟内讲完。
- 不承诺真实飞行许可或替代人工安全责任人。
- 保持产品定位：低空作业任务自治与风险推演。

---

# Phase 4-lite: LLM Interface Preview

Phase 4-lite 是初赛前的轻量架构补充，目标是证明 SkyOps Agent 具备接入 LLM 的清晰边界和可扩展路径，但不在初赛 Demo 中接入真实 LLM。

Phase 4-lite 必须坚持：

- 不调用真实 LLM API。
- 不保存或提交 API key。
- 不引入 LangChain、LangGraph、Celery、Redis 等复杂编排框架。
- 不让 LLM 单独决定飞行许可、禁飞区、风速中止、电量返航、人流安全等硬安全规则。
- LLM 输出必须是 draft / suggestion / explanation，不是最终安全结论。
- 真实 LLM 后续可替换 `MockLLMProvider`，但硬约束仍由显式规则和评测系统约束。

## Phase 4-lite.0：LLM 合同与安全边界

### Issue P0-L-046: Define LLM Adapter Contract And Safety Boundary

**Status:** Done

**Priority:** P0

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-L-024, P0-L-033

**Goal:** 定义 LLM 在 SkyOps Agent 中能做什么、不能做什么，以及未来真实 LLM 接入必须遵守的 adapter contract。

**Scope:**

- 定义 `LLMProvider` 或等价 adapter contract。
- 建议能力边界：
  - `parse_task(raw_user_input, context) -> TaskUnderstandingDraft`
  - `suggest_missing_constraints(task, context) -> ConstraintQuestionDraft`
  - `generate_human_explanation(decision_context) -> ExplanationDraft`
  - `summarize_review(review_context) -> ReviewNarrativeDraft`
- 明确所有 LLM 输出必须标记为 draft/suggestion。
- 明确 LLM 不允许：
  - 直接批准飞行。
  - 覆盖禁飞区、审批、风速、电量、人流等硬约束。
  - 在信息不足时给出冒险执行建议。
  - 绕过人工安全负责人或法规审批。
- 明确 LLM 接入后的失败降级策略：
  - 超时。
  - 无效 JSON。
  - 安全边界冲突。
  - 缺少必要字段。
- 在文档中说明为什么初赛 Demo 使用 mock LLM 而不接真实 LLM。

**Out of Scope:**

- 不接真实 OpenAI、通义、智谱或本地模型。
- 不写 prompt 长文案库。
- 不改变现有 mission planning/replan/review API contract。
- 不让 LLM 进入硬安全规则执行链路。

**Acceptance Criteria:**

- LLM adapter contract 清晰、可测试、可替换。
- 安全边界文档明确写出 “LLM can suggest, but cannot approve flight.”
- 后续真实 LLM provider 可在不改 orchestrator 主流程的前提下替换 mock provider。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 `backend/app/integrations/llm/contracts.py`，定义 `LLMProvider` adapter contract、LLM draft models、失败模式和使用安全策略。
- 已新增 `docs/llm-safety-boundary.md`，明确 “LLM can suggest, but cannot approve flight.”。
- 已明确 LLM 输出只能是 `draft`、`suggestion` 或 `explanation`，必须经过确定性规则校验，不是最终安全结论。
- 已通过 `LLMUsagePolicy` 禁止 LLM 批准飞行、覆盖硬约束、绕过人工复核或修改安全阈值。
- 已新增 `backend/tests/test_llm_contracts.py`，覆盖安全边界、输出标记、失败模式和 provider protocol。
- 本 issue 不实现 mock provider，不接真实 LLM，不改变 mission planning/replan/review API contract。

---

### Issue P1-M-047: Implement Mock LLM Provider

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-046

**Goal:** 实现一个确定性的 `MockLLMProvider`，用于 Demo 和测试展示 LLM 接口已预留，但不调用真实模型。

**Scope:**

- 实现 mock provider。
- 返回稳定结构化结果。
- 所有输出标记：
  - `source_type: mock`
  - `provider: mock`
  - `deterministic: true`
- 覆盖至少：
  - 任务解析草稿。
  - 缺失约束提示草稿。
  - 决策解释草稿。
  - 复盘摘要草稿。
- 在输出中明确不包含飞行许可或安全放行结论。

**Out of Scope:**

- 不请求网络。
- 不读取 API key。
- 不新增真实 provider。
- 不把 mock LLM 输出接入硬约束判断。

**Acceptance Criteria:**

- mock provider 输出稳定。
- mock provider 不依赖外部服务。
- 单元测试覆盖正常输出和基本字段完整性。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 `backend/app/integrations/llm/mock_provider.py`，实现确定性的 `MockLLMProvider`。
- mock provider 覆盖 `parse_task`、`suggest_missing_constraints`、`generate_human_explanation` 和 `summarize_review` 四类输出。
- 所有输出均标记 `source_type=mock`、`provider=mock`、`deterministic=true`，并保留 `draft`、`suggestion` 或 `explanation` 边界。
- 输出安全说明明确 mock LLM 不批准飞行，必须经过确定性硬规则和人工复核。
- 已新增 `backend/tests/test_mock_llm_provider.py`，覆盖稳定输出、缺失字段、约束问题、解释草稿和复盘摘要草稿。
- 本 issue 不请求网络、不读取 API key、不新增真实 provider、不接入硬约束判断。

---

### Issue P1-M-048: Add LLM Adapter Contract Tests

**Status:** Done

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-046, P1-M-047

**Goal:** 为 LLM adapter contract 和 mock provider 增加测试，确保未来接真实 LLM 时不会破坏安全边界。

**Scope:**

- 测试 mock provider 输出 schema。
- 测试所有输出均标记为 mock/draft/suggestion。
- 测试 LLM 输出不能覆盖硬约束结果。
- 测试无效 LLM 输出会触发人工复核或降级策略。
- 测试 prompt/response 层不包含真实 API key 或敏感配置。

**Out of Scope:**

- 不测试真实 LLM 质量。
- 不做 LLM judge。
- 不做语义相似度评分。

**Acceptance Criteria:**

- 测试能证明 LLM adapter 是辅助层，不是安全决策唯一依据。
- 安全边界冲突有明确 failure reason。
- `uv run pytest` 通过。

**Implementation Notes:**

- 已新增 `backend/tests/test_llm_adapter_contract_regression.py`，补充 LLM adapter 安全边界回归测试。
- 覆盖 mock provider 四类输出的 schema、`mock` source、draft/suggestion/explanation 边界、非最终安全决策标记和规则校验要求。
- 覆盖硬约束失败时 LLM 解释草稿不能改变 deterministic hard constraint 结果。
- 覆盖危险 LLM 权限、无效最终决策输出、fallback failure reason 和人工复核要求。
- 覆盖 prompt/response 层不泄漏 `OPENAI_API_KEY` 或 `SKYOPS_LLM_API_KEY` 等敏感配置。
- 本 issue 不接真实 LLM、不做 LLM judge、不改变 mission planning/replan/review API contract。

---

### Issue P2-S-049: Document LLM Role In Technical Proposal

**Status:** Backlog

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P0-L-046, P1-M-047

**Goal:** 为初赛技术方案准备 LLM 角色说明，解释为什么当前 Demo 不接真实 LLM，但已经具备 Agent/LLM 扩展能力。

**Scope:**

- 写清楚三层智能架构：
  - Deterministic Safety Layer：显式硬约束、安全规则、合规规则、阈值判断。
  - Agent Reasoning Layer：任务理解、多源约束推理、风险推演、任务规划、异常重规划、闭环复盘。
  - LLM Assistance Layer：自然语言解析、主动澄清、解释生成、复盘报告润色。
- 写清楚初赛 Demo 使用 `MockLLMProvider` 的原因：
  - 保证可复现。
  - 避免 API key 和网络依赖。
  - 避免把安全判断交给不稳定输出。
- 写清楚未来可接入真实 LLM 的位置和限制。
- 写清楚 “LLM 增强交互和解释，规则与评测约束安全决策”。

**Acceptance Criteria:**

- 技术方案文字能让评委理解项目具备 Agent 扩展能力。
- 不夸大真实 LLM 接入状态。
- 不承诺系统可以替代法规审批或人工安全责任人。
- 文案不把 SkyOps Agent 说成传统无人机缺陷识别工具。

---

### Issue P2-S-050: Update Demo Script With LLM Boundary Story

**Status:** Backlog

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P2-S-045, P2-S-049

**Goal:** 更新比赛演示脚本，把 LLM 接口预留和安全边界讲成一句评委能听懂的话。

**Scope:**

- 在 Demo 脚本中补充：
  - 当前演示使用 deterministic rules 和 mock data 保证稳定。
  - LLM adapter 已预留，用于任务解析、约束补齐和解释生成。
  - 硬安全规则不会交给 LLM 单独决定。
  - 未来可替换真实 LLM provider。
- 控制在 20-30 秒讲述长度。

**Acceptance Criteria:**

- 讲述简洁，不像技术论文。
- 不让评委误以为系统已经接入真实 LLM。
- 不让评委误以为 LLM 可以批准飞行。

---

## 建议分配顺序

### 组长优先完成

1. P0-L-024: Define EvaluationCase And EvaluationResult Schema
2. P0-M-025: Create Evaluation Dataset Loader
3. P0-L-033: Define Evaluation Metric Contracts And Scoring Priority
4. P1-L-039: Implement Evaluation Runner
5. P0-L-046: Define LLM Adapter Contract And Safety Boundary
6. P2-L-038: Implement Plan Efficiency Metric
7. P2-M-042: Add Evaluation Summary Panel

### 组员 A 可优先完成

1. P2-S-023: Copywriting Polish
2. P1-S-026: Add Evaluation Smoke Cases
3. P1-M-027: Add Normal Operation Evaluation Cases
4. P1-M-028: Add Weather GPS And Crowd Risk Evaluation Cases
5. P1-M-047: Implement Mock LLM Provider
6. P2-S-044: Document Evaluation Dataset Authoring Guide

### 组员 B 可优先完成

1. P1-M-029: Add Airspace And Compliance Evaluation Cases
2. P1-M-030: Add Drone Battery Payload And Link Evaluation Cases
3. P1-M-031: Add Incident Injection Evaluation Cases
4. P1-M-035: Implement Risk Recall Metric
5. P1-M-036: Implement Incident Response Score
6. P1-M-048: Add LLM Adapter Contract Tests

### 暂不建议分配给组员的任务

- 评测 schema 的最终设计。
- 总分口径、安全优先级和指标权重。
- 评测 runner 的执行链路。
- 前端评测入口的信息架构。
- LLM adapter 的最终安全边界。
- 真实 LLM provider 接入。
- 任何 API contract 或公共 Pydantic 模型破坏性变更。

## 每个 Issue 的 PR 要求

每个 issue 对应 PR 必须包含：

- 改动范围说明。
- 自测命令。
- 若涉及后端：

```bash
cd backend
uv run pytest
uv run ruff check .
```

- 若涉及前端：

```bash
cd frontend
npm run build
```

- 若涉及评测数据，必须说明：
  - 新增 case 数量。
  - 覆盖的低空作业场景。
  - 是否包含异常事件。
  - 使用的是 mock/simulated data。
- 若涉及评分器，必须说明：
  - 评分输入字段。
  - pass/fail 规则。
  - failure reasons 示例。
- 若涉及 LLM adapter，必须说明：
  - 是否调用真实 LLM API。
  - 输出是否为 draft/suggestion。
  - 如何避免覆盖硬约束和安全规则。
  - 失败或信息不足时如何降级到人工复核。
- 不包含无关格式化、无关重构或未批准依赖。

## 建议提交信息格式

commit message 使用英文，建议格式：

```text
feat(evaluation): define evaluation case schema
feat(evaluation): add weather risk evaluation cases
feat(evaluation): implement hard constraint scoring
docs(evaluation): add dataset authoring guide
feat(llm): define mock provider contract
docs(llm): describe agent safety boundary
```
