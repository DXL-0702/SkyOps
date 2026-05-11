<p align="center">
  <img src="./skyops_readme_header_1.png" alt="SkyOps Agent" width="100%" />
</p>

# SkyOps Agent

**SkyOps Agent** is a task-level autonomy and risk simulation agent for low-altitude operations in Shenzhen's emerging low-altitude economy.

It is not a drone defect detection tool, a crack recognition model, a photovoltaic hotspot detector, or a low-level flight controller. SkyOps Agent focuses on the decision layer between operational demand and execution systems: whether a mission should fly, when it should fly, how it should be split, what risks may appear, and how the plan should be revised when conditions change.

[中文说明](./README.zh-CN.md)

## What It Solves

SkyOps Agent is designed to answer operational questions that appear before, during, and after a low-altitude mission:

- Should this mission fly under the current constraints?
- What time window is safest?
- Which launch and landing points, route strategy, drone, payload, and mission split should be used?
- What should happen when wind speed rises, GPS confidence drops, video transmission is delayed, crowds gather, airspace restrictions change, or battery becomes insufficient?
- If the mission cannot be completed in one flight, how should a makeup flight be generated?
- How can every operation produce an explainable, reviewable, and continuously improving closed loop?

The first MVP scenario is **autonomous mission planning and risk simulation for a high-rise building facade inspection in Shenzhen**. Inspection is only the first demo scenario. The same task-level autonomy layer can extend to campus security patrols, construction site checks, photovoltaic inspections, emergency response, fire safety patrols, low-altitude mapping, urban governance, and logistics missions.

## Core Positioning

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

- **Active sensing**: infers missing mission constraints instead of waiting for long forms.
- **Multi-source constraint reasoning**: considers weather, wind, lighting, crowd density, airspace, GPS, battery, payload, data link, safety, regulation, and business priority together.
- **Risk simulation**: runs what-if analysis before and during execution.
- **Autonomous planning**: recommends time windows, launch and landing points, route strategy, mission splits, safety thresholds, and abort conditions.
- **Incident replanning**: responds to wind changes, GPS issues, temporary restrictions, data-link delay, low battery, and crowd aggregation.
- **Closed-loop review**: generates mission reviews, risk logs, data quality scores, makeup flight plans, and next-mission improvements.
- **Explainable decisions**: every key decision must include evidence, tradeoffs, alternatives, and required human confirmations.

## Recommended Multi-Agent Architecture

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

## Planned Repository Structure

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

## MVP Scenario

The first demo should implement:

> Autonomous mission planning and risk simulation for a high-rise building facade inspection in Shenzhen.

Example flow:

1. User enters a natural-language mission: "Inspect a 180-meter office building facade in Nanshan tomorrow morning, focusing on curtain-wall cracks and detachment risk while minimizing impact on pedestrians."
2. The system extracts mission goals, constraints, and risk preference.
3. The system reads or simulates weather, crowd flow, restricted airspace, GPS confidence, battery, and data-link state.
4. The system recommends a time window, launch and landing points, route strategy, safety thresholds, and abort conditions.
5. A user or simulator injects incidents such as wind speed increase, GPS confidence drop, video delay, temporary restricted zone update, low battery, or crowd aggregation.
6. The agent replans and recommends pause, return-to-home, reroute, degraded mission, makeup flight, or human takeover.
7. The system generates a mission review, risk explanation, makeup flight plan, and next-mission recommendations.

## Development Roadmap

### Phase 0: Project Baseline

- Create the monorepo structure.
- Initialize FastAPI backend.
- Initialize React + TypeScript + Vite + Tailwind CSS frontend.
- Configure Ruff, pytest, frontend build, and basic CI.
- Define initial API conventions and model locations.

### Phase 1: Simulation MVP

- Implement core Pydantic models.
- Add mock weather, crowd, airspace, and drone data.
- Implement explicit safety rules.
- Build deterministic agent orchestration.
- Generate structured mission plans and human-readable explanations.
- Support incident injection and replanning.
- Generate mission review reports.

### Phase 2: Visual Demo

- Build an operational dashboard instead of a marketing landing page.
- Visualize mission input, constraints, route strategy, risk items, incidents, replanning actions, and review outputs.
- Clearly label all mock and simulated data.

### Phase 3: Evaluation Set

- Build 30-50 low-altitude simulation cases.
- Measure hard constraint pass rate, risk recall, plan efficiency, incident response score, and explainability score.
- Produce repeatable evaluation reports.

### Phase 4: Extensible Interfaces

- Prepare adapters for weather, maps, drones, docks, UTM platforms, and inspection-result systems.
- Keep mock adapters available for local testing.
- Track data source, timestamp, and confidence for real integrations.

## Evaluation Metrics

- **Hard Constraint Pass Rate**: detects violations of no-fly zones, wind limits, battery thresholds, return-to-home margin, unsafe crowd conditions, and approval requirements.
- **Risk Recall**: checks whether embedded risks such as GPS blockage, wind rise, crowd peaks, temporary restrictions, glare, low visibility, or data-link delay are identified.
- **Plan Efficiency**: compares flight time, mission splits, coverage, makeup flight area, manual interventions, and safety margin.
- **Incident Response Score**: evaluates pause, return-to-home, reroute, data preservation, makeup planning, explanation, and human takeover behavior.
- **Explainability Score**: checks whether decisions explain evidence, tradeoffs, alternatives, and human confirmation needs.

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
