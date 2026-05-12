import { CheckCircle2 } from "lucide-react";

import { ActionList } from "./components/ActionList";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { ProgressMetric } from "./components/ProgressMetric";
import type { MissionCycleState } from "./types";
import { panelStyles } from "./uiTokens";

export function MissionReviewPanel({ missionCycle }: { missionCycle: MissionCycleState }) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback title="Mission Review" state={missionCycle.status} />;
  }

  const review = missionCycle.review.mission_review;

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={CheckCircle2} title="Mission Review" meta={review.mission_id} />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge sourceType={missionCycle.plan.mission_task.source_type} label="Mission" />
        <DataSourceBadge sourceType={missionCycle.incidentEvent.source_type} label="Incident" />
        <DataSourceBadge sourceType="mock" label="Review Result" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ProgressMetric label="Completion" value={review.completion_rate} />
        <ProgressMetric label="Data Quality" value={review.data_quality_score} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ActionList title="Makeup Flight" items={review.makeup_flight_plan} tone="teal" />
        <ActionList title="Human Review" items={review.human_review_checklist} tone="amber" />
      </div>
    </section>
  );
}
