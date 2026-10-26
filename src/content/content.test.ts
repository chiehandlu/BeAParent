import { describe, expect, it } from "vitest";
import { STAT_KEYS } from "@/game/stats";
import { FLOWS } from "./flows";
import { ISLANDS } from "./islands";
import { SOURCES } from "./sources";

/** 內容規則（見 CLAUDE.md）的自動檢查。 */
describe("content", () => {
  const buildings = ISLANDS.flatMap((i) => i.buildings);

  it("has unique ids", () => {
    const ids = [
      ...ISLANDS.map((i) => i.id),
      ...buildings.map((b) => b.id),
      ...FLOWS.map((f) => f.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("numbers islands in order and places them on distinct hexes", () => {
    ISLANDS.forEach((island, i) => expect(island.number).toBe(i + 1));
    const coords = ISLANDS.map((i) => i.axial.join(","));
    expect(new Set(coords).size).toBe(coords.length);
  });

  it("gives every island at least one dilemma so the journey is playable", () => {
    for (const island of ISLANDS) {
      expect(
        island.buildings.some((b) => b.dilemma),
        island.id,
      ).toBe(true);
    }
  });

  it("keeps dilemmas within 2–4 choices and ±10 per stat", () => {
    for (const b of buildings) {
      if (!b.dilemma) continue;
      expect(b.dilemma.choices.length, b.id).toBeGreaterThanOrEqual(2);
      expect(b.dilemma.choices.length, b.id).toBeLessThanOrEqual(4);
      for (const c of b.dilemma.choices) {
        for (const [key, delta] of Object.entries(c.effects)) {
          expect(STAT_KEYS).toContain(key);
          expect(Math.abs(delta), `${b.id}/${c.id}/${key}`).toBeLessThanOrEqual(10);
        }
      }
    }
  });

  it("references only registered sources", () => {
    for (const b of buildings) {
      for (const id of b.sourceIds ?? []) expect(SOURCES[id], `${b.id} → ${id}`).toBeDefined();
    }
  });

  it("connects flows to existing islands", () => {
    const islandIds = ISLANDS.map((i) => i.id);
    for (const f of FLOWS) {
      for (const id of [...f.from, ...f.to]) expect(islandIds, f.id).toContain(id);
    }
  });
});
