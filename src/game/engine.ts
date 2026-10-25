import { STAGES } from "@/content/stages";
import { getEventsForStage } from "@/content/events";
import { INITIAL_STATS, STAT_KEYS, clampStat } from "./stats";
import type { Effects, GameEvent, GameState, Stats } from "./types";

export function createInitialState(): GameState {
  return {
    stats: { ...INITIAL_STATS },
    stageIndex: 0,
    completedEventIds: [],
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

export function currentStage(state: GameState) {
  return STAGES[state.stageIndex];
}

export function pendingEvents(state: GameState): GameEvent[] {
  const stage = currentStage(state);
  if (!stage) return [];
  return getEventsForStage(stage.id).filter((e) => !state.completedEventIds.includes(e.id));
}

export function chooseOption(state: GameState, eventId: string, choiceId: string): GameState {
  if (state.finished || state.completedEventIds.includes(eventId)) return state;
  const event = pendingEvents(state).find((e) => e.id === eventId);
  const choice = event?.choices.find((c) => c.id === choiceId);
  if (!event || !choice) return state;
  return {
    ...state,
    stats: applyEffects(state.stats, choice.effects),
    completedEventIds: [...state.completedEventIds, eventId],
    history: [...state.history, { eventId, choiceId }],
  };
}

export function canAdvance(state: GameState): boolean {
  return !state.finished && pendingEvents(state).length === 0;
}

/** 前往下一座島；走完最後一個階段（辭世）後遊戲結束。 */
export function advanceStage(state: GameState): GameState {
  if (!canAdvance(state)) return state;
  const nextIndex = state.stageIndex + 1;
  if (nextIndex >= STAGES.length) return { ...state, finished: true };
  return { ...state, stageIndex: nextIndex, completedEventIds: [] };
}
