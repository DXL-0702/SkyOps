<p align="center">
  <img src="./frontend/src/public/skyops_readme_header_1.png" alt="SkyOps Agent" width="100%" />
</p>

<h1 align="center">SkyOps Agent</h1>

<p align="center">
  <strong>Task-level autonomy and risk simulation for low-altitude operations</strong>
</p>

<p align="center">
  From "can fly" to "can operate": safer, explainable, and reviewable drone missions for Shenzhen's low-altitude economy.
</p>

<p align="center">
  <a href="./README.zh-CN.md">中文文档</a>
  ·
  <a href="#overview">Overview</a>
  ·
  <a href="#implemented-capabilities">Capabilities</a>
  ·
  <a href="#evaluation-system">Evaluation</a>
  ·
  <a href="#safety-boundary">Safety</a>
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

## Overview

**SkyOps Agent** is a low-altitude mission autonomy and risk simulation agent for Shenzhen's low-altitude economy.

It is not a drone defect detection system, a crack recognition tool, a photovoltaic hotspot detector, or a low-level flight controller. Its product identity is the **task-level autonomy layer** between operational demand and execution systems.

| It does not primarily answer | It answers |
| --- | --- |
| Can the drone physically fly? | Should this mission fly under current constraints? |
| Is there a defect in an image? | What time window, launch point, route strategy, and mission split are safest? |
| Can a drone follow a flight-control command? | What should happen when wind, GPS, battery, airspace, data-link, or crowd risk changes? |
| Can a report be generated after inspection? | How can the mission become explainable, reviewable, and continuously optimized? |

The first scenario is **autonomous mission planning and risk simulation for a high-rise building facade inspection in Shenzhen**. Inspection is only the first demo domain. The same task-autonomy layer can extend to photovoltaic inspection, construction site safety checks, campus security patrols, emergency response, fire safety patrols, low-altitude mapping, urban governance, and logistics missions.

## Product Positioning

SkyOps Agent sits in the middle of a three-layer low-altitude operation stack:

```text
City-level regulation / airspace management / UTM
                 |
SkyOps Agent: task autonomy and risk simulation
                 |
Drones / docks / flight control / payloads / inspection platforms
```

It does not replace government airspace platforms, UTM systems, DJI flight controllers, or human safety responsibility. It turns mission intent into a structured, conservative, explainable operation plan.

## Implemented Capabilities

| Capability | Current implementation |
| --- | --- |
| Task planning | Deterministic mission orchestration over task, environment, airspace, drone state, risks, and explanations. |
| Hard safety rules | Explicit checks for wind, battery margin, GPS confidence, video latency, crowd level, and airspace flyability. |
| Risk reasoning | Rule-generated risks and scenario risks are preserved as structured `RiskItem` objects with evidence and mitigation. |
| Incident replanning | Handles wind spikes, GPS drops, video latency, low battery, crowd gathering, temporary restrictions, and unknown incidents. |
| Mission review | Produces completion rate, data quality score, risk trigger log, uncovered areas, makeup flight plan, human checklist, and next optimizations. |
| Mission console | React + Vite + Tailwind operations console for planning, risk review, incident injection, replanning, review, language toggle, and theme toggle. |
| Evaluation system | 39 mock/simulated evaluation cases, metric contracts, scoring functions, deterministic runner, report JSON, and frontend summary panel. |
| LLM boundary | Phase 4-lite LLM adapter contract and deterministic `MockLLMProvider`; no real LLM API is called. |

## Architecture

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

| Module | Path | Purpose |
| --- | --- | --- |
| Mission API | `backend/app/api/routes/mission.py` | Mission planning, incident replanning, and mission review endpoints. |
| Mission planning | `backend/app/core/orchestration/mission_planner.py` | Combines task, environment, airspace, drone state, and hard rules. |
| Safety rules | `backend/app/core/rules/engine.py` | Deterministic safety and compliance checks. |
| Incident replanning | `backend/app/core/orchestration/incident_replanner.py` | Converts runtime incidents into conservative actions. |
| Mission review | `backend/app/core/orchestration/mission_reviewer.py` | Builds review, uncovered areas, makeup flight plan, and future improvements. |
| Evaluation | `backend/app/core/evaluation/` | Metric contracts, scorers, runner, report JSON, and regression coverage. |
| Mock data | `backend/app/data/` | Scenarios and evaluation fixtures using mock/simulated data. |
| LLM adapter | `backend/app/integrations/llm/` | LLM provider contract, safety policy, and MockLLMProvider. |
| Frontend | `frontend/src/features/mission/` | Mission operations UI. |
| Evaluation UI | `frontend/src/features/evaluation/` | Evaluation summary and failed-case display. |

## Evaluation System

SkyOps Agent is designed to be measurable, not just conceptual. The evaluation target is not drone hardware or CV defect recognition. It is the agent's task decision quality under complex constraints.

Current evaluation summary over local mock/simulated cases:

| Field | Current result |
| --- | ---: |
| case_count | 39 |
| passed_count | 28 |
| failed_count | 11 |
| hard_constraint_pass_rate | 0.963 |
| risk_recall_avg | 1.000 |
| incident_response_avg | 0.359 |
| explainability_avg | 0.9882 |

These numbers are not production certification results and do not represent real flight approval. They are reproducible results from the local mock/simulated dataset and are used to expose decision gaps for improvement.

| Metric | Checks |
| --- | --- |
| Hard Constraint Pass Rate | No-fly status, approval gates, wind limits, battery margin, GPS confidence, crowd safety, and route-level hard constraints. |
| Risk Recall | Whether expected risks such as GPS degradation, wind rise, crowd peaks, temporary restrictions, low visibility, and data-link delay are identified. |
| Incident Response Score | Whether injected incidents lead to pause, return, conservative route, data preservation, makeup planning, explanation, and human review. |
| Explainability Score | Whether key decisions include facts, inferences, recommended actions, and human confirmation requirements. |
| Plan Efficiency | Whether coverage, task splits, makeup load, and manual intervention are efficient without offsetting safety failures. |

## LLM Boundary

SkyOps Agent includes a Phase 4-lite LLM interface preview, but it does **not** call any real LLM API in the current version.

The LLM layer is intentionally assistive:

```text
LLM can suggest, but cannot approve flight.
```

| Layer | Responsibility | Boundary |
| --- | --- | --- |
| Deterministic Safety Layer | Wind, battery, GPS, video latency, crowd, and airspace rules. | Blocks unsafe plans and cannot be overridden by LLM output. |
| Agent Reasoning Layer | Planning, risk reasoning, replanning, review, and evaluation. | Produces structured decisions constrained by rules and tests. |
| LLM Assistance Layer | Task parsing drafts, missing-constraint suggestions, explanations, and review wording. | Outputs draft/suggestion/explanation only. |

Future real providers can be added behind the same adapter contract, but they must not approve flight, bypass human review, override hard constraints, change safety thresholds, or hide uncertainty.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Backend | Python 3.11/3.12, FastAPI |
| Data models | Pydantic v2 |
| Testing | pytest |
| Lint | Ruff |
| Configuration | python-dotenv, PyYAML |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Charts | Recharts |
| Data | YAML / JSON mock and simulated datasets |
| Orchestration | Project-owned deterministic orchestrator |

## Getting Started

Install local tools:

```bash
brew install uv python@3.12
```

Install backend dependencies:

```bash
cd backend
uv sync
```

Run the backend API:

```bash
uv run uvicorn app.main:app --reload
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Check the backend health endpoint:

```bash
curl http://127.0.0.1:8000/health
```

Run a mock mission planning request:

```bash
curl -X POST http://127.0.0.1:8000/missions/plan \
  -H "Content-Type: application/json" \
  -d '{
    "raw_user_input": "Inspect a 180-meter office building facade in Nanshan tomorrow morning.",
    "scenario_id": "shenzhen_nanshan_highrise_demo"
  }'
```

Run tests and build:

```bash
cd backend
uv run pytest
uv run ruff check .
```

```bash
cd frontend
npm run build
```

Recent local verification:

```text
Backend pytest: 105 passed
Frontend build: passed
```

## Safety Boundary

SkyOps Agent is a low-altitude mission decision-support system. It is not a regulatory bypass tool, a flight-control system, or a replacement for human safety responsibility.

Current implementation boundaries:

- Uses mock/simulated data.
- Does not connect to real drones, docks, UTM, real airspace systems, real weather APIs, or real crowd data.
- Does not control takeoff, landing, or real flight execution.
- Does not call real LLM APIs.
- Does not approve flight or bypass legal approval.

When information is insufficient or risk is uncertain, the expected behavior is:

```text
Current information is insufficient. Manual review, mission pause, or conservative planning is recommended.
```

## Roadmap

| Stage | Focus |
| --- | --- |
| Completed | Backend simulation loop, explicit safety rules, incident replanning, mission review, frontend operations console, evaluation dataset, evaluation runner/report, LLM adapter boundary. |
| Competition preparation | Polish proposal materials, screenshots, copywriting, and presentation-ready UI evidence. |
| Next expansion | Real weather/map/UTM/drone adapters, task history storage, larger evaluation set, and real LLM provider behind the existing safety contract. |

## License

See [LICENSE](./LICENSE).
