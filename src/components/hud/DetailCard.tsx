"use client";

import { useRouter } from "next/navigation";
import { CARRY_LABELS, WALKER_LABELS, flowIslands, flowsForIsland, getFlow } from "@/content/flows";
import { findBuilding, getIsland } from "@/content/islands";
import { SOURCES } from "@/content/sources";
import { ISLANDS } from "@/content/world";
import { canAdvance, choiceFor, islandStatus } from "@/game/engine";
import type { Building, Flow, Island } from "@/game/types";
import { type Selection, select } from "@/lib/selection";
import { playSound } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";
import { FLOW_COLORS } from "../scene/palette";
import { DilemmaPanel } from "./DilemmaPanel";

/** 左側詳情卡：依選取顯示島／建築／協作線三種樣式。 */
export function DetailCard({ selection }: { selection: Selection }) {
  let body: React.ReactNode = null;
  if (selection?.kind === "island") {
    const island = getIsland(selection.id);
    if (island) body = <IslandCard island={island} />;
  } else if (selection?.kind === "building") {
    const found = findBuilding(selection.id);
    if (found) body = <BuildingCard island={found.island} building={found.building} />;
  } else if (selection?.kind === "flow") {
    const flow = getFlow(selection.id);
    if (flow) body = <FlowCard flow={flow} />;
  }
  if (!body) return null;

  return (
    <section className="glass-card absolute top-28 left-3 z-40 max-h-[calc(100%-8rem)] w-[min(24rem,calc(100%-1.5rem))] overflow-y-auto p-5 max-md:top-auto max-md:bottom-3 max-md:max-h-[60vh]">
      <button
        type="button"
        onClick={() => select(null)}
        className="icon-button float-right"
        aria-label="關閉"
      >
        ×
      </button>
      {body}
    </section>
  );
}

function FlowChips({ flows }: { flows: Flow[] }) {
  if (flows.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="mono-label">相關協作線</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {flows.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => select({ kind: "flow", id: f.id })}
            className="chip"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: FLOW_COLORS[f.id] }} />
            {f.id} {f.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function IslandCard({ island }: { island: Island }) {
  const game = useGameStore();
  const router = useRouter();
  const index = ISLANDS.indexOf(island);
  const status = islandStatus(game, index);
  const isLast = index === ISLANDS.length - 1;

  const sail = () => {
    game.advance();
    playSound("travel");
    if (isLast) router.push("/result");
    else select({ kind: "island", id: ISLANDS[index + 1].id });
  };

  return (
    <article>
      <p className="mono-label">
        ISLAND {String(island.number).padStart(2, "0")}・{island.childAge}
      </p>
      <h2 className="mt-1 text-2xl font-bold">{island.name}</h2>
      <p className="mt-2 text-neutral-700">{island.summary}</p>
      <blockquote className="mt-3 border-l-4 border-accent pl-3 text-neutral-700 italic">
        {island.mindset}
      </blockquote>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="tag">你的角色：{island.parentRole}</span>
        <span className="tag">{island.buildings.length} 項任務</span>
      </div>

      {status === "locked" ? (
        <p className="mt-4 rounded-xl bg-neutral-100 p-3 text-sm text-neutral-600">
          還沒抵達這座島。完成目前島上的任務後，就能啟航前往下一站。
        </p>
      ) : null}

      <ul className="mt-4 divide-y divide-neutral-200/70">
        {island.buildings.map((b) => {
          const done = Boolean(choiceFor(game, b.id));
          const label = b.dilemma
            ? done
              ? "已抉擇"
              : status === "locked"
                ? "任務"
                : "待抉擇"
            : "知識";
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => select({ kind: "building", id: b.id })}
                className="flex w-full items-center gap-2 py-2 text-left"
              >
                <span className="flex-1">{b.name}</span>
                <span
                  data-pending={label === "待抉擇"}
                  className="tag data-[pending=true]:bg-accent data-[pending=true]:text-white"
                >
                  {label}
                </span>
                <span aria-hidden>›</span>
              </button>
            </li>
          );
        })}
      </ul>

      {status === "current" && (
        <button
          type="button"
          className="btn-primary mt-4 w-full"
          disabled={!canAdvance(game)}
          onClick={sail}
        >
          {canAdvance(game)
            ? isLast
              ? "回顧這一生"
              : "啟航前往下一座島"
            : "完成待抉擇任務後即可啟航"}
        </button>
      )}
      <FlowChips flows={flowsForIsland(island.id)} />
    </article>
  );
}

function BuildingCard({ island, building }: { island: Island; building: Building }) {
  const game = useGameStore();
  const status = islandStatus(game, ISLANDS.indexOf(island));
  const record = choiceFor(game, building.id);
  const picked = building.dilemma?.choices.find((c) => c.id === record?.choiceId);

  return (
    <article>
      <button
        type="button"
        onClick={() => select({ kind: "island", id: island.id })}
        className="mono-label hover:underline"
      >
        {String(island.number).padStart(2, "0")} {island.name} ›
      </button>
      <h2 className="mt-1 text-2xl font-bold">{building.name}</h2>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="tag">對象：{building.who}</span>
        {building.review === "draft" && (
          <span className="tag bg-amber-100 text-amber-800">內容草稿</span>
        )}
      </div>
      <p className="mt-3 text-neutral-700">{building.plain}</p>

      {building.stats && building.stats.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {building.stats.map((s) => (
            <div key={s.value} className="rounded-xl bg-sand/40 p-3">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-neutral-600">{s.note}</p>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
        {building.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      {building.dilemma && (
        <div className="mt-4">
          {picked ? (
            <div className="rounded-xl bg-sand/40 p-4 text-sm">
              <p className="font-medium">你的選擇：{picked.label}</p>
              <p className="mt-1 text-neutral-700">{picked.feedback}</p>
            </div>
          ) : status === "current" ? (
            <DilemmaPanel building={building} />
          ) : (
            <p className="rounded-xl bg-neutral-100 p-3 text-sm text-neutral-600">
              抵達這座島後才能做這個抉擇。
            </p>
          )}
        </div>
      )}

      {building.sourceIds && building.sourceIds.length > 0 && (
        <footer className="mt-4 text-xs text-neutral-500">
          了解更多：
          {building.sourceIds.map((id) => {
            const source = SOURCES[id];
            return (
              <a
                key={id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="ml-2 underline"
              >
                {source.publisher}・{source.title}
                {source.verifiedAt === null && "（待查證）"}
              </a>
            );
          })}
        </footer>
      )}
    </article>
  );
}

function FlowCard({ flow }: { flow: Flow }) {
  const islands = flowIslands(flow).map((id) => getIsland(id)!);
  const names = (ids: string[]) => ids.map((id) => getIsland(id)?.name).join("、");
  return (
    <article>
      <span className="flow-badge" style={{ background: FLOW_COLORS[flow.id] }}>
        {flow.id}
      </span>
      <h2 className="mt-2 text-2xl font-bold">{flow.title}</h2>
      <p className="mt-2 text-neutral-700">{flow.description}</p>
      <p className="mt-3 text-sm">
        {names(flow.from)} {flow.bidirectional ? "⇄" : "→"} {names(flow.to)}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-sand/40 p-3">
          <p className="mono-label">搬運道具</p>
          <p className="mt-1 font-medium">{CARRY_LABELS[flow.carry]}</p>
        </div>
        <div className="rounded-xl bg-sand/40 p-3">
          <p className="mono-label">角色</p>
          <p className="mt-1 font-medium">{WALKER_LABELS[flow.walker]}</p>
        </div>
      </div>
      <p className="mono-label mt-4">關聯島嶼</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {islands.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => select({ kind: "island", id: i.id })}
            className="chip"
          >
            {String(i.number).padStart(2, "0")} {i.name}
          </button>
        ))}
      </div>
    </article>
  );
}
