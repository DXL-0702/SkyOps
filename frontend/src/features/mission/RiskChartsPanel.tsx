import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RiskLevel } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { SectionLabel } from "./components/SectionLabel";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { MissionCycleState } from "./types";
import { cn, listStyles, panelStyles, textStyles } from "./uiTokens";

type RiskChartItem = {
  level: RiskLevel;
  label: string;
  value: number;
  fill: string;
};

const riskChartOrder: RiskLevel[] = ["critical", "high", "medium", "low"];

const riskChartFill: Record<RiskLevel, string> = {
  critical: "#f87171",
  high: "#fb7185",
  medium: "#fbbf24",
  low: "#5eead4",
};

function buildRiskChartData(missionCycle: MissionCycleState, locale: Locale): RiskChartItem[] {
  if (missionCycle.status !== "ready") {
    return [];
  }

  return riskChartOrder.map((level) => ({
    level,
    label: t(locale, level),
    value: missionCycle.plan.risks.filter((risk) => risk.risk_level === level).length,
    fill: riskChartFill[level],
  }));
}

function buildReviewChartData(missionCycle: MissionCycleState, locale: Locale) {
  if (missionCycle.status !== "ready") {
    return [];
  }

  const review = missionCycle.review.mission_review;

  return [
    {
      name: t(locale, "Mission Completion"),
      value: review.completion_rate,
      fill: "#5eead4",
    },
    {
      name: t(locale, "Data Quality"),
      value: review.data_quality_score,
      fill: "#fbbf24",
    },
  ];
}

export function RiskChartsPanel({
  locale,
  missionCycle,
  variant = "risk",
}: {
  locale: Locale;
  missionCycle: MissionCycleState;
  variant?: "risk" | "review";
}) {
  if (missionCycle.status !== "ready") {
    return <PanelFallback locale={locale} title="Risk Mini Charts" state={missionCycle.status} />;
  }

  const riskChartData = buildRiskChartData(missionCycle, locale);
  const reviewChartData = buildReviewChartData(missionCycle, locale);
  const highPriorityCount = missionCycle.plan.risks.filter(
    (risk) => risk.risk_level === "critical" || risk.risk_level === "high",
  ).length;
  const completionRate = missionCycle.review.mission_review.completion_rate;
  const dataQualityScore = missionCycle.review.mission_review.data_quality_score;
  const chartTitle = variant === "review" ? "Review Mini Charts" : "Risk Mini Charts";
  const chartMeta = variant === "review" ? "Completion And Quality" : "Risk Distribution";

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={BarChart3} title={t(locale, chartTitle)} meta={t(locale, chartMeta)} />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge
          locale={locale}
          sourceType={missionCycle.plan.mission_task.source_type}
          label="Chart Data"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className={panelStyles.surfacePadded}>
          <SectionLabel label={t(locale, "Risk Level Counts")} />
          <div className="mt-4 h-56 min-w-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="#a1a1aa" tickLine={false} />
                <YAxis allowDecimals={false} stroke="#a1a1aa" tickLine={false} width={34} />
                <Tooltip
                  contentStyle={{
                    background: "#09090b",
                    border: "1px solid #3f3f46",
                    color: "#f4f4f5",
                  }}
                />
                <Bar dataKey="value" name={t(locale, "Count")} radius={[0, 0, 0, 0]}>
                  {riskChartData.map((entry) => (
                    <Cell fill={entry.fill} key={entry.level} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2">
            {riskChartData.map((item) => (
              <div className={listStyles.item} key={item.level}>
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0" style={{ backgroundColor: item.fill }} />
                <span>
                  {item.label}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={panelStyles.surfacePadded}>
          <SectionLabel label={t(locale, "Review Scores")} />
          <div className="mt-4 h-56 min-w-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={reviewChartData}
                  dataKey="value"
                  innerRadius="56%"
                  outerRadius="78%"
                  paddingAngle={4}
                  nameKey="name"
                >
                  {reviewChartData.map((entry) => (
                    <Cell fill={entry.fill} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#09090b",
                    border: "1px solid #3f3f46",
                    color: "#f4f4f5",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2">
            {reviewChartData.map((item) => (
              <div className={listStyles.item} key={item.name}>
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0" style={{ backgroundColor: item.fill }} />
                <span>
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className={cn(textStyles.subtle, "mt-4")}>
        {t(locale, "Text fallback")}:{" "}
        {t(locale, "High priority risks")} {highPriorityCount};{" "}
        {t(locale, "Mission Completion")} {completionRate}%; {t(locale, "Data Quality")}{" "}
        {dataQualityScore}%.
      </p>
    </section>
  );
}
