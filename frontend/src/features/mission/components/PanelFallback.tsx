import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import type { Locale } from "../i18n";
import { t } from "../i18n";
import { cn, listStyles, panelStyles, stateStyles, textStyles } from "../uiTokens";
import { PanelTitle } from "./PanelTitle";

type PanelFallbackProps = {
  title: string;
  state: "loading" | "failed";
  message?: string;
  locale?: Locale;
};

const decisionPipeline = [
  "Task understanding",
  "Constraint check",
  "Risk simulation",
  "Plan assembly",
];

export function PanelFallback({ title, state, message, locale = "en" }: PanelFallbackProps) {
  const isLoading = state === "loading";
  const Icon = isLoading ? Clock3 : AlertTriangle;

  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={Icon} title={t(locale, title)} meta={t(locale, state)} />
      <div
        className={cn(
          isLoading ? stateStyles.loadingSurface : stateStyles.failedSurface,
          "mt-4",
        )}
      >
        <p className="text-sm font-semibold text-white">
          {t(
            locale,
            isLoading ? "Mission decision loop is running." : "Mission data unavailable.",
          )}
        </p>
        <p className={cn(isLoading ? textStyles.subtle : "text-xs leading-5 text-red-100/80", "mt-2")}>
          {t(
            locale,
            message ??
              (isLoading
                ? "SkyOps is parsing the task, checking constraints, simulating risks, and preparing an explainable plan."
                : "No flight recommendation should be used until the failed state is reviewed."),
          )}
        </p>

        {isLoading ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {decisionPipeline.map((step) => (
              <div className={stateStyles.pipelineItem} key={step}>
                <Clock3 aria-hidden="true" className="shrink-0 text-teal-200" size={14} />
                <span>{t(locale, step)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-2">
            <div className={listStyles.item}>
              <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-red-200" size={15} />
              <span>{t(locale, "Pause execution and keep the task under manual review.")}</span>
            </div>
            <div className={listStyles.item}>
              <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-amber-200" size={15} />
              <span>{t(locale, "Retry after backend status and mock scenario data are confirmed.")}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
