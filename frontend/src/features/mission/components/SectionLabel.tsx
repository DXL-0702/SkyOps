import { textStyles } from "../uiTokens";

export function SectionLabel({ label }: { label: string }) {
  return <p className={textStyles.strongLabel}>{label}</p>;
}
