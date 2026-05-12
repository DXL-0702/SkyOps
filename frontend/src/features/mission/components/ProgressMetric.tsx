import { metricStyles, progressStyles, textStyles } from "../uiTokens";

type ProgressMetricProps = {
  label: string;
  value: number;
};

export function ProgressMetric({ label, value }: ProgressMetricProps) {
  return (
    <article className={metricStyles.card}>
      <div className="flex items-center justify-between gap-3">
        <p className={textStyles.label}>{label}</p>
        <p className="text-sm font-semibold text-white">{value}%</p>
      </div>
      <div className={progressStyles.track}>
        <div className={progressStyles.fill} style={{ width: `${value}%` }} />
      </div>
    </article>
  );
}
