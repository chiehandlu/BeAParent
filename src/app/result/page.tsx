"use client";

import Link from "next/link";
import { ResultRadar } from "@/components/ResultRadar";
import { findBuilding } from "@/content/islands";
import { computeScore } from "@/game/scoring";
import { useGameStore, useHasHydrated } from "@/store/gameStore";

export default function ResultPage() {
  const hydrated = useHasHydrated();
  const { stats, history, finished, reset } = useGameStore();

  if (!hydrated) return null;

  if (!finished) {
    return (
      <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p>旅程還沒結束喔。</p>
        <Link href="/play" className="btn-primary">
          回到島嶼
        </Link>
      </main>
    );
  }

  const result = computeScore(stats);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10 text-center">
      <p className="text-neutral-500">你的一生落幕了。</p>
      <h1 className="text-4xl font-bold">{result.title}</h1>
      <p className="text-6xl font-bold">
        {result.total}
        <span className="text-xl"> / 100</span>
      </p>
      <p className="text-neutral-700">{result.comment}</p>
      <ResultRadar dimensions={result.dimensions} />

      <section className="text-left">
        <h2 className="mono-label">人生回顧</h2>
        <ol className="mt-3 space-y-3">
          {history.map((record) => {
            const found = findBuilding(record.buildingId);
            const choice = found?.building.dilemma?.choices.find((c) => c.id === record.choiceId);
            if (!found || !choice) return null;
            return (
              <li key={record.buildingId} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs text-neutral-500">
                  {found.island.name}・{found.building.name}
                </p>
                <p className="mt-1 font-medium">{choice.label}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <Link href="/play" className="btn-primary" onClick={reset}>
        再活一次
      </Link>
    </main>
  );
}
