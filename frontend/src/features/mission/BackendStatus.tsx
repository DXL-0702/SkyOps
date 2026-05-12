import type { HealthState } from "./types";

export function BackendStatus({ health }: { health: HealthState }) {
  if (health.status === "loading") {
    return (
      <div className="w-full border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 lg:max-w-md">
        Checking backend connection...
      </div>
    );
  }

  if (health.status === "offline") {
    return (
      <div className="w-full border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-50 lg:max-w-md">
        <p className="font-semibold text-amber-100">Backend is not connected.</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-amber-50/85">
          <li>Start the backend service.</li>
          <li>Check http://127.0.0.1:8000/health.</li>
          <li>Run the mission loop again after it is ready.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="w-full border border-teal-400/40 bg-teal-400/10 px-4 py-3 text-sm text-teal-100 lg:max-w-md">
      Backend online: {health.data.service} / {health.data.mode}
    </div>
  );
}
