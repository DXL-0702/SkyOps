import type { LucideIcon } from "lucide-react";

import { badgeStyles, cn, iconBoxStyles, textStyles } from "../uiTokens";

type PanelTitleProps = {
  icon: LucideIcon;
  title: string;
  meta: string;
};

export function PanelTitle({ icon: Icon, title, meta }: PanelTitleProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn(iconBoxStyles.panel, "shrink-0")}>
          <Icon aria-hidden="true" size={19} />
        </div>
        <h2 className={cn(textStyles.title, "min-w-0 break-words")}>{title}</h2>
      </div>
      <span className={cn(badgeStyles.base, badgeStyles.neutral, "max-w-full break-words")}>
        {meta}
      </span>
    </div>
  );
}
