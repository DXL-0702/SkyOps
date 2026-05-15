<p align="center">
  <img src="./frontend/src/public/skyops_readme_header_1.png" alt="SkyOps Agent" width="100%" />
</p>

<h1 align="center">SkyOps Agent</h1>

<p align="center">
  <strong>面向低空作业的任务级自治与风险推演智能体</strong>
</p>

<p align="center">
  从“能飞”走向“会运营”：让深圳低空经济场景中的无人机任务更安全、更可解释、更可复盘。
</p>

<p align="center">
  <a href="./README.md">English</a>
  ·
  <a href="#项目概览">项目概览</a>
  ·
  <a href="#已实现能力">核心能力</a>
  ·
  <a href="#评测体系">评测体系</a>
  ·
  <a href="#安全边界">安全边界</a>
</p>

<p align="center">
  <img alt="Backend" src="https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square" />
  <img alt="Python" src="https://img.shields.io/badge/python-3.11%2F3.12-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img alt="Pydantic" src="https://img.shields.io/badge/models-Pydantic%20v2-E92063?style=flat-square" />
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=111111" />
  <img alt="Styling" src="https://img.shields.io/badge/styling-Tailwind%20CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Evaluation" src="https://img.shields.io/badge/evaluation-39%20mock%20cases-14B8A6?style=flat-square" />
  <img alt="Status" src="https://img.shields.io/badge/status-MVP%20%2B%20evaluation%20ready-0F172A?style=flat-square" />
</p>

---

## 项目概览

**SkyOps Agent** 是面向深圳低空经济场景的低空作业任务自治与风险推演智能体。

它不是无人机缺陷识别系统，不是裂缝识别工具，不是光伏热斑检测工具，也不是无人机底层飞控系统。它的产品本体是作业需求与执行系统之间的**任务级自治决策层**。

| 它不主要回答 | 它回答 |
| --- | --- |
| 无人机会不会飞？ | 当前约束下，这个任务该不该飞？ |
| 图像里有没有缺陷？ | 什么时间窗口、起降点、航线策略和任务拆分方式最安全？ |
| 无人机能否执行底层飞控命令？ | 风速、GPS、电量、空域、图传和人流风险变化时怎么办？ |
| 巡检后能否生成报告？ | 如何形成可解释、可复盘、可持续优化的任务闭环？ |

当前首个场景是：**深圳某高层建筑外立面巡检任务自治与风险推演**。巡检只是第一个 Demo 场景，任务自治能力可以扩展到园区光伏巡检、工地安全巡查、园区安防、应急救援、消防巡查、低空测绘、城市治理和物流配送等低空作业任务。

## 核心定位

SkyOps Agent 位于低空作业体系的中间层：

```text
城市级低空监管 / 空域管理 / UTM 平台
                 |
SkyOps Agent：任务自治与风险推演层
                 |
无人机 / 机库 / 飞控 / 载荷 / 巡检平台
```

它不替代政府低空监管平台、UTM 系统、DJI 等厂商飞控系统或人工安全责任人。它的职责是把任务意图转化为结构化、保守、可解释的低空作业方案。

## 已实现能力

| 能力 | 当前实现 |
| --- | --- |
| 任务规划 | 基于任务、环境、空域、设备、风险和解释字段的确定性编排。 |
| 硬安全规则 | 显式检查风速、电量余量、GPS 置信度、图传延迟、人流等级和空域可飞性。 |
| 风险推理 | 规则风险和场景风险均以结构化 `RiskItem` 保留证据、缓解措施和人工确认要求。 |
| 异常重规划 | 覆盖风速突增、GPS 下降、图传延迟、电量不足、人群聚集、临时空域限制和未知异常。 |
| 任务复盘 | 生成完成度、数据质量评分、风险触发记录、未覆盖区域、补飞计划、人工复核清单和下次优化建议。 |
| 前端控制台 | React + Vite + Tailwind 任务运营台，支持规划、风险、异常注入、重规划、复盘、语言切换和主题切换。 |
| 评测体系 | 39 个 mock/simulated 评测用例、指标合约、评分器、确定性 runner、report JSON 和前端评测摘要面板。 |
| LLM 边界 | Phase 4-lite LLM adapter contract 与确定性 `MockLLMProvider`；当前不调用真实 LLM API。 |

## 架构设计

```text
Frontend Mission Operations Console
        |
FastAPI Mission API
        |
Mission Orchestrator
        |
Rules / Replanner / Reviewer / Evaluation / LLM Adapter
        |
Mock Scenarios + Evaluation Dataset
```

| 模块 | 路径 | 作用 |
| --- | --- | --- |
| Mission API | `backend/app/api/routes/mission.py` | 任务规划、异常重规划和任务复盘接口。 |
| 任务规划 | `backend/app/core/orchestration/mission_planner.py` | 汇总任务、环境、空域、设备和硬约束。 |
| 安全规则 | `backend/app/core/rules/engine.py` | 确定性安全与合规检查。 |
| 异常重规划 | `backend/app/core/orchestration/incident_replanner.py` | 将运行中异常转化为保守动作。 |
| 任务复盘 | `backend/app/core/orchestration/mission_reviewer.py` | 生成复盘、未覆盖区域、补飞计划和后续优化。 |
| 评测系统 | `backend/app/core/evaluation/` | 指标合约、评分器、runner、report JSON 和回归测试。 |
| Mock 数据 | `backend/app/data/` | 场景数据与评测 fixtures，均使用 mock/simulated 数据。 |
| LLM 接口 | `backend/app/integrations/llm/` | LLM provider contract、安全策略和 MockLLMProvider。 |
| 前端控制台 | `frontend/src/features/mission/` | 任务运营可视化界面。 |
| 评测面板 | `frontend/src/features/evaluation/` | 评测摘要和失败用例展示。 |

## 评测体系

SkyOps Agent 必须可测试、可量化，而不是只讲概念。当前评测对象不是无人机硬件，也不是 CV 缺陷识别模型，而是 Agent 在复杂约束下的任务决策能力。

当前本地 mock/simulated 评测摘要：

| 字段 | 当前结果 |
| --- | ---: |
| case_count | 39 |
| passed_count | 28 |
| failed_count | 11 |
| hard_constraint_pass_rate | 0.963 |
| risk_recall_avg | 1.000 |
| incident_response_avg | 0.359 |
| explainability_avg | 0.9882 |

这些数字不是生产认证结果，也不是对真实飞行能力的承诺，而是本地 mock/simulated 评测集下的可复现结果。failed cases 会被保留，用于暴露当前规则、异常响应和基准方案的薄弱点。

| 指标 | 检查内容 |
| --- | --- |
| Hard Constraint Pass Rate / 硬约束通过率 | 禁飞状态、审批门槛、风速、电量余量、GPS 置信度、人流安全和航线级硬约束。 |
| Risk Recall / 风险召回率 | 是否识别 GPS 下降、风速上升、人流高峰、临时限制、低能见度和图传延迟等预期风险。 |
| Incident Response Score / 异常处置得分 | 异常后是否暂停、返航、启用保守航线、保存数据、生成补飞计划、解释原因并要求人工复核。 |
| Explainability Score / 可解释性得分 | 关键决策是否包含事实、推理、建议动作和人工确认事项。 |
| Plan Efficiency / 方案效率 | 在不抵消安全失败的前提下评估覆盖率、拆分次数、补飞负载和人工介入。 |

## LLM 边界

SkyOps Agent 当前包含 Phase 4-lite LLM 接口预览，但**不调用真实 LLM API**。

LLM 层只做辅助：

```text
LLM can suggest, but cannot approve flight.
```

| 层级 | 职责 | 边界 |
| --- | --- | --- |
| Deterministic Safety Layer / 确定性安全层 | 风速、电量、GPS、图传、人流和空域规则。 | 阻断不安全方案，不能被 LLM 覆盖。 |
| Agent Reasoning Layer / 任务推理层 | 任务规划、风险推理、异常重规划、复盘和评测。 | 生成结构化决策，并受规则和测试约束。 |
| LLM Assistance Layer / LLM 辅助层 | 任务解析草稿、缺失约束建议、解释生成和复盘润色。 | 只输出 draft / suggestion / explanation。 |

未来可以在同一 adapter contract 下接入真实 provider，但仍不得批准飞行、绕过人工复核、覆盖硬约束、修改安全阈值或隐藏不确定性。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 后端 | Python 3.11/3.12, FastAPI |
| 数据模型 | Pydantic v2 |
| 测试 | pytest |
| Lint | Ruff |
| 配置 | python-dotenv, PyYAML |
| 前端 | React, TypeScript, Vite |
| 样式 | Tailwind CSS |
| 图标 | lucide-react |
| 图表 | Recharts |
| 数据 | YAML / JSON mock 和 simulated 数据集 |
| 编排 | 项目内确定性 orchestrator |

## 快速开始

安装本地工具：

```bash
brew install uv python@3.12
```

安装后端依赖：

```bash
cd backend
uv sync
```

启动后端 API：

```bash
uv run uvicorn app.main:app --reload
```

启动前端：

```bash
cd frontend
npm install
npm run dev
```

检查后端健康接口：

```bash
curl http://127.0.0.1:8000/health
```

运行一次 mock 任务规划：

```bash
curl -X POST http://127.0.0.1:8000/missions/plan \
  -H "Content-Type: application/json" \
  -d '{
    "raw_user_input": "明天上午巡检南山区一栋180米高办公楼外立面。",
    "scenario_id": "shenzhen_nanshan_highrise_demo"
  }'
```

运行测试和构建：

```bash
cd backend
uv run pytest
uv run ruff check .
```

```bash
cd frontend
npm run build
```

近期本地验证：

```text
Backend pytest: 105 passed
Frontend build: passed
```

## 安全边界

SkyOps Agent 是低空作业任务决策辅助系统，不是规避监管工具、飞控系统或人工安全责任人的替代品。

当前实现边界：

- 使用 mock/simulated 数据。
- 不接入真实无人机、机库、UTM、真实空域系统、真实天气 API 或真实人流数据。
- 不控制真实起飞、降落或航线执行。
- 不调用真实 LLM API。
- 不批准飞行，也不绕过法规审批。

当信息不足或风险不确定时，系统应输出：

```text
当前信息不足，建议人工复核/暂停执行/启用保守方案。
```

## 路线图

| 阶段 | 重点 |
| --- | --- |
| 已完成 | 后端仿真闭环、显式安全规则、异常重规划、任务复盘、前端任务运营台、评测数据集、评测 runner/report、LLM adapter 边界。 |
| 初赛准备 | 打磨技术方案材料、截图、页面文案和可展示的界面证据。 |
| 后续扩展 | 真实天气/地图/UTM/无人机 adapter、任务历史存储、更大评测集，以及在既有安全 contract 下接入真实 LLM provider。 |

## 许可证

见 [LICENSE](./LICENSE)。
