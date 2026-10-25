/** 五個評分維度；所有數值範圍 0–100。 */
export type StatKey =
  | "childWellbeing" // 孩子身心發展
  | "bond" // 親子關係
  | "selfCare" // 父母自我照顧
  | "finance" // 家庭經濟
  | "support"; // 伴侶與支持系統

export type Stats = Record<StatKey, number>;

export type StageId =
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

export interface Stage {
  id: StageId;
  /** 顯示名稱，例如「懷孕期」 */
  name: string;
  /** 孩子年齡區間描述，例如「0–1 歲」 */
  childAge: string;
  /** 這個階段父母扮演的角色，例如「全天候照顧者」 */
  parentRole: string;
  /** 心態轉變的一句話描述 */
  mindset: string;
  /** 島嶼在地圖上的位置（0–100 的百分比座標） */
  mapPosition: { x: number; y: number };
}

export type Effects = Partial<Record<StatKey, number>>;

export interface Choice {
  id: string;
  label: string;
  effects: Effects;
  /** 選擇後顯示的回饋文字 */
  feedback: string;
}

export interface GameEvent {
  id: string;
  stageId: StageId;
  title: string;
  description: string;
  choices: Choice[];
  /** 對應 content/sources.ts 的 id，用於「了解更多」 */
  sourceIds?: string[];
}

export interface ChoiceRecord {
  eventId: string;
  choiceId: string;
}

export interface GameState {
  stats: Stats;
  stageIndex: number;
  /** 本階段已完成的事件 id */
  completedEventIds: string[];
  history: ChoiceRecord[];
  finished: boolean;
}
