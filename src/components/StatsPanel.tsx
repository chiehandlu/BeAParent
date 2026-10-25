import { STAT_KEYS, STAT_LABELS } from "@/game/stats";
import type { Stats } from "@/game/types";

export function StatsPanel({ stats }: { stats: Stats }) {
  return (
    <dl className="grid grid-cols-5 gap-2 text-center text-xs">
      {STAT_KEYS.map((key) => (
        <div key={key} className="rounded-xl bg-white/80 p-2">
          <dt className="text-neutral-500">{STAT_LABELS[key]}</dt>
          <dd className="text-lg font-bold">{stats[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
