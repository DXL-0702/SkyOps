import type { Locale } from "../i18n";
import { t } from "../i18n";
import { cn, riskToneStyles } from "../uiTokens";

function getRiskBadgeClass(level: string): string {
  if (level === "critical") {
    return riskToneStyles.critical;
  }

  if (level === "high") {
    return riskToneStyles.high;
  }

  if (level === "medium") {
    return riskToneStyles.medium;
  }

  if (level === "low") {
    return riskToneStyles.low;
  }

  return riskToneStyles.default;
}

export function RiskBadge({ level, locale = "en" }: { level: string; locale?: Locale }) {
  return (
    <span
      className={cn(
        "border px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        getRiskBadgeClass(level),
      )}
    >
      {t(locale, level)}
    </span>
  );
}
