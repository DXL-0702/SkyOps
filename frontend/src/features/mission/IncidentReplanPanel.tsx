import {
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  ListChecks,
  Route,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { DataSourceBadge } from "./components/DataSourceBadge";
import { EmptyState } from "./components/EmptyState";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import { SectionLabel } from "./components/SectionLabel";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { MissionCycleState } from "./types";
import { badgeStyles, cn, listStyles, panelStyles, textStyles } from "./uiTokens";

function normalizeRejectedAlternative(alternative: string): string {
  return alternative.replace(/^rejected:\s*/i, "").trim();
}

function OperationalFlag({
  label,
  locale,
  value,
  critical,
}: {
  label: string;
  locale: Locale;
  value: boolean;
  critical?: boolean;
}) {
  const isAttentionRequired = value && critical;
  const valueLabel = value ? t(locale, "Required") : t(locale, "Not Required");

  return (
    <article className={panelStyles.surfacePadded}>
      <p className={textStyles.label}>{t(locale, label)}</p>
      <div className="mt-2 flex items-center gap-2">
        {value ? (
          <AlertTriangle
            aria-hidden="true"
            className={isAttentionRequired ? "text-red-200" : "text-amber-200"}
            size={16}
          />
        ) : (
          <ShieldCheck aria-hidden="true" className="text-teal-200" size={16} />
        )}
        <span className="text-sm font-semibold text-white">{valueLabel}</span>
      </div>
    </article>
  );
}

function AffectedSegmentsList({ locale, segments }: { locale: Locale; segments: string[] }) {
  if (segments.length === 0) {
    return (
      <div>
        <SectionLabel label={t(locale, "Affected Segments")} />
        <EmptyState
          className="mt-3"
          icon={Route}
          title={t(locale, "No affected segment listed")}
          message={t(
            locale,
            "The current mock replan result did not provide route segments. Keep the active segment under manual review.",
          )}
        />
      </div>
    );
  }

  return (
    <div>
      <SectionLabel label={t(locale, "Affected Segments")} />
      <div className="mt-3 grid gap-2">
        {segments.map((segment) => (
          <div className={listStyles.item} key={segment}>
            <Route aria-hidden="true" className="mt-0.5 shrink-0 text-amber-200" size={15} />
            <span>{t(locale, segment)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplanActionsTimeline({
  actions,
  locale,
}: {
  actions?: string[] | null;
  locale: Locale;
}) {
  if (!actions || actions.length === 0) {
    return (
      <div>
        <SectionLabel label={t(locale, "Action Timeline")} />
        <EmptyState
          className="mt-3"
          icon={ListChecks}
          title={t(locale, "No replan actions available")}
          message={t(
            locale,
            "The mock response returned no ordered action list. Keep this decision in manual review before execution.",
          )}
        />
      </div>
    );
  }

  return (
    <div>
      <SectionLabel label={t(locale, "Action Timeline")} />
      <ol aria-label={t(locale, "Replan action sequence")} className="mt-3 grid gap-0">
        {actions.map((action, index) => {
          const isLastStep = index === actions.length - 1;

          return (
            <li className="relative grid grid-cols-[2rem_1fr] gap-3" key={`${action}-${index}`}>
              <div className="relative flex justify-center">
                <span className="z-10 flex h-8 w-8 items-center justify-center border border-teal-300/40 bg-teal-300/15 text-teal-100">
                  <ListChecks aria-hidden="true" size={15} />
                </span>
                {!isLastStep ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 top-8 w-px bg-zinc-700"
                  />
                ) : null}
              </div>
              <div className={cn(panelStyles.surfacePadded, isLastStep ? "" : "mb-3")}>
                <p className={textStyles.label}>
                  {t(locale, "Step")} {index + 1}
                </p>
                <p className="mt-1 break-words text-sm font-semibold leading-5 text-white">
                  {t(locale, action)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function RejectedAlternativesList({
  alternatives,
  locale,
}: {
  alternatives: string[];
  locale: Locale;
}) {
  if (alternatives.length === 0) {
    return (
      <EmptyState
        icon={XCircle}
        title={t(locale, "No rejected alternatives recorded")}
        message={t(
          locale,
          "The current mock replan result did not return alternative options. Treat the selected decision as requiring human review.",
        )}
      />
    );
  }

  return (
    <div className={cn(panelStyles.surfacePadded, "border-red-400/35 bg-red-400/5")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionLabel label={t(locale, "Rejected Alternatives")} />
        <span className={cn(badgeStyles.base, badgeStyles.danger)}>
          {t(locale, "Not Recommended")}
        </span>
      </div>
      <p className={cn(textStyles.subtle, "mt-2")}>
        {t(
          locale,
          "These options were evaluated by the replan rule and explicitly rejected. They are not recommended next steps.",
        )}
      </p>
      <div className="mt-3 grid gap-2">
        {alternatives.map((alternative) => {
          const rejectedAlternative = normalizeRejectedAlternative(alternative);

          return (
            <div
              className="border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm leading-5 text-red-50"
              key={alternative}
            >
              <div className="flex items-start gap-2">
                <XCircle aria-hidden="true" className="mt-0.5 shrink-0 text-red-200" size={15} />
                <div>
                  <p className="font-semibold">{t(locale, "Rejected")}</p>
                  <p className="mt-1">{t(locale, rejectedAlternative)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function IncidentReplanPanel({
  locale,
  missionCycle,
}: {
  locale: Locale;
  missionCycle: MissionCycleState;
}) {
  if (missionCycle.status !== "ready") {
    return (
      <PanelFallback
        locale={locale}
        title="Replan Decision"
        state={missionCycle.status}
        message={
          missionCycle.status === "failed"
            ? missionCycle.message
            : t(locale, "Inject an incident to view replanning.")
        }
      />
    );
  }

  const decision = missionCycle.replan.replan_decision;
  const hasRejectedAlternatives = decision.alternatives_considered.length > 0;

  return (
    <section className={panelStyles.base}>
      <PanelTitle
        icon={GitBranch}
        title={t(locale, "Replan Decision")}
        meta={decision.incident_id}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge
          locale={locale}
          sourceType={missionCycle.incidentEvent.source_type}
          label="Incident"
        />
        <DataSourceBadge locale={locale} sourceType="mock" label="Replan Result" />
      </div>

      <div className={cn(panelStyles.surfacePadded, "mt-4 border-teal-400/35 bg-teal-400/5")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionLabel label={t(locale, "Decision Summary")} />
          <span className={cn(badgeStyles.base, badgeStyles.success)}>
            {t(locale, "Selected Decision")}
          </span>
        </div>
        <p className="mt-3 break-words text-lg font-semibold leading-6 text-white">
          {t(locale, decision.decision)}
        </p>
      </div>

      <div className={cn(panelStyles.textSurface, "mt-4")}>
        <SectionLabel label={t(locale, "Reason")} />
        <p className="mt-3 text-sm leading-6 text-zinc-200">{t(locale, decision.reason)}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <OperationalFlag
          label="Makeup Flight Required"
          locale={locale}
          value={decision.makeup_flight_required}
        />
        <OperationalFlag
          critical
          label="Human Takeover Required"
          locale={locale}
          value={decision.human_takeover_required}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ReplanActionsTimeline actions={decision.actions} locale={locale} />
        <AffectedSegmentsList locale={locale} segments={decision.affected_segments} />
      </div>

      <div className={cn(panelStyles.surfacePadded, "mt-4")}>
        <div className="flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="text-zinc-400" size={15} />
          <SectionLabel label={t(locale, "Alternatives Considered")} />
        </div>
        <p className={cn(textStyles.subtle, "mt-2")}>
          {hasRejectedAlternatives
            ? t(
                locale,
                "The selected decision is shown with rejected alternatives from the deterministic replan rule.",
              )
            : t(
                locale,
                "No rejected alternatives were returned by the mock replan rule, so the selected decision should remain reviewable.",
              )}
        </p>
      </div>

      <div className="mt-4">
        <RejectedAlternativesList
          alternatives={decision.alternatives_considered}
          locale={locale}
        />
      </div>
    </section>
  );
}
