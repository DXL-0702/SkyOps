import type { HealthState } from "./types";
import { bannerStyles } from "./uiTokens";

export function BackendStatus({ health }: { health: HealthState }) {
  if (health.status === "loading") {
    return <div className={bannerStyles.loading}>Checking backend...</div>;
  }

  if (health.status === "offline") {
    return <div className={bannerStyles.danger}>Backend offline: {health.message}</div>;
  }

  return (
    <div className={bannerStyles.success}>
      Backend online: {health.data.service} / {health.data.mode}
    </div>
  );
}
