import type { Locale } from "../i18n";
import { t } from "../i18n";
import { cn, metricStyles, progressStyles, textStyles } from "../uiTokens";

type ProgressMetricProps = {
  label: string;
  value: number;
  locale?: Locale;
};

function normalizePercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const percent = value > 0 && value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

function getMetricTone(percent: number): {
  label: string;
  valueClassName: string;
  fillClassName: string;
} {
  if (percent >= 90) {
    return {
      label: "Nominal",
      valueClassName: "text-teal-200",
      fillClassName: "bg-teal-300",
    };
  }

  if (percent >= 75) {
    return {
      label: "Review",
      valueClassName: "text-amber-200",
      fillClassName: "bg-amber-300",
    };
  }

  return {
    label: "Attention",
    valueClassName: "text-red-200",
    fillClassName: "bg-red-400",
  };
}

export function ProgressMetric({ label, value, locale = "en" }: ProgressMetricProps) {
  const percent = normalizePercent(value);
  const tone = getMetricTone(percent);
  const translatedLabel = t(locale, label);

  return (
    <article className={metricStyles.card}>
      <div className="flex items-center justify-between gap-3">
        <p className={textStyles.label}>{translatedLabel}</p>
        <p className={cn("text-sm font-semibold", tone.valueClassName)}>{percent}%</p>
      </div>
      <div
        aria-label={translatedLabel}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className={progressStyles.track}
        role="progressbar"
      >
        <div className={cn("h-2", tone.fillClassName)} style={{ width: `${percent}%` }} />
      </div>
      <p className={cn(textStyles.subtle, "mt-2")}>{t(locale, tone.label)}</p>
    </article>
  );
}
