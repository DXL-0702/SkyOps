# SkyOps Agent Phase 2 Issues Backlog

本文件用于将 Phase 2 可视化 Demo 的开发任务拆分为可执行 issues，供组长分配给自己和组员。每个 issue 都应保持小范围、可验证、可 code review，并可直接复制到 GitHub Issues。

## 使用规则

- **P0**：阻塞后续开发或影响整体架构，优先由组长完成。
- **P1**：核心 Demo 功能，优先完成。
- **P2**：体验增强或展示增强，不阻塞主链路。
- **Difficulty S**：适合代码基础较弱组员，在明确边界下完成。
- **Difficulty M**：适合有一定前端/TypeScript 基础的成员。
- **Difficulty L**：涉及页面结构、状态流、核心组件边界或产品判断，建议组长完成。
- **Owner Suggestion: Leader**：影响整体架构、页面信息架构、API 调用边界或核心状态流，由组长完成。
- **Owner Suggestion: Member**：局部组件、样式、展示字段、mock 说明、文档和测试，可分配给组员。

Phase 2 所有任务必须遵守：

- 页面是低空作业调度台，不做营销 landing page。
- 第一屏应能输入任务、查看方案、注入异常、查看重规划和复盘摘要。
- mock/simulated 数据必须清晰标注。
- 不修改后端 API contract；如确需修改，必须由组长单独开 issue。
- 不引入大型 UI 框架；样式使用 Tailwind CSS。
- 不引入真实地图、真实无人机、真实空域或真实天气 API。
- 关键决策必须展示原因、触发条件或人工复核要求。

## Phase 2.0 已完成：前端 API Contract 对齐

### Issue P0-L-001: Frontend Mission API Contracts

**Status:** Done

**Priority:** P0

**Difficulty:** M

**Owner Suggestion:** Leader

**Goal:** 对齐 Phase 1 后端接口，封装前端 API client 和 TypeScript 类型。

**Scope:**

- 新增统一 API request helper。
- 定义 mission planning / replan / review response 类型。
- 封装：
  - `createMissionPlan`
  - `createReplanDecision`
  - `createMissionReview`
- 保留 `VITE_API_BASE_URL` 覆盖能力。

**Acceptance Criteria:**

- `npm run build` 通过。
- 前端类型覆盖 `/missions/plan`、`/missions/replan`、`/missions/review`。
- 不修改后端接口。

---

## Phase 2.1 已完成：调度台基础布局

### Issue P0-L-002: Mission Operations Console First Screen

**Status:** Done

**Priority:** P0

**Difficulty:** L

**Owner Suggestion:** Leader

**Goal:** 建立第一版可操作低空作业调度台页面。

**Scope:**

- 顶部状态栏。
- 任务自然语言输入区。
- 异常注入按钮。
- 任务方案摘要。
- 风险面板。
- 异常重规划面板。
- 任务复盘面板。
- Vite dev proxy 配置。

**Acceptance Criteria:**

- 第一屏可以看见主要调度台模块。
- 点击异常按钮可重新调用 replan/review。
- 页面明确显示 mock/simulated 数据状态。
- `npm run build` 通过。

---

## Phase 2.2：组件拆分与视觉系统定调

### Issue P0-L-003: Split Mission Console Into Feature Components

**Status:** Done

**Priority:** P0

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-L-002

**Goal:** 将当前较大的 `App.tsx` 拆分为清晰组件，建立 Phase 2 后续开发边界。

**Scope:**

- 新增目录：
  - `frontend/src/features/mission/`
  - `frontend/src/features/mission/components/`
- 拆分组件：
  - `MissionConsole.tsx`
  - `MissionInputPanel.tsx`
  - `MissionPlanPanel.tsx`
  - `RiskPanel.tsx`
  - `IncidentReplanPanel.tsx`
  - `MissionReviewPanel.tsx`
  - `StatusStrip.tsx`
- 拆分共享 UI：
  - `PanelTitle.tsx`
  - `Metric.tsx`
  - `ProgressMetric.tsx`
  - `ActionList.tsx`
  - `RiskBadge.tsx`
  - `PanelFallback.tsx`

**Out of Scope:**

- 不改变 UI 行为。
- 不改变 API 调用逻辑。
- 不做大规模视觉重设计。

**Acceptance Criteria:**

- `App.tsx` 只负责渲染 `MissionConsole`。
- 每个面板组件职责清晰。
- `npm run build` 通过。
- 没有改变现有调度台功能。

---

### Issue P0-L-004: Define Phase 2 Visual Direction And UI Tokens

**Status:** Done

**Priority:** P0

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-L-003

**Goal:** 明确 Phase 2 Demo 的视觉方向和基础 UI tokens，避免组员各自写出不一致样式。

**Scope:**

- 明确整体风格：
  - 低空运营调度台。
  - 专业、克制、可读。
  - 保留深色基底，但避免过重“科幻 HUD”。
- 定义颜色使用：
  - neutral/zinc 作为背景。
  - teal 表示正常/可执行。
  - amber 表示警告/需要关注。
  - red 表示高风险/禁止/人工接管。
- 定义组件基础样式：
  - panel
  - button
  - badge
  - metric card
  - list item
  - progress bar
- 在代码中形成简单可复用 className 常量或组件 props。

**Out of Scope:**

- 不引入设计系统库。
- 不引入 CSS-in-JS。
- 不引入大型 UI 框架。

**Acceptance Criteria:**

- 主要面板视觉风格统一。
- 风险等级颜色一致。
- mock/simulated 标识样式统一。
- `npm run build` 通过。

**Implementation Notes:**

- Phase 2 UI 定调为：专业低空运营调度台为主体，选择性引入城市低空指挥中心的空间态势感。
- 已新增 `frontend/src/features/mission/uiTokens.ts`，集中管理 operational tokens、risk semantic tokens 和 command-layer tokens。
- 后续局部组件、沙盘、航线、风险区域、异常重规划展示应优先复用这些 tokens，不要各自临时定义颜色体系。

---

### Issue P1-M-005: Improve Loading And Error States

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 优化后端未启动、接口失败、任务运行中等状态，让 Demo 不显得“坏掉”。

**Scope:**

- 改进 backend offline 显示。
- 改进 mission cycle loading 状态。
- 改进 mission cycle failed 状态。
- 显示用户可执行动作：
  - 启动后端。
  - 检查 `127.0.0.1:8000`。
  - 重新运行任务。
- 不显示技术堆栈错误给普通用户。

**Acceptance Criteria:**

- 后端未启动时页面仍然美观、可读。
- 错误信息不会撑破布局。
- `npm run build` 通过。

---

### Issue P1-S-006: Standardize Mock Data Badges

**Priority:** P1

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 所有 mock/simulated 数据展示都带明确标识，符合项目安全边界。

**Scope:**

- 增加 `DataSourceBadge` 组件。
- 在以下区域展示数据来源：
  - mission task
  - environment state
  - airspace constraint
  - drone state
  - incident event
  - review result
- badge 文案可使用：
  - `MOCK`
  - `SIMULATED`
  - `REAL`，但 Phase 2 不应出现真实数据。

**Acceptance Criteria:**

- 页面中所有核心数据区域均能看到数据来源。
- mock 数据不会被误认为真实数据。
- `npm run build` 通过。

---

## Phase 2.3：任务规划展示细化

### Issue P1-M-007: Mission Plan Detail Panel

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 将任务方案从摘要升级为可解释的规划详情。

**Scope:**

- 展示：
  - 作业对象。
  - 作业区域。
  - 作业目标。
  - 推荐时间窗口。
  - 起降点。
  - 航线策略。
  - 飞行分段。
  - 预计覆盖率。
  - 预计时长。
- 起降点需要展示：
  - name
  - description
  - safety_notes

**Acceptance Criteria:**

- 用户能从面板理解任务为什么这样规划。
- 长文本不会溢出。
- `npm run build` 通过。

---

### Issue P1-M-008: Environment And Drone State Panel

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 展示环境状态和设备状态，让用户看到规划依据。

**Scope:**

- 环境状态：
  - weather_summary
  - wind_speed_mps
  - visibility_level
  - crowd_level
  - gps_quality
  - gps_confidence
  - data_confidence
- 设备状态：
  - drone_id
  - model
  - battery_percent
  - estimated_endurance_minutes
  - return_to_home_battery_threshold
  - payloads
  - link_quality
  - video_latency_ms
  - available_for_mission

**Acceptance Criteria:**

- 环境和设备状态可扫描。
- 关键风险指标有颜色或图标提示。
- `npm run build` 通过。

---

### Issue P1-M-009: Safety Thresholds And Abort Conditions Panel

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 单独展示安全阈值和中止条件，强化“可解释安全决策”。

**Scope:**

- 展示 safety_thresholds：
  - max_wind_speed_mps
  - min_battery_percent
  - min_gps_confidence
  - max_video_latency_ms
- 展示 abort_conditions。
- 每个阈值显示简短解释。

**Acceptance Criteria:**

- 用户能明确看到任务中止条件。
- 阈值展示和风险颜色一致。
- `npm run build` 通过。

---

## Phase 2.4：风险与解释面板

### Issue P1-M-010: Risk Stack Filtering And Grouping

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 优化风险面板，让风险可按等级和类别快速扫描。

**Scope:**

- 按 risk_level 分组或排序：
  - critical
  - high
  - medium
  - low
- 展示：
  - category
  - description
  - trigger_condition
  - mitigation
  - evidence
  - requires_human_confirmation
- 增加风险等级 filter 控件。

**Acceptance Criteria:**

- 高风险项优先显示。
- 人工确认项清晰标注。
- filter 不破坏布局。
- `npm run build` 通过。

---

### Issue P1-M-011: Human Explanation Panel

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 将后端 `human_explanation` 展示为“事实输入 / 模型推理 / 建议动作 / 人工确认”四块。

**Scope:**

- 展示：
  - facts
  - inferences
  - recommended_actions
  - human_confirmation_required
- 区分四类信息的视觉层级。
- 强调这不是自动飞行许可。

**Acceptance Criteria:**

- 用户能区分事实、推理、建议和人工确认。
- 列表为空时有稳定占位。
- `npm run build` 通过。

---

### Issue P2-S-012: Risk Evidence Display Polish

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P1-M-010

**Goal:** 美化 risk evidence 展示，避免长列表显得杂乱。

**Scope:**

- evidence 最多默认展示 2 条。
- 超过 2 条时显示 “+N more”。
- 可用简单展开/收起。

**Acceptance Criteria:**

- 长 evidence 不撑破卡片。
- 展开/收起逻辑简单稳定。
- `npm run build` 通过。

---

## Phase 2.5：异常注入与重规划展示

### Issue P1-L-013: Incident Control Panel Interaction Flow

**Priority:** P1

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P0-L-003

**Goal:** 设计并实现更清晰的异常注入交互流程。

**Scope:**

- 将异常按钮从普通按钮升级为事件控制面板。
- 每个异常显示：
  - event_type
  - observed_value
  - threshold
  - severity
  - description
- 点击异常后：
  - 更新 active incident。
  - 调用 replan。
  - 调用 review。
  - 保持当前 mission plan。
- 支持 “Run All Demo Flow”。

**Acceptance Criteria:**

- 用户能清楚知道当前注入了什么异常。
- 异常切换后重规划和复盘同步更新。
- `npm run build` 通过。

---

### Issue P1-M-014: Replan Decision Detail Panel

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-L-013

**Goal:** 细化重规划决策展示，让用户理解为什么暂停、返航、绕行或人工接管。

**Scope:**

- 展示：
  - decision
  - actions
  - affected_segments
  - makeup_flight_required
  - human_takeover_required
  - reason
  - alternatives_considered
- rejected alternatives 必须明确显示为 rejected。

**Acceptance Criteria:**

- 决策原因清楚可读。
- rejected alternatives 不会被误解为推荐方案。
- `npm run build` 通过。

---

### Issue P2-M-015: Replan Timeline Visualization

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-M-014

**Goal:** 使用简单时间线展示异常发生后的处置顺序。

**Scope:**

- 将 replan actions 渲染为纵向 timeline。
- 每一步包含图标和动作名称。
- 不引入动画库。

**Acceptance Criteria:**

- 时间线在桌面和移动端均可读。
- actions 为空时有占位。
- `npm run build` 通过。

---

## Phase 2.6：复盘报告展示

### Issue P1-M-016: Mission Review Report Panel

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 将复盘结果整理为可展示的报告面板。

**Scope:**

- 展示：
  - completion_rate
  - data_quality_score
  - risk_trigger_log
  - uncovered_areas
  - makeup_flight_plan
  - human_review_checklist
  - next_mission_optimizations
- 完成度和数据质量使用进度条或仪表式展示。

**Acceptance Criteria:**

- 用户能看出任务完成情况和补飞建议。
- 风险触发记录清晰。
- `npm run build` 通过。

---

### Issue P2-S-017: Review Empty State And No-Incident State

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P1-M-016

**Goal:** 优化无异常复盘或字段为空时的展示。

**Scope:**

- 当 `incident_events` 为空时展示稳定文案。
- 当 `uncovered_areas` 为空时展示 “No uncovered area”。
- 当 `makeup_flight_plan` 为空时展示 “No makeup flight required”。

**Acceptance Criteria:**

- 空状态不显得像 bug。
- 文案不误导用户以为任务真实完成。
- `npm run build` 通过。

---

## Phase 2.7：演示流与响应式优化

### Issue P1-L-018: Demo Flow Polish For Competition Presentation

**Priority:** P1

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P1-L-013, P1-M-016

**Goal:** 整理比赛演示用的主流程，让评委能在 1-2 分钟内看懂产品本体。

**Scope:**

- 明确演示步骤：
  1. 输入自然语言任务。
  2. 生成任务方案。
  3. 查看风险解释。
  4. 注入异常。
  5. 查看重规划。
  6. 查看复盘与补飞计划。
- 增加当前流程步骤指示。
- 强调产品定位：任务级自治与风险推演，不是缺陷识别工具。

**Acceptance Criteria:**

- 首屏即可完成主演示。
- 文案简洁，不像说明书。
- `npm run build` 通过。

---

### Issue P1-M-019: Responsive Layout Pass

**Priority:** P1

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P0-L-003

**Goal:** 检查并优化桌面、笔记本、平板和手机宽度下的布局。

**Scope:**

- 检查宽度：
  - 1440px
  - 1280px
  - 1024px
  - 768px
  - 390px
- 修复：
  - 文本溢出。
  - 按钮挤压。
  - 卡片高度跳动。
  - 风险标签换行难看。
- 保持首屏尽量可扫描。

**Acceptance Criteria:**

- 移动端无明显横向滚动。
- 按钮文字不溢出。
- 长 decision 文本可换行。
- `npm run build` 通过。

---

### Issue P2-M-020: Accessibility And Keyboard Interaction Pass

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-M-019

**Goal:** 做基础可访问性检查，避免 Demo 页面难以键盘操作。

**Scope:**

- 所有按钮可通过键盘 focus。
- focus 状态可见。
- icon-only 元素必须有文本或 aria-label。
- 色彩不能作为唯一风险提示。
- 表单输入有可理解 label。

**Acceptance Criteria:**

- 键盘 Tab 顺序基本合理。
- 没有只有图标无语义的关键按钮。
- `npm run build` 通过。

---

## Phase 2.8：可选增强，不阻塞主 Demo

### Issue P2-L-021: Simplified Sandbox Map Panel

**Priority:** P2

**Difficulty:** L

**Owner Suggestion:** Leader

**Depends On:** P1-M-007, P1-L-013

**Goal:** 用简化沙盘展示建筑、起降点、航线、风险区，不接真实地图 SDK。

**Scope:**

- 使用 HTML/CSS/SVG 或简单 div 布局绘制 mock 沙盘。
- 展示：
  - building facade
  - launch point
  - route segments
  - restricted zone
  - crowd zone
  - GPS weak zone
- 明确标注 simulated sandbox。

**Out of Scope:**

- 不接 Mapbox、AMap、高德、OSM 等真实地图 SDK。
- 不做真实坐标计算。

**Acceptance Criteria:**

- 沙盘能辅助理解路线和风险。
- 页面明确显示 simulated/mock。
- `npm run build` 通过。

---

### Issue P2-M-022: Risk Mini Charts With Recharts

**Priority:** P2

**Difficulty:** M

**Owner Suggestion:** Member

**Depends On:** P1-M-010

**Goal:** 使用已有 Recharts 依赖展示简单风险统计，不新增依赖。

**Scope:**

- 风险等级数量柱状图或环形图。
- 复盘完成度/数据质量简图。
- 图表必须有文字 fallback。

**Acceptance Criteria:**

- 图表不喧宾夺主。
- 数据来自当前 API response。
- `npm run build` 通过。

---

### Issue P2-S-023: Copywriting Polish

**Priority:** P2

**Difficulty:** S

**Owner Suggestion:** Member

**Depends On:** P1-L-018

**Goal:** 统一页面英文文案，使其专业、简洁、可演示。

**Scope:**

- 统一面板标题。
- 统一按钮文案。
- 统一 empty/loading/error 文案。
- 避免长篇功能说明。

**Acceptance Criteria:**

- 文案不超过必要长度。
- 不出现“无人机缺陷识别系统”类错误定位。
- `npm run build` 通过。

---

## 建议分配顺序

### 组长优先完成

1. P0-L-003: Split Mission Console Into Feature Components
2. P0-L-004: Define Phase 2 Visual Direction And UI Tokens
3. P1-L-013: Incident Control Panel Interaction Flow
4. P1-L-018: Demo Flow Polish For Competition Presentation
5. P2-L-021: Simplified Sandbox Map Panel

### 组员 A 可优先完成

1. P1-S-006: Standardize Mock Data Badges
2. P1-M-007: Mission Plan Detail Panel
3. P1-M-009: Safety Thresholds And Abort Conditions Panel
4. P2-S-017: Review Empty State And No-Incident State
5. P2-S-023: Copywriting Polish

### 组员 B 可优先完成

1. P1-M-005: Improve Loading And Error States
2. P1-M-008: Environment And Drone State Panel
3. P1-M-010: Risk Stack Filtering And Grouping
4. P1-M-014: Replan Decision Detail Panel
5. P1-M-019: Responsive Layout Pass

### 暂不建议分配给组员的任务

- 涉及页面整体结构调整的任务。
- 涉及 API contract 修改的任务。
- 涉及后端模型或 orchestrator 调整的任务。
- 涉及 Phase 3 评测指标定义的任务。

## 每个 Issue 的 PR 要求

每个 issue 对应 PR 必须包含：

- 改动范围说明。
- 截图或界面说明。
- 自测命令：

```bash
cd frontend
npm run build
```

- 如果涉及后端联调，说明后端启动命令：

```bash
cd backend
uv run uvicorn app.main:app --reload
```

- 明确说明是否使用 mock/simulated data。
- 不包含无关格式化或无关重构。
