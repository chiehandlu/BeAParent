"use client";

import { create } from "zustand";

/** 純介面開關（不存檔）：對應規格書的圖層工具列。 */
interface UiStore {
  showLabels: boolean;
  showCarry: boolean;
  showFlows: boolean;
  paused: boolean;
  panelOpen: boolean;
  toggle: (key: "showLabels" | "showCarry" | "showFlows" | "paused" | "panelOpen") => void;
}

export const useUiStore = create<UiStore>()((set) => ({
  showLabels: true,
  showCarry: true,
  showFlows: true,
  // 系統設定「減少動態效果」時，小人與標記預設暫停
  paused:
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  panelOpen: true,
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
}));
