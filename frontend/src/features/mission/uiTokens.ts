export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const visualDirection = {
  surface: "professional low-altitude operations console",
  spatialLayer: "selective city command-center awareness",
  tone: "professional, restrained, readable, safety-first",
  dataPolicy: "mock/simulated data must be explicitly marked",
} as const;

export const layoutStyles = {
  page: "min-h-screen bg-zinc-950 text-zinc-100",
  shell: "mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8",
  header:
    "flex flex-col gap-4 border-b border-zinc-800 pb-5 lg:flex-row lg:items-center lg:justify-between",
  primaryGrid: "grid gap-5 xl:grid-cols-[1.05fr_1.55fr_0.9fr]",
  secondaryGrid: "grid gap-5 lg:grid-cols-[1fr_1fr]",
  evidenceGrid: "grid gap-5 xl:grid-cols-[1.05fr_1fr_1fr]",
  statusGrid: "grid gap-3 md:grid-cols-4",
} as const;

export const panelStyles = {
  base: "border border-zinc-800 bg-zinc-900/70 p-5",
  statusTile: "flex min-h-20 items-center gap-3 border border-zinc-800 bg-zinc-900/70 p-4",
  surface: "border border-zinc-800 bg-zinc-950/70",
  surfacePadded: "border border-zinc-800 bg-zinc-950/70 p-4",
  textSurface: "border border-zinc-800 bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-300",
  interactiveSurface:
    "border border-zinc-800 bg-zinc-950 text-zinc-300 transition hover:border-zinc-600",
} as const;

export const textStyles = {
  eyebrow: "text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500",
  label: "text-xs uppercase tracking-[0.14em] text-zinc-500",
  strongLabel: "text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500",
  title: "text-lg font-semibold text-white",
  body: "text-sm leading-6 text-zinc-300",
  subtle: "text-xs leading-5 text-zinc-400",
  muted: "text-xs leading-5 text-zinc-500",
} as const;

export const badgeStyles = {
  base: "border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
  brand: "border-teal-400/40 bg-teal-400/10 text-teal-200",
  mock: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  neutral: "border-zinc-700 bg-zinc-950 text-zinc-400",
  success: "border-teal-400/40 bg-teal-400/10 text-teal-200",
  warning: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  danger: "border-red-400/40 bg-red-400/10 text-red-100",
} as const;

export const bannerStyles = {
  loading: "border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300",
  success: "border border-teal-400/40 bg-teal-400/10 px-4 py-3 text-sm text-teal-100",
  danger: "border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100",
} as const;

export const buttonStyles = {
  base: "flex h-11 items-center justify-center gap-2 text-sm transition",
  primary: "bg-teal-300 px-4 font-semibold text-zinc-950 hover:bg-teal-200",
  incident: "border px-2 font-medium",
  incidentActive: "border-teal-300 bg-teal-300/15 text-teal-100",
  incidentIdle: "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600",
  disabled: "cursor-not-allowed opacity-50",
} as const;

export const metricStyles = {
  card: "border border-zinc-800 bg-zinc-950/70 p-4",
  compactCard: "border border-zinc-800 bg-zinc-950/70 p-3",
  value: "mt-2 break-words text-sm font-semibold leading-5 text-white",
} as const;

export const listStyles = {
  item: "flex items-start gap-2 border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm leading-5 text-zinc-300",
  numberedItem:
    "flex items-center gap-3 border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300",
  number:
    "flex h-6 w-6 items-center justify-center bg-teal-300/15 text-xs font-semibold text-teal-200",
  dot: "mt-2 h-1.5 w-1.5 shrink-0 bg-teal-300",
} as const;

export const progressStyles = {
  track: "mt-3 h-2 bg-zinc-800",
  fill: "h-2 bg-teal-300",
} as const;

export const riskToneStyles = {
  low: "border-teal-400/40 bg-teal-400/10 text-teal-200",
  medium: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  high: "border-red-400/40 bg-red-400/10 text-red-200",
  critical: "border-red-500/60 bg-red-500/15 text-red-100",
  default: "border-zinc-700 bg-zinc-950 text-zinc-400",
} as const;

export const iconBoxStyles = {
  panel: "flex h-10 w-10 items-center justify-center border border-teal-300/30 bg-teal-300/10 text-teal-200",
  status: "flex h-9 w-9 items-center justify-center border border-zinc-700 bg-zinc-950 text-teal-200",
} as const;

export const formStyles = {
  textarea:
    "mt-4 min-h-36 w-full resize-none border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100 outline-none transition focus:border-teal-400",
} as const;

export const commandLayerStyles = {
  mapSurface: "border border-zinc-800 bg-zinc-950/80",
  routeLine: "stroke-teal-300",
  replannedRouteLine: "stroke-amber-300",
  restrictedZone: "border-red-400/40 bg-red-400/10 text-red-100",
  riskZone: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  launchPoint: "bg-teal-300 text-zinc-950",
  incidentPoint: "bg-red-400 text-zinc-950",
  inactiveSegment: "border-zinc-700 bg-zinc-900/80 text-zinc-400",
  activeSegment: "border-teal-400/40 bg-teal-400/10 text-teal-100",
  makeupSegment: "border-amber-400/40 bg-amber-400/10 text-amber-100",
} as const;
