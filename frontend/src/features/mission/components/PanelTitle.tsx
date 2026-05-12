import type { LucideIcon } from "lucide-react";

type PanelTitleProps = {
  icon: LucideIcon;
  title: string;
  meta: string;
};

export function PanelTitle({ icon: Icon, title, meta }: PanelTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-teal-300/30 bg-teal-300/10 text-teal-200">
          <Icon aria-hidden="true" size={19} />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <span className="max-w-40 truncate border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-zinc-400">
        {meta}
      </span>
    </div>
  );
}
