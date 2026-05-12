import type { LucideIcon } from "lucide-react";

import { badgeStyles, cn, iconBoxStyles, textStyles } from "../uiTokens";

type PanelTitleProps = {
  icon: LucideIcon;
  title: string;
  meta: string;
};

export function PanelTitle({ icon: Icon, title, meta }: PanelTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={iconBoxStyles.panel}>
          <Icon aria-hidden="true" size={19} />
        </div>
        <h2 className={textStyles.title}>{title}</h2>
      </div>
      <span className={cn(badgeStyles.base, badgeStyles.neutral, "max-w-40 truncate")}>
        {meta}
      </span>
    </div>
  );
}
