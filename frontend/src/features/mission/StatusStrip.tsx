import { Activity, CircleDot, GitBranch, MapPinned } from "lucide-react";

import { StatusTile } from "./components/StatusTile";
import type { MissionConsoleCopy } from "./i18n";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import type { HealthState, MissionCycleState } from "./types";
import { layoutStyles } from "./uiTokens";

type StatusStripProps = {
  health: HealthState;
  missionCycle: MissionCycleState;
  copy: MissionConsoleCopy["status"];
  locale: Locale;
};

export function StatusStrip({ health, missionCycle, copy, locale }: StatusStripProps) {
  const missionStatus =
    missionCycle.status === "ready"
      ? copy.loopReady
      : missionCycle.status === "failed"
        ? copy.loopFailed
        : missionCycle.status === "loading"
          ? copy.loopRunning
          : copy.loopIdle;

  return (
    <section className={layoutStyles.statusGrid}>
      <StatusTile label={copy.backend} value={t(locale, health.status)} icon={Activity} />
      <StatusTile label={copy.scenario} value={copy.scenarioValue} icon={MapPinned} />
      <StatusTile label={copy.dataMode} value={copy.dataModeValue} icon={CircleDot} />
      <StatusTile label={copy.loop} value={missionStatus} icon={GitBranch} />
    </section>
  );
}
