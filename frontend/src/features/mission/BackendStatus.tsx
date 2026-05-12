import type { HealthState } from "./types";

export function BackendStatus({ health }: { health: HealthState }) {
  if (health.status === "loading") {
    return (
      <div className="border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
        Checking backend...
      </div>
    );
  }

  if (health.status === "offline") {
    return (
      <div className="border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
        Backend offline: {health.message}
      </div>
    );
  }

  return (
    <div className="border border-teal-400/40 bg-teal-400/10 px-4 py-3 text-sm text-teal-100">
      Backend online: {health.data.service} / {health.data.mode}
    </div>
  );
}
