import { CheckCircle2 } from "lucide-react";

import { SectionLabel } from "./SectionLabel";

type ActionListProps = {
  title: string;
  items: string[];
  tone: "teal" | "amber";
};

export function ActionList({ title, items, tone }: ActionListProps) {
  const color = tone === "teal" ? "text-teal-200" : "text-amber-200";

  return (
    <div>
      <SectionLabel label={title} />
      <div className="mt-3 grid gap-2">
        {items.slice(0, 4).map((item) => (
          <div
            className="flex items-start gap-2 border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm leading-5 text-zinc-300"
            key={item}
          >
            <CheckCircle2 aria-hidden="true" className={`mt-0.5 shrink-0 ${color}`} size={15} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
