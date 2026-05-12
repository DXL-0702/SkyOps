import type { DataSourceType } from "../../../api/mission";
import { badgeStyles, cn } from "../uiTokens";

type DataSourceBadgeProps = {
  sourceType: DataSourceType;
  label?: string;
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

export function DataSourceBadge({ sourceType, label }: DataSourceBadgeProps) {
  return (
    <span className={cn(badgeStyles.base, getSourceTone(sourceType), "whitespace-nowrap")}>
      {label ? `${label}: ` : ""}
      {sourceType.toUpperCase()}
    </span>
  );
}
