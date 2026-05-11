# SkyOps Agent 开发执行指南

本文件面向 Codex、Claude 等 AI 编程代理和项目成员，用于约束 SkyOps Agent 的日常开发行为。产品介绍、项目定位和对外说明请阅读 `README.md` 与 `README.zh-CN.md`；本文件只保留核心协作原则、技术栈基线、架构边界和具体开发路线。

## 1. 核心协作原则

1. **禁止自主决策**：在项目开发全流程中，不得擅自猜测组长需求、意图或技术选型。任何会影响功能方向、架构、依赖、数据模型、API、CI/CD 或安全规则的改动，都必须先获得组长明确指令。
2. **步骤化沟通与确认**：每一步开发操作应先说明即将执行的内容、影响范围和验证方式，再执行。若组长未明确回复，暂停推进相关高影响任务。
3. **全链路利弊透明化**：涉及新增、修改或删除核心内容时，必须说明收益与潜在风险，包括代码质量、可维护性、兼容性、测试成本和后续迭代影响。
4. **只给最优建议**：基于项目既定目标、技术栈和路线，给出最适合当前阶段的建议。除非组长要求对比，不展开多个分散方案。
5. **遵守 PR 流程**：所有代码都必须通过功能分支和 Pull Request 进入 `main`，并经过组长审查。不要直接 push 到 `main`。

## 2. 项目开发方向

SkyOps Agent 的开发目标是低空作业任务自治与风险推演，而不是传统无人机缺陷识别。

开发时必须坚持：

- 重点做任务级自治决策，不做复杂 CV 缺陷识别。
- 重点做风险推演、任务规划、异常重规划和复盘闭环。
- 允许 Phase 1 使用 mock/simulated data，但必须清楚标注。
- 所有安全规则必须显式、可配置、可测试。
- LLM 不能作为硬安全决策的唯一依据。
- 输出报告必须区分事实输入、模型推理、建议动作和需要人工确认的事项。

任何改动都应回答：

```text
这项改动是否让低空作业任务更安全、更高效、更可解释、更可复盘？
```

如果答案是否定的，或者只是把项目推向传统巡检缺陷识别工具，应停止并重新确认方向。

## 3. 技术栈基线

已确认技术栈如下，未经组长批准不得替换。

后端与 Agent 核心：

- Python 3.11 或 3.12。
- FastAPI。
- Pydantic v2。
- pytest。
- Ruff。
- python-dotenv。
- PyYAML。

前端与 Demo：

- React。
- TypeScript。
- Vite。
- Tailwind CSS。
- lucide-react。
- Recharts。

数据与仿真：

- Phase 1 使用 JSON/YAML 管理 mock 数据、场景、规则和评测用例。
- Phase 2 后可由组长决定是否引入 SQLite 保存任务记录、复盘结果和评测历史。
- mock 数据必须标注 `mock`、`simulated` 或 `demo` 来源。

Agent 编排：

- Phase 1 使用项目内确定性 orchestrator。
- 不得擅自引入 LangChain、LangGraph、Celery、Redis 等复杂编排或任务系统。
- 后续如需引入复杂 Agent 工作流框架，必须由组长评估并执行。

暂不采用：

- 复杂 CV 缺陷识别模型。
- 真实无人机飞控 SDK。
- 真实机库系统接入。
- PostgreSQL、Redis、Celery 等重型服务。
- Next.js、SSR 或复杂全栈框架。
- 真实地图 SDK 作为 Phase 1 阻塞项。

## 4. 推荐目录结构

组长负责创建和调整顶层目录。其他成员和 AI 编程代理不得擅自新增、删除或重排顶层结构。

```text
backend/
  pyproject.toml
  app/
    main.py
    api/
      routes/
      schemas/
    agents/
      task_understanding/
      environment_sensing/
      airspace_compliance/
      drone_status/
      mission_planning/
      risk_simulation/
      incident_response/
      report_review/
    core/
      models/
      rules/
      evaluation/
      orchestration/
      explanation/
    data/
      mock/
      scenarios/
      fixtures/
    integrations/
      llm/
      weather/
      maps/
      drone/
      utm/
      inspection/
  tests/
    unit/
    integration/
    evaluation/

frontend/
  package.json
  vite.config.ts
  tailwind.config.js
  src/
    api/
    components/
    pages/
    features/
      mission/
      risk/
      incident/
      review/
      evaluation/
    styles/

docs/
  api-contract.md
  tech-stack.md
  demo-script.md

.github/
  workflows/
```

## 5. 架构所有权

所有影响项目整体架构的任务由组长完成，其他成员和 AI 编程代理不得擅自执行。

必须由组长负责：

- 技术栈变更。
- 顶层目录结构变更。
- 后端 API 总体设计。
- 公共 Pydantic 模型设计与破坏性字段变更。
- Agent 编排流程和 orchestrator 上下文结构。
- 安全规则体系、配置格式和硬约束阈值。
- 评测指标定义。
- 外部接口 adapter 抽象。
- CI/CD 规则。
- 依赖管理与核心依赖升级。
- 数据存储方案变更。
- 前端信息架构和核心页面结构。

组员或 AI 编程代理可以承担：

- 在既定目录和接口下实现单个 Agent 的局部逻辑。
- 补充 mock 数据。
- 补充测试用例。
- 实现前端局部组件。
- 修复明确 bug。
- 更新非架构性文档。
- 按已定义 schema 增加示例场景。

以下情况必须先让组长确认：

- 新增或删除顶层目录。
- 修改公共 Pydantic 模型字段。
- 修改 API 路由、请求体或响应体。
- 修改 Agent 调用顺序。
- 修改安全规则配置格式或硬约束阈值。
- 新增核心依赖或替换既有依赖。
- 引入数据库、消息队列、缓存、外部 API 或真实无人机相关 SDK。
- 修改 CI/CD、分支保护或仓库协作流程。

## 6. 开发路线原则

后续开发按以下原则推进，避免一开始铺太大、做太散。

1. **Contract first**：先由组长定义数据模型、API 合约、安全规则格式和 orchestrator 输入输出，再分配局部实现。
2. **Thin vertical slice first**：先做通一条最小端到端链路，再扩展更多 Agent、场景和界面细节。
3. **Mock first**：Phase 1 只依赖 mock/simulated data，不接真实无人机、真实地图、真实空域或真实天气 API。
4. **Rules before LLM**：硬约束和安全判断先用显式规则实现，LLM 只做解析、解释和报告润色辅助。
5. **Tests with features**：每个核心功能 PR 必须同时包含测试或可验证样例。
6. **Small PRs**：一个 PR 只解决一个明确问题，避免混合架构、功能、样式、测试和格式化修改。

当前最优执行顺序：

```text
Phase 0 工程骨架
  -> Phase 1.0 数据模型/API/规则合约
  -> Phase 1.1 单场景 mock 数据
  -> Phase 1.2 硬约束规则
  -> Phase 1.3 最小 orchestrator 端到端闭环
  -> Phase 1.4 异常注入与重规划
  -> Phase 1.5 复盘报告
  -> Phase 2 可视化 Demo
  -> Phase 3 评测集
  -> Phase 4 外部接口预留
```

## 7. Phase 0: 项目骨架与协作基线

目标：建立可运行、可测试、可协作的前后端基础工程。

组长负责：

- 创建 monorepo 目录结构：`backend/`、`frontend/`、`docs/`、`.github/`。
- 初始化 FastAPI 后端工程。
- 初始化 React + TypeScript + Vite + Tailwind CSS 前端工程。
- 定义 Python、Node.js、包管理器和运行命令。
- 配置 Ruff、pytest、前端 lint 或 format 基础命令。
- 配置 GitHub Actions 基础 CI。
- 定义后端 API 基础路由风格和错误响应格式。
- 定义初版核心数据模型的位置和命名规范。

组员可负责：

- 按组长给出的命令验证本地环境。
- 补充 README 或 process 文档中的运行步骤。
- 在不改变架构的前提下修正文档错别字或示例命令。

推荐拆分 PR：

1. 初始化后端工程：FastAPI、pyproject、基础健康检查接口。
2. 初始化前端工程：React、TypeScript、Vite、Tailwind CSS。
3. 配置代码质量：Ruff、pytest、前端构建命令。
4. 配置 CI：PR 时运行后端测试、lint 和前端构建。
5. 补充本地运行文档：后端启动、前端启动、测试命令。

验收标准：

- 后端可本地启动。
- 前端可本地启动。
- pytest 可运行。
- Ruff 可运行。
- 前端构建可运行。
- CI 能在 PR 中执行基础检查。

## 8. Phase 1: 仿真 MVP

目标：在 mock 环境中完成任务级自治与风险推演闭环。

组长负责：

- 定义 `MissionTask`、`EnvironmentState`、`AirspaceConstraint`、`DroneState`、`RiskItem`、`MissionPlan`、`IncidentEvent`、`ReplanDecision`、`MissionReview` 等 Pydantic 模型。
- 定义 orchestrator 的上下文对象和调用顺序。
- 定义安全规则配置格式，例如最大风速、最低返航电量、最小 GPS 置信度、最大图传延迟、人流密度阈值。
- 定义后端核心 API 合约。
- 定义 mock 数据目录结构和 fixture 命名规则。

组员可负责：

- 自然语言任务解析的局部实现。
- mock 天气、人流、空域、设备数据。
- 单项安全规则实现。
- 单个 Agent 的局部逻辑。
- 异常事件样例。
- 任务复盘报告局部生成逻辑。
- 单元测试和评测用例。

推荐执行顺序：

1. **合约层**：组长定义核心 Pydantic 模型、API 合约、安全规则配置格式和 orchestrator 上下文。
2. **单场景数据层**：新增深圳南山区高层建筑外立面巡检 mock 场景。
3. **硬约束层**：实现风速、电量、GPS、图传、人流、禁飞区等基础规则。
4. **薄 orchestrator**：先串通任务输入、mock 数据、规则判断、简单计划、解释输出。
5. **Agent 增量实现**：逐步补齐任务理解、环境感知、空域合规、设备状态、任务规划和风险推演。
6. **异常闭环**：加入异常事件、重规划决策、补飞建议和人工接管条件。
7. **复盘闭环**：生成 `MissionReview`、风险记录、未覆盖区域和下次优化建议。

推荐拆分 PR：

1. 后端基础模型：新增核心 Pydantic models。
2. mock 场景：新增深圳南山区高层建筑外立面巡检场景。
3. 安全规则：实现风速、电量、GPS、图传、人流、禁飞区基础检查。
4. 任务理解：实现自然语言任务解析的 mock/LLM adapter 与 schema 校验。
5. 环境与设备 Agent：读取 mock 环境、空域、设备状态并输出结构化结果。
6. 任务规划 Agent：生成推荐时间、起降点、航线策略、任务拆分和中止条件。
7. 风险推演 Agent：生成 what-if 风险树和应急动作。
8. 异常处置 Agent：处理风速升高、GPS 下降、电量不足等事件并输出 `ReplanDecision`。
9. 报告复盘 Agent：生成 `MissionReview` 和自然语言解释。
10. 端到端 API：输入自然语言任务，输出完整 JSON 和解释。

验收标准：

- 能完成 1 个深圳高层建筑外立面巡检端到端流程。
- 能输出结构化 JSON 和自然语言解释。
- 能处理至少 3 类异常事件。
- 能生成补飞计划和复盘报告。
- 能通过基础硬约束测试。

## 9. Phase 2: 可视化 Demo

目标：让任务规划、风险推演和异常重构过程可视化。

组长负责：

- 确定前端页面结构和信息架构。
- 确定 API 调用方式、数据展示结构和关键组件边界。
- 确定视觉风格：低空运营调度台，避免营销页和大表单工业软件感。
- 确定哪些数据展示为 mock/simulated 标识。

组员可负责：

- 地图或简化沙盘界面。
- 风险热力图。
- 起降点和航线展示。
- 多 Agent 协商过程展示。
- 异常重规划过程展示。
- 评测面板展示。

前端开发约束：

- 可先使用固定 mock API response 开发组件，但最终必须接入后端真实接口。
- 不得改变 API response 结构；如确需调整，必须由组长修改 API 合约。
- 页面应是低空运营调度台，不做营销 landing page。
- 第一屏应可直接输入任务、查看方案、注入异常并观察重规划。

推荐拆分 PR：

1. 前端基础布局：任务输入区、状态栏、结果区、右侧风险面板。
2. 任务输入与 API 调用：提交自然语言任务并展示解析结果。
3. 任务方案展示：展示推荐时间、起降点、航线策略、安全阈值。
4. 风险面板：展示风险等级、触发条件、缓解动作和解释。
5. 异常注入控件：按钮触发风速升高、GPS 下降、图传延迟、电量不足、人群聚集等事件。
6. 重规划展示：展示暂停、返航、绕行、补飞、人工接管等动作。
7. 复盘报告展示：展示完成度、数据质量、未覆盖区域、补飞计划和下次优化建议。

验收标准：

- 用户能从界面看到任务输入、约束来源、推荐方案、风险解释和重规划过程。
- mock 数据标识清晰。
- 关键决策可追踪到原因和规则。
- 前端使用 Tailwind CSS 实现样式，不引入其他大型 UI 框架，除非组长批准。
- 界面第一屏就是可操作的任务调度 Demo，不做营销 landing page。

## 10. Phase 3: 评测集与指标

目标：把 Agent 能力变成可量化结果。

组长负责：

- 定义 EvaluationCase 和 EvaluationResult 的最终 schema。
- 定义硬约束通过率、风险召回率、方案效率、异常处置得分和可解释性得分的计算方法。
- 决定每类场景的覆盖比例和基准方案格式。

组员可负责：

- 构建 30-50 个低空作业仿真场景。
- 自动评估硬约束通过率。
- 自动评估风险识别召回率。
- 自动评估异常处置得分。
- 自动评估可解释性。
- 输出整体测试报告。

评测开发约束：

- 评测场景必须可重复运行，不能依赖实时外部接口。
- 每个场景必须包含自然语言任务、环境条件、空域约束、设备状态、异常事件和期望硬约束。
- 自动评分逻辑必须可解释，失败时能指出违反的规则、缺失的风险或不合格的字段。
- 不得为了提高效率分数牺牲硬约束和安全余量。

推荐拆分 PR：

1. 新增 5 个正常任务评测场景。
2. 新增 5 个高风险天气场景。
3. 新增 5 个空域或审批冲突场景。
4. 新增 5 个设备电量或载荷限制场景。
5. 新增 5 个异常事件注入场景。
6. 实现 Hard Constraint Pass Rate 自动计算。
7. 实现 Risk Recall 自动计算。
8. 实现 Incident Response Score 自动计算。
9. 实现 Explainability Score 基础检查。
10. 输出评测报告 JSON 和前端展示数据。

验收标准：

- 每个 EvaluationCase 可重复运行。
- EvaluationResult 可稳定输出。
- 至少覆盖建筑外立面、园区光伏、工地巡查、安防巡逻等多类场景。
- 所有评测失败都能定位到具体规则、模型字段或 Agent 输出。

## 11. Phase 4: 可扩展接口

目标：为真实低空运营系统预留接口，而不破坏仿真测试能力。

组长负责：

- 定义所有外部系统 adapter 接口。
- 决定真实 API 的数据来源、认证方式、错误处理和降级策略。
- 决定 mock adapter 与真实 adapter 的切换方式。
- 审查所有会影响安全决策的数据接入。

组员可负责：

- 在组长已定义的 adapter 接口下实现 mock adapter。
- 在组长已定义的 adapter 接口下实现 placeholder adapter。
- 补充外部接口失败、超时、数据缺失时的降级测试。
- 编写 adapter 使用说明和 mock 数据示例。

推荐拆分 PR：

1. 天气 adapter 抽象和 mock 实现。
2. 地图 adapter 抽象和 mock 实现。
3. 空域 adapter 抽象和 mock 实现。
4. 无人机状态 adapter 抽象和 mock 实现。
5. 巡检结果 adapter 抽象和 mock 实现。
6. 外部接口失败时的降级策略测试。

验收标准：

- 所有外部接口均有 adapter 抽象。
- mock adapter 与真实 adapter 可替换。
- 真实数据来源、时间戳和置信度可追踪。
- 外部接口失败时系统能降级到人工复核或保守方案。

## 12. 单个 PR 完成标准

每个 PR 合并前必须满足：

- 改动范围与任务描述一致。
- 不包含无关格式化、无关重构或无关文件。
- 不修改未经组长批准的架构、公共模型、API 合约、安全规则格式或核心依赖。
- 新增核心逻辑必须有测试或可复现样例。
- mock 数据必须标注来源。
- 关键决策输出必须包含解释字段。
- 本地已运行相关测试、lint 或构建命令。
- PR 描述写清楚修改内容、自测结果、风险点和需要组长重点审查的地方。

## 13. 开发质量要求

- 任务解析、风险评估、规划、异常处置、复盘和评测必须模块化。
- 不要把所有逻辑塞进一个大函数。
- 不要把安全规则只隐藏在 prompt 中。
- 不要让 LLM 的自由文本直接驱动高风险动作。
- 不要为了 Demo 效果牺牲安全边界。
- 不要把 mock 数据伪装成真实数据。
- 所有模拟数据集中管理，方便替换成真实 API。
- 所有关键决策保留 `reason`、`evidence`、`tradeoffs`、`alternatives`、`requires_human_confirmation` 等解释字段。
- 测试用例覆盖正常任务、风险任务、冲突约束任务和异常注入任务。
- 前端样式采用 Tailwind CSS，不引入其他大型 UI 框架，除非组长批准。

## 14. 决策优先级

当需求、体验、效率和安全发生冲突时，按以下优先级决策：

1. 法规合规和公共安全。
2. 人员安全和安全返航能力。
3. 硬约束满足。
4. 可解释和可复盘。
5. 任务覆盖率。
6. 任务效率。
7. 界面表现和演示效果。

风险不确定、关键数据缺失、空域不确定或设备状态不确定时，应建议人工复核、暂停执行或启用保守方案。
