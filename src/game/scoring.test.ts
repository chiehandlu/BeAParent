import { describe, expect, it } from "vitest";
import { SCORE_WEIGHTS, computeScore } from "./scoring";
import { INITIAL_STATS } from "./stats";

describe("scoring", () => {
  it("weights sum to 1", () => {
    const sum = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1);
  });

  it("gives the initial stats a score of 50", () => {
    const result = computeScore(INITIAL_STATS);
    expect(result.total).toBe(50);
    expect(result.dimensions).toHaveLength(5);
  });
});
