import { describe, expect, it } from "vitest";
import { STAGES } from "@/content/stages";
import {
  advanceStage,
  applyEffects,
  canAdvance,
  chooseOption,
  createInitialState,
  pendingEvents,
} from "./engine";
import { INITIAL_STATS } from "./stats";

describe("engine", () => {
  it("clamps stats to 0–100", () => {
    const stats = applyEffects(INITIAL_STATS, { bond: 999, finance: -999 });
    expect(stats.bond).toBe(100);
    expect(stats.finance).toBe(0);
  });

  it("requires finishing a stage's events before advancing", () => {
    let state = createInitialState();
    expect(canAdvance(state)).toBe(false);
    for (const event of pendingEvents(state)) {
      state = chooseOption(state, event.id, event.choices[0].id);
    }
    expect(canAdvance(state)).toBe(true);
    expect(advanceStage(state).stageIndex).toBe(1);
  });

  it("ignores repeated choices for the same event", () => {
    const state = createInitialState();
    const [event] = pendingEvents(state);
    const once = chooseOption(state, event.id, event.choices[0].id);
    expect(chooseOption(once, event.id, event.choices[0].id)).toBe(once);
  });

  it("finishes after the final stage", () => {
    let state = createInitialState();
    for (let i = 0; i < STAGES.length; i++) {
      for (const event of pendingEvents(state)) {
        state = chooseOption(state, event.id, event.choices[0].id);
      }
      state = advanceStage(state);
    }
    expect(state.finished).toBe(true);
  });
});
