import { describe, expect, it } from "vitest";
import { ISLANDS } from "@/content/islands";
import {
  advanceStage,
  applyEffects,
  canAdvance,
  chooseOption,
  createInitialState,
  islandStatus,
  pendingTasks,
} from "./engine";
import { INITIAL_STATS } from "./stats";
import type { GameState } from "./types";

function completeCurrentIsland(state: GameState): GameState {
  for (const b of pendingTasks(state)) state = chooseOption(state, b.id, b.dilemma!.choices[0].id);
  return state;
}

describe("engine", () => {
  it("clamps stats to 0–100", () => {
    const stats = applyEffects(INITIAL_STATS, { bond: 999, finance: -999 });
    expect(stats.bond).toBe(100);
    expect(stats.finance).toBe(0);
  });

  it("requires finishing the island's dilemmas before sailing on", () => {
    let state = createInitialState();
    expect(canAdvance(state)).toBe(false);
    expect(advanceStage(state)).toBe(state);
    state = completeCurrentIsland(state);
    expect(canAdvance(state)).toBe(true);
    expect(advanceStage(state).stageIndex).toBe(1);
  });

  it("ignores repeated choices and choices on locked islands", () => {
    const state = createInitialState();
    const [task] = pendingTasks(state);
    const once = chooseOption(state, task.id, task.dilemma!.choices[0].id);
    expect(chooseOption(once, task.id, task.dilemma!.choices[1].id)).toBe(once);

    const lockedTask = ISLANDS[1].buildings.find((b) => b.dilemma)!;
    expect(chooseOption(state, lockedTask.id, lockedTask.dilemma!.choices[0].id)).toBe(state);
  });

  it("reports island status relative to progress", () => {
    const state = advanceStage(completeCurrentIsland(createInitialState()));
    expect(islandStatus(state, 0)).toBe("visited");
    expect(islandStatus(state, 1)).toBe("current");
    expect(islandStatus(state, 2)).toBe("locked");
  });

  it("finishes after the final island", () => {
    let state = createInitialState();
    for (let i = 0; i < ISLANDS.length; i++) state = advanceStage(completeCurrentIsland(state));
    expect(state.finished).toBe(true);
    expect(pendingTasks(state)).toEqual([]);
  });
});
