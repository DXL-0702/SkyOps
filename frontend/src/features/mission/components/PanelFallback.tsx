import { Clock3 } from "lucide-react";

import { PanelTitle } from "./PanelTitle";

type PanelFallbackProps = {
  title: string;
  state: "loading" | "failed";
};

export function PanelFallback({ title, state }: PanelFallbackProps) {
  const isLoading = state === "loading";

  return (
    <section className="border border-zinc-800 bg-zinc-900/70 p-5">
      <PanelTitle icon={Clock3} title={title} meta={isLoading ? "running" : "needs retry"} />
      <div className="mt-4 min-h-28 border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-300">
        <p className="font-semibold text-zinc-100">
          {isLoading ? "Preparing the demo mission loop." : "Mission data is temporarily unavailable."}
        </p>
        <p className="mt-2 max-w-prose text-xs leading-5 text-zinc-400">
          {isLoading
            ? "SkyOps is planning the route, checking the incident response, and building the review summary."
            : "Start or check the backend at 127.0.0.1:8000, then use Run Mission Loop to retry."}
        </p>
      </div>
    </section>
  );
}
