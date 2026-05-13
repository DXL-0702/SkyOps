import { Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn, stateStyles, textStyles } from "../uiTokens";

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({ title, message, icon: Icon = Info, className }: EmptyStateProps) {
  return (
    <div className={cn(stateStyles.emptySurface, className)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-400">
          <Icon aria-hidden="true" size={14} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-200">{title}</p>
          <p className={cn(textStyles.subtle, "mt-1")}>{message}</p>
        </div>
      </div>
    </div>
  );
}
