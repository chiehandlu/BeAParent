import type { CarryKind, Flow, IslandId, WalkerKind } from "@/game/types";

/** 協作線＝貫穿多個人生階段的主題，小人沿線搬運道具。 */
export const FLOWS: Flow[] = [
  {
    id: "F1",
    title: "健康的守護",
    description: "從產檢、疫苗到發展檢核，孩子的健康需要一路接力照顧。",
    from: ["pregnancy"],
    to: ["newborn", "toddler"],
    carry: "medkit",
    walker: "helper",
    bidirectional: false,
  },
  {
    id: "F2",
    title: "學習的旅程",
    description: "從遊戲中學習到升學抉擇，學習的主導權慢慢交回孩子手上。",
    from: ["preschool"],
    to: ["primary", "adolescence"],
    carry: "schoolbag",
    walker: "child",
    bidirectional: false,
  },
  {
    id: "F3",
    title: "家計的接力",
    description: "從育兒預備金到退休規劃，家庭經濟是每個階段的底氣。",
    from: ["pregnancy"],
    to: ["newborn", "primary", "youngAdult"],
    carry: "coin",
    walker: "parent",
    bidirectional: false,
  },
  {
    id: "F4",
    title: "伴侶與支持系統",
    description: "伴侶、長輩與社區，是讓父母撐下去的網。",
    from: ["newborn"],
    to: ["emptyNest"],
    carry: "heart",
    walker: "partner",
    bidirectional: true,
  },
  {
    id: "F5",
    title: "放手的練習",
    description: "從守住界線到尊重選擇，愛的形式隨孩子長大而改變。",
    from: ["toddler"],
    to: ["adolescence", "youngAdult"],
    carry: "seedling",
    walker: "teen",
    bidirectional: false,
  },
  {
    id: "F6",
    title: "世代的傳承",
    description: "孩子成家、迎來孫輩，回憶與價值一代一代傳下去。",
    from: ["newFamily"],
    to: ["emptyNest", "farewell"],
    carry: "photo",
    walker: "grandparent",
    bidirectional: true,
  },
];

export const WALKER_LABELS: Record<WalkerKind, string> = {
  parent: "家長",
  partner: "伴侶",
  child: "學童",
  teen: "青少年",
  grandparent: "長輩",
  helper: "醫護",
};

export const CARRY_LABELS: Record<CarryKind, string> = {
  heart: "愛心",
  bottle: "奶瓶",
  schoolbag: "書包",
  coin: "存錢筒",
  letter: "信",
  photo: "相簿",
  medkit: "醫藥箱",
  seedling: "樹苗",
};

export function getFlow(id: string): Flow | undefined {
  return FLOWS.find((f) => f.id === id);
}

export function flowIslands(flow: Flow): IslandId[] {
  return [...new Set([...flow.from, ...flow.to])];
}

export function flowsForIsland(islandId: IslandId): Flow[] {
  return FLOWS.filter((f) => flowIslands(f).includes(islandId));
}
