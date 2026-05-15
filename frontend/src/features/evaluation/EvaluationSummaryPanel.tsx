import { AlertTriangle, ClipboardList, ShieldCheck } from "lucide-react";

import { DataSourceBadge } from "../mission/components/DataSourceBadge";
import { PanelTitle } from "../mission/components/PanelTitle";
import type { Locale } from "../mission/i18n";
import {
  badgeStyles,
  cn,
  metricStyles,
  panelStyles,
  progressStyles,
  textStyles,
} from "../mission/uiTokens";
import { mockEvaluationReport } from "./mockEvaluationReport";
import type { EvaluationFailedCase, EvaluationReportSummary } from "./types";

type EvaluationSummaryPanelProps = {
  locale: Locale;
  report?: EvaluationReportSummary;
};

type MetricCopy = {
  label: string;
  helper: string;
};

const MAX_DISPLAYED_FAILED_CASES = 5;

const copy = {
  zh: {
    title: "评测摘要",
    meta: "任务级能力",
    sourceLabel: "数据集",
    badge: "模拟评测",
    note:
      "基于本地模拟评测用例生成，展示任务规划、硬约束、风险召回、异常响应和可解释性表现。",
    noRealApi: "未接入真实天气、地图、空域、无人机、GPS、图传或人群接口。",
    passed: "通过",
    failed: "失败",
    failedCases: "失败用例",
    caseId: "用例 ID",
    caseName: "用例名称",
    category: "类别",
    reason: "失败原因",
    noFailedCases: "该模拟评测报告中没有失败用例。",
    missingFailedCaseDetails: "报告标记了失败用例，但当前摘要没有提供失败明细。",
    fallbackCaseName: "未命名评测用例",
    fallbackCategory: "未知类别",
    fallbackReason: "未提供失败原因。",
    metrics: {
      overallPassRate: {
        label: "整体通过率",
        helper: "通过所有评测检查的用例比例。",
      },
      hardConstraintPassRate: {
        label: "硬约束通过率",
        helper: "安全与合规约束满足情况。",
      },
      riskRecall: {
        label: "风险召回",
        helper: "智能体识别预期风险的能力。",
      },
      incidentResponse: {
        label: "异常响应",
        helper: "对注入异常的保守处置能力。",
      },
      explainability: {
        label: "可解释性",
        helper: "决策原因与证据完整性。",
      },
    },
  },
  en: {
    title: "Evaluation Summary",
    meta: "Task-Level Capability",
    sourceLabel: "Dataset",
    badge: "Mock / Simulated Evaluation",
    note:
      "Generated from local mock/simulated evaluation cases for mission planning, hard constraints, risk recall, incident response, and explainability.",
    noRealApi: "No real weather, map, airspace, drone, GPS, video link, or crowd API is used.",
    passed: "Passed",
    failed: "Failed",
    failedCases: "Failed Cases",
    caseId: "Case ID",
    caseName: "Case Name",
    category: "Category",
    reason: "Failure Reason",
    noFailedCases: "No failed cases in this mock report.",
    missingFailedCaseDetails:
      "The report marks failed cases, but this summary does not include failure details.",
    fallbackCaseName: "Untitled evaluation case",
    fallbackCategory: "unknown",
    fallbackReason: "No reason provided.",
    metrics: {
      overallPassRate: {
        label: "Overall Pass Rate",
        helper: "Cases passing all evaluation checks.",
      },
      hardConstraintPassRate: {
        label: "Hard Constraint Pass Rate",
        helper: "Safety and compliance constraints satisfied.",
      },
      riskRecall: {
        label: "Risk Recall",
        helper: "Expected risks identified by the Agent.",
      },
      incidentResponse: {
        label: "Incident Response",
        helper: "Conservative response to injected incidents.",
      },
      explainability: {
        label: "Explainability",
        helper: "Decision reasons and evidence completeness.",
      },
    },
  },
} as const;

function getShowingTopCasesMessage(locale: Locale, displayedCount: number, totalCount: number) {
  if (locale === "zh") {
    return `当前展示 ${displayedCount} / ${totalCount} 条失败用例，完整结果保留在评测报告数据中。`;
  }

  return (
    `Showing ${displayedCount} of ${totalCount} failed cases. `
    + "The full result is preserved in the evaluation report data."
  );
}

function normalizePercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const percent = value > 0 && value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

function getOverallPassRate(report: EvaluationReportSummary): number {
  if (report.case_count <= 0) {
    return 0;
  }

  return report.passed_count / report.case_count;
}

function MetricCard({ metric, value }: { metric: MetricCopy; value: number }) {
  const percent = normalizePercent(value);
  const toneClassName =
    percent >= 90 ? "text-teal-200" : percent >= 75 ? "text-amber-200" : "text-red-200";
  const fillClassName =
    percent >= 90 ? "bg-teal-300" : percent >= 75 ? "bg-amber-300" : "bg-red-400";

  return (
    <article className={metricStyles.compactCard}>
      <div className="flex items-center justify-between gap-3">
        <p className={cn(textStyles.strongLabel, "min-w-0 break-words")}>{metric.label}</p>
        <p className={cn("shrink-0 text-sm font-semibold", toneClassName)}>{percent}%</p>
      </div>
      <div
        aria-label={metric.label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className={progressStyles.track}
        role="progressbar"
      >
        <div className={cn("h-2", fillClassName)} style={{ width: `${percent}%` }} />
      </div>
      <p className={cn(textStyles.subtle, "mt-2")}>{metric.helper}</p>
    </article>
  );
}

function firstNonEmpty(values?: string[]): string | undefined {
  return values?.find((value) => value.trim());
}

function getFailedCaseView(failedCase: EvaluationFailedCase, locale: Locale) {
  const localized = failedCase.localized?.[locale];
  const tableCopy = copy[locale];

  return {
    caseId: failedCase.case_id ?? "unknown-case",
    caseName: localized?.case_name ?? failedCase.case_name ?? tableCopy.fallbackCaseName,
    category: localized?.category ?? failedCase.category ?? tableCopy.fallbackCategory,
    reason:
      firstNonEmpty(localized?.failure_reasons)
      ?? firstNonEmpty(failedCase.failure_reasons)
      ?? tableCopy.fallbackReason,
  };
}

function FailedCaseTable({
  failedCases,
  locale,
  totalFailedCount,
}: {
  failedCases: EvaluationFailedCase[];
  locale: Locale;
  totalFailedCount: number;
}) {
  const tableCopy = copy[locale];

  if (failedCases.length === 0) {
    return (
      <div className={cn(panelStyles.surfacePadded, "mt-3")}>
        <p className={textStyles.body}>
          {totalFailedCount > 0 ? tableCopy.missingFailedCaseDetails : tableCopy.noFailedCases}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-2" role="table" aria-label={tableCopy.failedCases}>
      <div
        className={cn(
          textStyles.label,
          "hidden border border-zinc-800 bg-zinc-950/70 px-3 py-2 md:grid md:grid-cols-[1.25fr_1.45fr_1fr_2fr] md:gap-3",
        )}
        role="row"
      >
        <span role="columnheader">{tableCopy.caseId}</span>
        <span role="columnheader">{tableCopy.caseName}</span>
        <span role="columnheader">{tableCopy.category}</span>
        <span role="columnheader">{tableCopy.reason}</span>
      </div>

      {failedCases.map((failedCase, index) => {
        const failedCaseView = getFailedCaseView(failedCase, locale);

        return (
          <div
            className="grid gap-2 border border-zinc-800 bg-zinc-950/70 px-3 py-3 text-sm text-zinc-300 md:grid-cols-[1.25fr_1.45fr_1fr_2fr] md:gap-3"
            key={failedCase.case_id ?? `${failedCaseView.caseName}-${index}`}
            role="row"
          >
            <span className="min-w-0 break-words font-semibold text-zinc-100" role="cell">
              <span className={cn(textStyles.label, "mb-1 block md:hidden")}>
                {tableCopy.caseId}
              </span>
              {failedCaseView.caseId}
            </span>
            <span className="min-w-0 break-words" role="cell">
              <span className={cn(textStyles.label, "mb-1 block md:hidden")}>
                {tableCopy.caseName}
              </span>
              {failedCaseView.caseName}
            </span>
            <span className="min-w-0 break-words" role="cell">
              <span className={cn(textStyles.label, "mb-1 block md:hidden")}>
                {tableCopy.category}
              </span>
              {failedCaseView.category}
            </span>
            <span className="min-w-0 break-words text-red-100" role="cell">
              <span className={cn(textStyles.label, "mb-1 block md:hidden")}>
                {tableCopy.reason}
              </span>
              {failedCaseView.reason}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function EvaluationSummaryPanel({
  locale,
  report = mockEvaluationReport,
}: EvaluationSummaryPanelProps) {
  const panelCopy = copy[locale];
  const failedCases = report.failed_cases ?? [];
  const totalFailedCount = Math.max(report.failed_count, failedCases.length);
  const displayedFailedCases = failedCases.slice(0, MAX_DISPLAYED_FAILED_CASES);

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={ClipboardList} title={panelCopy.title} meta={panelCopy.meta} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DataSourceBadge locale={locale} sourceType="simulated" label={panelCopy.sourceLabel} />
        <span className={cn(badgeStyles.base, badgeStyles.mock)}>{panelCopy.badge}</span>
      </div>

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className={textStyles.body}>{panelCopy.note}</p>
            <p className={cn(textStyles.subtle, "mt-2")}>{panelCopy.noRealApi}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <span className={cn(badgeStyles.base, badgeStyles.success)}>
              <ShieldCheck aria-hidden="true" className="mr-1.5" size={14} />
              {panelCopy.passed}: {report.passed_count}
            </span>
            <span className={cn(badgeStyles.base, badgeStyles.warning)}>
              <AlertTriangle aria-hidden="true" className="mr-1.5" size={14} />
              {panelCopy.failed}: {report.failed_count}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          metric={panelCopy.metrics.overallPassRate}
          value={getOverallPassRate(report)}
        />
        <MetricCard
          metric={panelCopy.metrics.hardConstraintPassRate}
          value={report.hard_constraint_pass_rate}
        />
        <MetricCard metric={panelCopy.metrics.riskRecall} value={report.risk_recall_avg} />
        <MetricCard
          metric={panelCopy.metrics.incidentResponse}
          value={report.incident_response_avg}
        />
        <MetricCard
          metric={panelCopy.metrics.explainability}
          value={report.explainability_avg}
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className={textStyles.title}>{panelCopy.failedCases}</h3>
          <span className={cn(badgeStyles.base, badgeStyles.neutral)}>
            {report.failed_count} / {report.case_count}
          </span>
        </div>
        <FailedCaseTable
          failedCases={displayedFailedCases}
          locale={locale}
          totalFailedCount={totalFailedCount}
        />
        {totalFailedCount > displayedFailedCases.length ? (
          <p className={cn(textStyles.subtle, "mt-3")}>
            {getShowingTopCasesMessage(locale, displayedFailedCases.length, totalFailedCount)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
