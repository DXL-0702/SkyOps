type MetricProps = {
  label: string;
  value: string;
  compact?: boolean;
};

export function Metric({ label, value, compact = false }: MetricProps) {
  return (
    <article className={`border border-zinc-800 bg-zinc-950/70 ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-5 text-white">{value}</p>
    </article>
  );
}
