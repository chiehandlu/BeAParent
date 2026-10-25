import { STAT_KEYS, STAT_LABELS } from "./stats";
import type { StatKey, Stats } from "./types";

export interface ScoreResult {
  total: number;
  dimensions: { key: StatKey; label: string; value: number }[];
  title: string;
  comment: string;
}

/** 各維度權重，總和為 1。 */
export const SCORE_WEIGHTS: Record<StatKey, number> = {
  childWellbeing: 0.25,
  bond: 0.25,
  selfCare: 0.2,
  finance: 0.15,
  support: 0.15,
};

const TITLES: { min: number; title: string; comment: string }[] = [
  { min: 85, title: "溫暖的燈塔", comment: "你陪伴孩子走過每一段航程，也沒有忘記照顧自己。" },
  { min: 70, title: "可靠的港灣", comment: "雖然偶有風浪，你始終是孩子可以回來的地方。" },
  { min: 50, title: "努力的舵手", comment: "你在摸索中前進，每個選擇都是成長。" },
  { min: 0, title: "迷航的旅人", comment: "教養沒有標準答案，換個方式再走一次吧。" },
];

export function computeScore(stats: Stats): ScoreResult {
  const total = Math.round(
    STAT_KEYS.reduce((sum, key) => sum + stats[key] * SCORE_WEIGHTS[key], 0),
  );
  const { title, comment } = TITLES.find((t) => total >= t.min)!;
  return {
    total,
    dimensions: STAT_KEYS.map((key) => ({
      key,
      label: STAT_LABELS[key],
      value: stats[key],
    })),
    title,
    comment,
  };
}
