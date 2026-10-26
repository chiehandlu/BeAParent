"use client";

import { useState } from "react";
import { FLOWS, ISLANDS } from "@/content/world";
import { islandStatus } from "@/game/engine";
import { type Selection, select } from "@/lib/selection";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { FLOW_COLORS } from "../scene/palette";

const STATUS_LABEL = { visited: "已走過", current: "目前所在", locked: "尚未抵達" };
const TASK_COUNT = ISLANDS.reduce((n, i) => n + i.buildings.length, 0);

export function IndexPanel({ selection }: { selection: Selection }) {
  const game = useGameStore();
  const { panelOpen, toggle } = useUiStore();
  const [tab, setTab] = useState<"islands" | "flows">("islands");

  if (!panelOpen) {
    return (
      <button
        type="button"
        onClick={() => toggle("panelOpen")}
        className="glass-card absolute right-3 bottom-3 z-30 px-4 py-3 text-sm font-medium md:top-3 md:bottom-auto"
      >
        清單
      </button>
    );
  }

  return (
    <aside className="glass-card absolute inset-x-3 bottom-3 z-30 flex max-h-[45vh] flex-col overflow-hidden md:inset-x-auto md:top-3 md:right-3 md:bottom-3 md:max-h-none md:w-[min(26rem,33vw)]">
      <header className="flex items-start justify-between gap-2 p-5 pb-3">
        <div>
          <p className="mono-label">THE LIFE INDEX</p>
          <h2 className="mt-1 text-2xl font-bold">為人父母的十座島</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {ISLANDS.length} 個人生階段 / {TASK_COUNT} 項任務
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggle("panelOpen")}
          className="icon-button"
          aria-label="收合清單"
        >
          ×
        </button>
      </header>
      <div role="tablist" className="flex gap-1 px-5">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "islands"}
          onClick={() => setTab("islands")}
          className="tab"
        >
          島嶼
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "flows"}
          onClick={() => setTab("flows")}
          className="tab"
        >
          協作線 {FLOWS.length}
        </button>
      </div>
      <ol className="flex-1 overflow-y-auto p-3">
        {tab === "islands"
          ? ISLANDS.map((island, index) => {
              const status = islandStatus(game, index);
              return (
                <li key={island.id}>
                  <button
                    type="button"
                    data-selected={selection?.kind === "island" && selection.id === island.id}
                    onClick={() => select({ kind: "island", id: island.id })}
                    className="list-row"
                  >
                    <span className="index-number">{String(island.number).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="block font-medium">{island.name}</span>
                      <span className="text-xs text-neutral-500">
                        {island.childAge}・{island.buildings.length} 項任務
                      </span>
                    </span>
                    <span data-status={status} className="status-pill">
                      {STATUS_LABEL[status]}
                    </span>
                  </button>
                </li>
              );
            })
          : FLOWS.map((flow) => (
              <li key={flow.id}>
                <button
                  type="button"
                  data-selected={selection?.kind === "flow" && selection.id === flow.id}
                  onClick={() => select({ kind: "flow", id: flow.id })}
                  className="list-row"
                >
                  <span className="flow-badge" style={{ background: FLOW_COLORS[flow.id] }}>
                    {flow.id}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{flow.title}</span>
                    <span className="text-xs text-neutral-500">{flow.description}</span>
                  </span>
                </button>
              </li>
            ))}
      </ol>
    </aside>
  );
}
