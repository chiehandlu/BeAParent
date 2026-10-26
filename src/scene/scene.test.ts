import { describe, expect, it } from "vitest";
import { ISLANDS } from "@/content/islands";
import { FLOWS } from "@/content/flows";
import { ISLAND_CENTERS, ISLAND_ORDER } from "@/content/world";
import { ISLAND_GRID_SIZE, axialToWorld, distance, freeSlots } from "./layout";
import { lerpColor, lightingAt } from "./lighting";
import {
  HANDOFF_SECONDS,
  buildRoutes,
  createWalkers,
  isCarrying,
  positionOnRoute,
  stepWalker,
} from "./walkers";

describe("layout", () => {
  it("converts axial coordinates (pointy orientation)", () => {
    expect(axialToWorld([0, 0], 1)).toEqual([0, 0]);
    const [x, z] = axialToWorld([0, 1], 2);
    expect(x).toBeCloseTo(Math.sqrt(3));
    expect(z).toBeCloseTo(3);
  });

  it("chains consecutive islands as hex neighbours so bridges stay short", () => {
    const step = ISLAND_GRID_SIZE * Math.sqrt(3);
    for (let i = 1; i < ISLAND_ORDER.length; i++) {
      const d = distance(ISLAND_CENTERS[ISLAND_ORDER[i - 1]], ISLAND_CENTERS[ISLAND_ORDER[i]]);
      expect(d, ISLAND_ORDER[i]).toBeCloseTo(step);
    }
  });

  it("keeps building slots off the walking paths", () => {
    ISLANDS.forEach((island, i) => {
      const neighbors = [ISLANDS[i - 1], ISLANDS[i + 1]].filter(Boolean);
      const slots = freeSlots(island, neighbors);
      expect(slots.length).toBe(6 - neighbors.length);
      expect(slots.length).toBeGreaterThanOrEqual(island.buildings.length);
    });
  });
});

describe("walkers", () => {
  const routes = buildRoutes(FLOWS, ISLAND_ORDER, ISLAND_CENTERS);

  it("builds one route per from×to pair, passing through intermediate islands", () => {
    const pairs = FLOWS.reduce((n, f) => n + f.from.length * f.to.length, 0);
    expect(routes).toHaveLength(pairs);
    const f4 = routes.find((r) => r.flowId === "F4")!;
    const span = Math.abs(ISLAND_ORDER.indexOf(f4.to) - ISLAND_ORDER.indexOf(f4.from));
    expect(f4.waypoints).toHaveLength(span + 1);
  });

  it("walks to the end, hands off, then departs back", () => {
    const route = routes[0];
    let [w] = createWalkers([route], 1);
    w = { ...w, progress: 0.99, direction: 1 };
    const arrived = stepWalker(w, route, 10);
    expect(arrived.event?.type).toBe("arrive");
    expect(arrived.state.phase).toBe("handoff");
    expect(isCarrying(arrived.state, route)).toBe(false);

    const departed = stepWalker(arrived.state, route, HANDOFF_SECONDS + 0.01);
    expect(departed.event?.type).toBe("depart");
    expect(departed.state.direction).toBe(-1);
  });

  it("interpolates positions along the route", () => {
    const route = routes[0];
    expect(positionOnRoute(route, 0)).toEqual(route.waypoints[0]);
    expect(positionOnRoute(route, 1)).toEqual(route.waypoints[route.waypoints.length - 1]);
  });
});

describe("lighting", () => {
  it("interpolates colours", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("is darker at night than at noon", () => {
    expect(lightingAt(22).sunIntensity).toBeLessThan(lightingAt(14).sunIntensity);
  });
});
