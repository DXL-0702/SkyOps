import type { LucideIcon } from "lucide-react";

type StatusTileProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function StatusTile({ label, value, icon: Icon }: StatusTileProps) {
  return (
    <article className="flex min-h-20 items-center gap-3 border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex h-9 w-9 items-center justify-center border border-zinc-700 bg-zinc-950 text-teal-200">
        <Icon aria-hidden="true" size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-zinc-100">{value}</p>
      </div>
    </article>
  );
}
