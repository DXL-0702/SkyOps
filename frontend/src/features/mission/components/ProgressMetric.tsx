type ProgressMetricProps = {
  label: string;
  value: number;
};

export function ProgressMetric({ label, value }: ProgressMetricProps) {
  return (
    <article className="border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className="text-sm font-semibold text-white">{value}%</p>
      </div>
      <div className="mt-3 h-2 bg-zinc-800">
        <div className="h-2 bg-teal-300" style={{ width: `${value}%` }} />
      </div>
    </article>
  );
}
