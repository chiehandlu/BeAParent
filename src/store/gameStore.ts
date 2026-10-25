"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { advanceStage, chooseOption, createInitialState } from "@/game/engine";
import type { GameState } from "@/game/types";

interface GameStore extends GameState {
  choose: (eventId: string, choiceId: string) => void;
  advance: () => void;
  reset: () => void;
}

const pickState = (s: GameStore): GameState => ({
  stats: s.stats,
  stageIndex: s.stageIndex,
  completedEventIds: s.completedEventIds,
  history: s.history,
  finished: s.finished,
});

/** UI 層只呼叫這些 action；遊戲規則一律寫在 src/game。 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      choose: (eventId, choiceId) => set(chooseOption(pickState(get()), eventId, choiceId)),
      advance: () => set(advanceStage(pickState(get()))),
      reset: () => set(createInitialState()),
    }),
    {
      name: "beaparent-save",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: pickState,
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
