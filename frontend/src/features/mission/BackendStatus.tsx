import { API_BASE_URL } from "../../api/client";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { HealthState } from "./types";
import { badgeStyles, bannerStyles, buttonStyles, cn, textStyles } from "./uiTokens";

const apiEndpointLabel = API_BASE_URL === "" ? "Vite proxy -> 127.0.0.1:8000" : API_BASE_URL;
const backendUrl = API_BASE_URL === "" ? "http://127.0.0.1:8000" : API_BASE_URL;

type BackendStatusProps = {
  health: HealthState;
  locale: Locale;
  onRetry: () => void;
};

export function BackendStatus({ health, locale, onRetry }: BackendStatusProps) {
  if (health.status === "loading") {
    return (
      <div className={cn(bannerStyles.loading, "min-w-72")}>
        <p className="font-semibold text-zinc-100">
          {t(locale, "Checking mission autonomy backend")}
        </p>
        <p className={cn(textStyles.subtle, "mt-1")}>{apiEndpointLabel}</p>
      </div>
    );
  }

  if (health.status === "offline") {
    return (
      <div className={cn(bannerStyles.danger, "max-w-xl")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-red-50">{t(locale, "Backend offline")}</p>
          <span className={cn(badgeStyles.base, badgeStyles.danger)}>
            {t(locale, "Manual review")}
          </span>
        </div>
        <p className="mt-2 leading-6">{t(locale, health.message)}</p>
        <p className="mt-2 text-xs leading-5 text-red-100/80">Endpoint: {apiEndpointLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className={cn(
              buttonStyles.base,
              buttonStyles.primary,
              "h-9 px-3 text-xs font-semibold uppercase tracking-[0.12em]",
            )}
            onClick={onRetry}
            type="button"
          >
            {t(locale, "Retry health check")}
          </button>
          <a
            className={cn(buttonStyles.base, buttonStyles.compact)}
            href={backendUrl}
            rel="noreferrer"
            target="_blank"
          >
            {t(locale, "Open backend URL")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(bannerStyles.success, "min-w-72")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-teal-50">{t(locale, "Backend online")}</p>
        <span className={cn(badgeStyles.base, badgeStyles.success)}>
          {t(locale, health.data.mode.toUpperCase())}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-teal-100/80">
        {health.data.service} / {apiEndpointLabel}
      </p>
    </div>
  );
}
