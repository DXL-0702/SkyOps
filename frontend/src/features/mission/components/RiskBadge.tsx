function getRiskBadgeClass(level: string): string {
  if (level === "critical") {
    return "border-red-400/40 bg-red-400/10 text-red-200";
  }

  if (level === "high") {
    return "border-amber-400/40 bg-amber-400/10 text-amber-200";
  }

  return "border-teal-400/40 bg-teal-400/10 text-teal-200";
}

export function RiskBadge({ level }: { level: string }) {
  return (
    <span
      className={`border px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getRiskBadgeClass(level)}`}
    >
      {level}
    </span>
  );
}
