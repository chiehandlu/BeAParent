import { describe, expect, it } from "vitest";
import { formatHour, lifeHour, timeOfDayLabel } from "./lifeClock";

describe("lifeClock", () => {
  it("runs from dawn at the first stage to night at the last", () => {
    expect(timeOfDayLabel(lifeHour(0, 10))).toBe("清晨");
    expect(timeOfDayLabel(lifeHour(9, 10))).toBe("夜晚");
    expect(lifeHour(4, 10)).toBeGreaterThan(lifeHour(3, 10));
  });

  it("formats hours as HH:MM", () => {
    expect(formatHour(5.5)).toBe("05:30");
    expect(formatHour(22)).toBe("22:00");
  });
});
