"use client";

import type { Building } from "@/game/types";
import { playSound } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";

/** 點選即定案（不能先偷看回饋再反悔）；回饋由 BuildingCard 依 history 顯示。 */
export function DilemmaPanel({ building }: { building: Building }) {
  const choose = useGameStore((s) => s.choose);
  const dilemma = building.dilemma!;

  return (
    <div>
      <p className="font-medium">{dilemma.prompt}</p>
      <ul className="mt-3 space-y-2">
        {dilemma.choices.map((choice) => (
          <li key={choice.id}>
            <button
              type="button"
              className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white p-3 text-left text-sm hover:border-accent"
              onClick={() => {
                playSound("select");
                choose(building.id, choice.id);
              }}
            >
              {choice.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
