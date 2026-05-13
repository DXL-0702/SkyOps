import {
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Explanation } from "../../api/mission";
import { DataSourceBadge } from "./components/DataSourceBadge";
import { PanelFallback } from "./components/PanelFallback";
import { PanelTitle } from "./components/PanelTitle";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { MissionCycleState } from "./types";
import { badgeStyles, cn, listStyles, panelStyles, textStyles } from "./uiTokens";

type ExplanationSection = {
  id: keyof Explanation;
  title: string;
  badge: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  iconBoxClassName: string;
  iconClassName: string;
  surfaceClassName: string;
};

function EmptyExplanationItem({ label, locale }: { label: string; locale: Locale }) {
  return (
    <div className={cn(listStyles.item, "text-zinc-500")}>
      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-zinc-600" />
      <span>
        {locale === "zh"
          ? `该任务响应未提供${label}。`
          : `No ${label.toLowerCase()} provided by this mission response.`}
      </span>
    </div>
  );
}

function ExplanationList({
  locale,
  section,
}: {
  locale: Locale;
  section: ExplanationSection;
}) {
  const Icon = section.icon;

  return (
    <article className={cn("border p-4", section.surfaceClassName)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center border bg-zinc-950/70",
              section.iconBoxClassName,
            )}
          >
            <Icon aria-hidden="true" size={17} />
          </div>
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-white">
              {t(locale, section.title)}
            </p>
            <p className={cn(textStyles.subtle, "mt-1")}>{t(locale, section.description)}</p>
          </div>
        </div>
        <span className={cn(badgeStyles.base, badgeStyles.neutral)}>
          {t(locale, section.badge)}
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        {section.items.length > 0 ? (
          section.items.map((item) => (
            <div className={listStyles.item} key={item}>
              <Icon
                aria-hidden="true"
                className={cn("mt-0.5 shrink-0", section.iconClassName)}
                size={15}
              />
              <span>{t(locale, item)}</span>
            </div>
          ))
        ) : (
          <EmptyExplanationItem label={t(locale, section.title)} locale={locale} />
        )}
      </div>
    </article>
  );
}

function buildExplanationSections(explanation: Explanation): ExplanationSection[] {
  return [
    {
      id: "facts",
      title: "Fact Inputs",
      badge: "Observed",
      description: "Data and rule outputs used as decision evidence.",
      items: explanation.facts,
      icon: ClipboardList,
      iconBoxClassName: "border-zinc-700 text-zinc-300",
      iconClassName: "text-zinc-300",
      surfaceClassName: "border-zinc-800 bg-zinc-950/70",
    },
    {
      id: "inferences",
      title: "Model Inferences",
      badge: "Reasoned",
      description: "Derived judgments from task, environment, airspace, and drone constraints.",
      items: explanation.inferences,
      icon: Lightbulb,
      iconBoxClassName: "border-amber-400/40 text-amber-200",
      iconClassName: "text-amber-200",
      surfaceClassName: "border-amber-400/25 bg-amber-400/5",
    },
    {
      id: "recommended_actions",
      title: "Recommended Actions",
      badge: "Advisory",
      description: "Operational actions proposed by the task autonomy layer.",
      items: explanation.recommended_actions,
      icon: CheckCircle2,
      iconBoxClassName: "border-teal-400/40 text-teal-200",
      iconClassName: "text-teal-200",
      surfaceClassName: "border-teal-400/25 bg-teal-400/5",
    },
    {
      id: "human_confirmation_required",
      title: "Human Confirmation",
      badge: "Required",
      description: "Items that must remain under human safety or compliance review.",
      items: explanation.human_confirmation_required,
      icon: UserCheck,
      iconBoxClassName: "border-red-400/40 text-red-100",
      iconClassName: "text-red-100",
      surfaceClassName: "border-red-400/30 bg-red-400/5",
    },
  ];
}

export function HumanExplanationPanel({
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
        title="Human Explanation"
        state={missionCycle.status}
        message={
          missionCycle.status === "failed"
            ? missionCycle.message
            : t(locale, "Waiting for facts, inferences, recommended actions, and human confirmation items.")
        }
      />
    );
  }

  const explanation = missionCycle.plan.human_explanation;
  const sections = buildExplanationSections(explanation);

  return (
    <section className={panelStyles.base}>
      <PanelTitle
        icon={ShieldAlert}
        title={t(locale, "Human Explanation")}
        meta={t(locale, "Decision Basis")}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <DataSourceBadge
          locale={locale}
          sourceType={missionCycle.plan.mission_task.source_type}
          label="Mission"
        />
        <DataSourceBadge
          locale={locale}
          sourceType={missionCycle.plan.environment_state.source_type}
          label="Inputs"
        />
        <span className={cn(badgeStyles.base, badgeStyles.warning)}>
          {t(locale, "Not flight permission")}
        </span>
      </div>

      <div className={cn(panelStyles.textSurface, "mt-4 border-amber-400/30 bg-amber-400/5")}>
        <p className="text-sm font-semibold text-amber-100">
          {t(locale, "Decision support only")}
        </p>
        <p className={cn(textStyles.subtle, "mt-2 text-amber-100/80")}>
          {t(
            locale,
            "These explanations make the mission plan auditable. They do not replace airspace approval, site safety responsibility, or manual go/no-go confirmation.",
          )}
        </p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {sections.map((section) => (
          <ExplanationList key={section.id} locale={locale} section={section} />
        ))}
      </div>
    </section>
  );
}
