<p align="center">
  <img src="./skyops_readme_header_1.png" alt="SkyOps Agent" width="100%" />
</p>

<h1 align="center">SkyOps Agent</h1>

<p align="center">
  <strong>Task-level autonomy and risk simulation for low-altitude operations</strong>
</p>

<p align="center">
  From “can fly” to “can operate”: safer, explainable, reviewable drone missions for Shenzhen's low-altitude economy.
</p>

<p align="center">
  <a href="./README.zh-CN.md">中文文档</a>
  ·
  <a href="#overview">Overview</a>
  ·
  <a href="#mvp-scenario">MVP</a>
  ·
  <a href="#roadmap">Roadmap</a>
  ·
  <a href="#safety-and-compliance">Safety</a>
</p>

<p align="center">
  <img alt="Backend" src="https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square" />
  <img alt="Python" src="https://img.shields.io/badge/python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img alt="Pydantic" src="https://img.shields.io/badge/models-Pydantic-E92063?style=flat-square" />
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=111111" />
  <img alt="Styling" src="https://img.shields.io/badge/styling-Tailwind%20CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Status" src="https://img.shields.io/badge/status-planning%20%2F%20scaffold-64748B?style=flat-square" />
</p>

---

## Overview

**SkyOps Agent** is a task-level autonomy and risk simulation agent for low-altitude operations in Shenzhen's emerging low-altitude economy.

It is not a drone defect detection tool, a crack recognition model, a photovoltaic hotspot detector, or a low-level flight controller. SkyOps Agent focuses on the intelligent decision layer between operational demand and execution systems:

| It does not answer | It answers |
| --- | --- |
| Can the drone physically fly? | Should this mission fly under current constraints? |
| Is there a visual defect in an image? | What time window, route, launch point, and mission split are safest? |
| Can a drone follow a low-level flight command? | What should happen when wind, GPS, battery, airspace, or crowd risk changes? |
| Can a report be generated after inspection? | How can the mission become explainable, reviewable, and continuously optimized? |

The first MVP scenario is **autonomous mission planning and risk simulation for a high-rise building facade inspection in Shenzhen**. Inspection is only the first demo scenario; the same autonomy layer can extend to campus security patrols, construction site checks, photovoltaic inspections, emergency response, fire safety patrols, low-altitude mapping, urban governance, and logistics missions.

## Positioning

SkyOps Agent sits in the middle layer of a three-level low-altitude system:

```text
City-level regulation / airspace management / UTM
                 |
SkyOps Agent: task autonomy and risk simulation
                 |
Drones / docks / flight control / payloads / inspection platforms
```

It does not replace government airspace platforms or vendor flight controllers. It provides an intelligent, explainable decision layer that turns a mission request into a safer and more executable operation plan.

## Core Capabilities

| Capability | Meaning |
| --- | --- |
| Active sensing | Infers missing mission constraints instead of waiting for long forms. |
| Multi-source constraint reasoning | Considers weather, wind, lighting, crowd density, airspace, GPS, battery, payload, data link, safety, regulation, and business priority together. |
| Risk simulation | Runs what-if analysis before and during execution. |
| Autonomous planning | Recommends time windows, launch and landing points, route strategy, mission splits, safety thresholds, and abort conditions. |
| Incident replanning | Responds to wind changes, GPS issues, temporary restrictions, data-link delay, low battery, and crowd aggregation. |
| Closed-loop review | Generates mission reviews, risk logs, data quality scores, makeup flight plans, and next-mission improvements. |
| Explainable decisions | Records evidence, tradeoffs, alternatives, and required human confirmations for key decisions. |

## Architecture

| Agent | Responsibility |
| --- | --- |
| Task Understanding Agent | Extracts mission object, area, goals, time requirements, precision needs, risk preference, and special constraints from natural language. |
| Environment Sensing Agent | Integrates weather, wind, rainfall, visibility, lighting, crowd flow, building environment, GPS risk, and reflection risk. |
| Airspace Compliance Agent | Checks no-fly zones, restricted zones, temporary control areas, approval needs, altitude limits, and compliance risk. |
| Drone Status Agent | Evaluates drone availability, battery, payload, camera, thermal capability, zoom, data-link quality, and endurance. |
| Mission Planning Agent | Generates recommended execution time, launch and landing points, route strategy, safety distances, capture spacing, mission splits, backup plans, and abort conditions. |
| Risk Simulation Agent | Builds what-if risk trees and maps trigger conditions to mitigation and replanning actions. |
| Incident Response Agent | Converts runtime incidents into pause, return-to-home, reroute, fallback route, downgrade, makeup flight, or human takeover decisions. |
| Report & Review Agent | Produces mission plans, risk reports, incident logs, makeup flight plans, data quality scores, and next-step recommendations. |

## Tech Stack

SkyOps Agent uses a lightweight full-stack monorepo focused on simulation, explainability, and testability.

| Layer | Stack |
| --- | --- |
| Backend | Python 3.11/3.12, FastAPI |
| Data models | Pydantic v2 |
| Testing | pytest |
| Lint / format | Ruff |
| Configuration | python-dotenv, PyYAML |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Charts | Recharts |
| Simulation data | JSON / YAML mock datasets |
| Agent orchestration | Project-owned deterministic orchestrator in Phase 1 |

LLMs may be used for natural-language task understanding, missing-information suggestions, explanation generation, and report wording. Hard safety constraints must be implemented as explicit, testable rules and must not rely on free-form LLM output alone.

## Planned Structure

```text
backend/
  app/
    main.py
    api/
    agents/
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
  tests/

frontend/
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

docs/
.github/
```

## Getting Started

The project is currently in Phase 0. The backend baseline uses Python 3.12 and `uv`.

Install the required local tools:

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

Check the health endpoint:

```bash
curl http://127.0.0.1:8000/health
```

Run tests and lint:

```bash
uv run pytest
uv run ruff check .
```

## MVP Scenario

> Autonomous mission planning and risk simulation for a high-rise building facade inspection in Shenzhen.

```text
Natural-language task
  -> Mission understanding
  -> Mock weather / crowd / airspace / drone state
  -> Time window + launch point + route strategy + safety thresholds
  -> Incident injection
  -> Replanning decision
  -> Mission review + makeup flight plan
```

Example task:

> Inspect a 180-meter office building facade in Nanshan tomorrow morning, focusing on curtain-wall cracks and detachment risk while minimizing impact on pedestrians.

Example incidents:

- Wind speed rises.
- GPS confidence drops.
- Video transmission delay increases.
- Temporary restricted airspace is updated.
- Battery becomes insufficient.
- Crowds gather near the target area.

## Roadmap

| Phase | Goal | Key Work |
| --- | --- | --- |
| Phase 0 | Project baseline | Monorepo, FastAPI backend, React + Vite + Tailwind frontend, Ruff, pytest, CI. |
| Phase 1 | Simulation MVP | Pydantic models, mock data, explicit safety rules, deterministic orchestration, mission plan, incident replanning, review report. |
| Phase 2 | Visual demo | Operational dashboard, route and risk visualization, incident injection, replanning display, review panel. |
| Phase 3 | Evaluation set | 30-50 simulation cases, hard constraint pass rate, risk recall, incident response score, explainability score. |
| Phase 4 | Extensible interfaces | Weather, map, drone, dock, UTM, and inspection-result adapters with mock fallback. |

## Evaluation

| Metric | Checks |
| --- | --- |
| Hard Constraint Pass Rate | No-fly zones, wind limits, battery thresholds, return-to-home margin, crowd risk, approval requirements. |
| Risk Recall | GPS blockage, wind rise, crowd peaks, temporary restrictions, glare, low visibility, data-link delay. |
| Plan Efficiency | Flight time, mission splits, coverage, makeup flight area, manual interventions, safety margin. |
| Incident Response Score | Pause, return-to-home, reroute, data preservation, makeup planning, explanation, human takeover. |
| Explainability Score | Evidence, tradeoffs, alternatives, and human confirmation needs for key decisions. |

## Safety and Compliance

SkyOps Agent is a decision-support system for low-altitude operations. It is not a regulatory bypass tool.

The system must never recommend bypassing restricted airspace, ignoring approval requirements, reducing safety margins, or flying aggressively over dense crowds. When data is insufficient or risk is uncertain, the system should clearly state:

```text
Current information is insufficient. Manual review, mission pause, or conservative planning is recommended.
```

All safety rules must be explicit, configurable, and testable. Mock data must never be presented as real-world data.

## Current Status

The repository is currently in the planning and scaffold stage. The immediate priority is to build the Phase 0 baseline and then implement the Phase 1 simulation MVP.

## License

See [LICENSE](./LICENSE).
