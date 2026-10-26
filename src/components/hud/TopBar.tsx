"use client";

import { ISLANDS } from "@/content/world";
import { formatHour, lifeHour, timeOfDayLabel } from "@/game/lifeClock";
import { STAT_KEYS, STAT_LABELS } from "@/game/stats";
import { select } from "@/lib/selection";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";

const TOGGLES = [
  { key: "showLabels", label: "名牌" },
  { key: "showCarry", label: "搬運" },
  { key: "showFlows", label: "協作線" },
  { key: "paused", label: "暫停" },
] as const;

export function TopBar() {
  const { stats, stageIndex, finished } = useGameStore();
  const ui = useUiStore();
  const hour = lifeHour(finished ? ISLANDS.length - 1 : stageIndex, ISLANDS.length);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col items-center gap-2 p-3">
      <div className="glass-card pointer-events-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2">
        <span className="mono-label" title="人生時鐘：越往後的人生階段，天色越晚">
          人生時鐘 {formatHour(hour)}・{timeOfDayLabel(hour)}
        </span>
        <dl className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
          {STAT_KEYS.map((key) => (
            <div key={key} className="flex items-baseline gap-1 whitespace-nowrap">
              <dt className="text-neutral-500">{STAT_LABELS[key]}</dt>
              <dd className="font-bold tabular-nums">{stats[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="glass-card pointer-events-auto flex gap-1 p-1">
        {TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={key === "paused" ? ui.paused : ui[key]}
            onClick={() => ui.toggle(key)}
            className="tool-button"
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => select(null)}
          className="tool-button"
          aria-pressed={false}
        >
          全景
        </button>
      </div>
    </div>
  );
}
