import { ISLANDS } from "@/content/islands";
import { INITIAL_STATS, STAT_KEYS, clampStat } from "./stats";
import type { Building, Effects, GameState, Island, Stats } from "./types";

export function createInitialState(): GameState {
  return {
    stats: { ...INITIAL_STATS },
    stageIndex: 0,
    history: [],
    finished: false,
  };
}

export function applyEffects(stats: Stats, effects: Effects): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) {
    const delta = effects[key];
    if (delta !== undefined) next[key] = clampStat(next[key] + delta);
  }
  return next;
}

export function currentIsland(state: GameState): Island {
  return ISLANDS[state.stageIndex];
}

export type IslandStatus = "visited" | "current" | "locked";

export function islandStatus(state: GameState, islandIndex: number): IslandStatus {
  if (state.finished || islandIndex < state.stageIndex) return "visited";
  return islandIndex === state.stageIndex ? "current" : "locked";
}

export function choiceFor(state: GameState, buildingId: string) {
  return state.history.find((r) => r.buildingId === buildingId);
}

/** 目前這座島上還沒做出抉擇的任務。 */
export function pendingTasks(state: GameState): Building[] {
  if (state.finished) return [];
  return currentIsland(state).buildings.filter((b) => b.dilemma && !choiceFor(state, b.id));
}

export function chooseOption(state: GameState, buildingId: string, choiceId: string): GameState {
  if (choiceFor(state, buildingId)) return state;
  const building = pendingTasks(state).find((b) => b.id === buildingId);
  const choice = building?.dilemma?.choices.find((c) => c.id === choiceId);
  if (!choice) return state;
  return {
    ...state,
    stats: applyEffects(state.stats, choice.effects),
    history: [...state.history, { buildingId, choiceId }],
  };
}

export function canAdvance(state: GameState): boolean {
  return !state.finished && pendingTasks(state).length === 0;
}

/** 啟航前往下一座島；完成最後一座島（告別）後遊戲結束。 */
export function advanceStage(state: GameState): GameState {
  if (!canAdvance(state)) return state;
  const nextIndex = state.stageIndex + 1;
  if (nextIndex >= ISLANDS.length) return { ...state, finished: true };
  return { ...state, stageIndex: nextIndex };
}
