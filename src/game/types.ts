/** 五個評分維度；所有數值範圍 0–100。 */
export type StatKey =
  | "childWellbeing" // 孩子身心發展
  | "bond" // 親子關係
  | "selfCare" // 父母自我照顧
  | "finance" // 家庭經濟
  | "support"; // 伴侶與支持系統

export type Stats = Record<StatKey, number>;

export type IslandId =
  | "pregnancy"
  | "newborn"
  | "toddler"
  | "preschool"
  | "primary"
  | "adolescence"
  | "youngAdult"
  | "newFamily"
  | "emptyNest"
  | "farewell";

/** 內容審核狀態：draft 會在介面標示「內容草稿」。 */
export type ReviewStatus = "draft" | "reviewed";

export type Effects = Partial<Record<StatKey, number>>;

export interface Choice {
  id: string;
  label: string;
  effects: Effects;
  /** 選擇後顯示的回饋文字 */
  feedback: string;
}

/** 建築上的情境抉擇；有抉擇的建築是該島的必經任務。 */
export interface Dilemma {
  prompt: string;
  choices: Choice[];
}

export interface KeyStat {
  value: string;
  note: string;
}

/** 建築＝人生階段裡的一項任務（對應規格書的「細項」）。 */
export interface Building {
  id: string;
  name: string;
  /** 白話說明 */
  plain: string;
  /** 對象，例如「準爸媽」 */
  who: string;
  facts: string[];
  stats?: KeyStat[];
  dilemma?: Dilemma;
  /** 對應 content/sources.ts 的 id */
  sourceIds?: string[];
  review: ReviewStatus;
}

/** 島＝人生階段（對應規格書的「主題」）。 */
export interface Island {
  id: IslandId;
  number: number;
  name: string;
  /** 孩子年齡區間描述，例如「0–1 歲」 */
  childAge: string;
  /** 這個階段父母扮演的角色 */
  parentRole: string;
  /** 一句話摘要 */
  summary: string;
  /** 心態轉變（引言框） */
  mindset: string;
  /** 六角格軸向座標 [q, r] */
  axial: [number, number];
  buildings: Building[];
}

export type WalkerKind = "parent" | "partner" | "child" | "teen" | "grandparent" | "helper";

export type CarryKind =
  "heart" | "bottle" | "schoolbag" | "coin" | "letter" | "photo" | "medkit" | "seedling";

/** 協作線＝貫穿多個人生階段的主題。from / to 皆為陣列，可一對多。 */
export interface Flow {
  id: string;
  title: string;
  description: string;
  from: IslandId[];
  to: IslandId[];
  carry: CarryKind;
  walker: WalkerKind;
  bidirectional: boolean;
}

export interface ChoiceRecord {
  buildingId: string;
  choiceId: string;
}

export interface GameState {
  stats: Stats;
  /** 目前所在的島（ISLANDS 的索引） */
  stageIndex: number;
  history: ChoiceRecord[];
  finished: boolean;
}
