import type { LucideIcon } from "lucide-react";

import { iconBoxStyles, panelStyles, textStyles } from "../uiTokens";

type StatusTileProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function StatusTile({ label, value, icon: Icon }: StatusTileProps) {
  return (
    <article className={panelStyles.statusTile}>
      <div className={iconBoxStyles.status}>
        <Icon aria-hidden="true" size={18} />
      </div>
      <div className="min-w-0">
        <p className={textStyles.label}>{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-zinc-100">{value}</p>
      </div>
    </article>
  );
}
