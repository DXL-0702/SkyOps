import { metricStyles, textStyles } from "../uiTokens";

type MetricProps = {
  label: string;
  value: string;
  compact?: boolean;
};

export function Metric({ label, value, compact = false }: MetricProps) {
  return (
    <article className={compact ? metricStyles.compactCard : metricStyles.card}>
      <p className={textStyles.label}>{label}</p>
      <p className={metricStyles.value}>{value}</p>
    </article>
  );
}
