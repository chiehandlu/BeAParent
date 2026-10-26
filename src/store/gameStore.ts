"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { advanceStage, chooseOption, createInitialState } from "@/game/engine";
import type { GameState } from "@/game/types";

interface GameStore extends GameState {
  choose: (buildingId: string, choiceId: string) => void;
  advance: () => void;
  reset: () => void;
}

const pickState = (s: GameState): GameState => ({
  stats: s.stats,
  stageIndex: s.stageIndex,
  history: s.history,
  finished: s.finished,
});

/** UI 層只呼叫這些 action；遊戲規則一律寫在 src/game。 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      choose: (buildingId, choiceId) => set(chooseOption(pickState(get()), buildingId, choiceId)),
      advance: () => set(advanceStage(pickState(get()))),
      reset: () => set(createInitialState()),
    }),
    {
      name: "beaparent-save",
      // v2：事件改掛在建築上，進度改由 history 推導
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => pickState(s),
      migrate: (persisted, version) =>
        version < 2 ? createInitialState() : (persisted as GameState),
    },
  ),
);

/** localStorage 讀取完成前回傳 false，避免 SSR hydration 不一致。 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useGameStore.persist.onFinishHydration(cb),
    () => useGameStore.persist.hasHydrated(),
    () => false,
  );
}
