import { Clock3 } from "lucide-react";

import { cn, panelStyles } from "../uiTokens";
import { PanelTitle } from "./PanelTitle";

type PanelFallbackProps = {
  title: string;
  state: "loading" | "failed";
};

export function PanelFallback({ title, state }: PanelFallbackProps) {
  return (
    <section className={panelStyles.base}>
      <PanelTitle icon={Clock3} title={title} meta={state} />
      <div className={cn(panelStyles.surfacePadded, "mt-4 text-sm text-zinc-300")}>
        {state === "loading" ? "Loading mock mission data..." : "Mission data unavailable."}
      </div>
    </section>
  );
}
