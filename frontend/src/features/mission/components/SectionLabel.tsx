export function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
      {label}
    </p>
  );
}
