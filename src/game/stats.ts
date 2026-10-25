import type { StatKey, Stats } from "./types";

export const STAT_KEYS: StatKey[] = ["childWellbeing", "bond", "selfCare", "finance", "support"];

export const STAT_LABELS: Record<StatKey, string> = {
  childWellbeing: "孩子身心",
  bond: "親子關係",
  selfCare: "自我照顧",
  finance: "家庭經濟",
  support: "支持系統",
};

export const STAT_MIN = 0;
export const STAT_MAX = 100;

export const INITIAL_STATS: Stats = {
  childWellbeing: 50,
  bond: 50,
  selfCare: 50,
  finance: 50,
  support: 50,
};

export function clampStat(value: number): number {
  return Math.min(STAT_MAX, Math.max(STAT_MIN, value));
}
