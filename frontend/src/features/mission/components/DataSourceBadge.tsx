import type { DataSourceType } from "../../../api/mission";
import type { Locale } from "../i18n";
import { t } from "../i18n";
import { badgeStyles, cn } from "../uiTokens";

type DataSourceBadgeProps = {
  sourceType: DataSourceType;
  label?: string;
  locale?: Locale;
};

function getSourceTone(sourceType: DataSourceType): string {
  if (sourceType === "real") {
    return badgeStyles.success;
  }

  if (sourceType === "simulated") {
    return badgeStyles.warning;
  }

  return badgeStyles.mock;
}

export function DataSourceBadge({ sourceType, label, locale = "en" }: DataSourceBadgeProps) {
  return (
    <span className={cn(badgeStyles.base, getSourceTone(sourceType), "whitespace-nowrap")}>
      {label ? `${t(locale, label)}: ` : ""}
      {t(locale, sourceType.toUpperCase())}
    </span>
  );
}
