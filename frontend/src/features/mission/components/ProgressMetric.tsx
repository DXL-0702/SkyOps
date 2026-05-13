import { metricStyles, progressStyles, textStyles } from "../uiTokens";

type ProgressMetricProps = {
  label: string;
  value: number;
};

function normalizePercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const percent = value > 0 && value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export function ProgressMetric({ label, value }: ProgressMetricProps) {
  const percent = normalizePercent(value);

  return (
    <article className={metricStyles.card}>
      <div className="flex items-center justify-between gap-3">
        <p className={textStyles.label}>{label}</p>
        <p className="text-sm font-semibold text-white">{percent}%</p>
      </div>
      <div className={progressStyles.track}>
        <div className={progressStyles.fill} style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}
