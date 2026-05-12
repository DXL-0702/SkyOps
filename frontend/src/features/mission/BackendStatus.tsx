import type { HealthState } from "./types";
import { bannerStyles, buttonStyles, cn, textStyles } from "./uiTokens";

type BackendStatusProps = {
  health: HealthState;
  onRetry: () => void;
};

export function BackendStatus({ health, onRetry }: BackendStatusProps) {
  if (health.status === "loading") {
    return <div className={bannerStyles.loading}>Checking backend...</div>;
  }

  if (health.status === "offline") {
    return (
      <div className={bannerStyles.danger}>
        <p className="font-semibold">Backend unavailable.</p>
        <p className={cn(textStyles.subtle, "mt-1")}>Please ensure the backend is running at 127.0.0.1:8000.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className={cn(buttonStyles.base, buttonStyles.primary, "px-3 py-2 text-xs")}
            onClick={onRetry}
            type="button"
          >
            Retry health check
          </button>
          <a
            className={cn(buttonStyles.base, buttonStyles.incidentIdle, "px-3 py-2 text-xs")}
            href="http://127.0.0.1:8000"
            target="_blank"
            rel="noreferrer"
          >
            Open backend URL
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={bannerStyles.success}>
      Backend online: {health.data.service} / {health.data.mode}
    </div>
  );
}
