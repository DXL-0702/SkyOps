import { Clock3 } from "lucide-react";

import { PanelTitle } from "./PanelTitle";

type PanelFallbackProps = {
  title: string;
  state: "loading" | "failed";
};

export function PanelFallback({ title, state }: PanelFallbackProps) {
  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={Clock3} title={title} meta={state} />
      <div className="mt-4 border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-300">
        {state === "loading" ? "Loading mock mission data..." : "Mission data unavailable."}
      </div>
    </section>
  );
}
