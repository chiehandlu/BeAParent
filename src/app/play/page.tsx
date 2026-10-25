"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { IslandMap } from "@/components/IslandMap";
import { StatsPanel } from "@/components/StatsPanel";
import { STAGES } from "@/content/stages";
import { getEventsForStage } from "@/content/events";
import { playSound } from "@/lib/audio";
import { useGameStore, useHasHydrated } from "@/store/gameStore";

export default function PlayPage() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const { stats, stageIndex, completedEventIds, finished, choose, advance } = useGameStore();
  const [onIsland, setOnIsland] = useState(false);

  if (!hydrated) return null;

  const stage = STAGES[stageIndex];
  const pending = getEventsForStage(stage.id).filter((e) => !completedEventIds.includes(e.id));
  const event = pending[0];
  const isLastStage = stageIndex === STAGES.length - 1;

  const leaveIsland = () => {
    advance();
    setOnIsland(false);
    playSound("travel");
    if (isLastStage) router.push("/result");
  };

  if (finished) {
    return (
      <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p>這段人生已經走完了。</p>
        <Link href="/result" className="btn-primary">
          查看結果
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <StatsPanel stats={stats} />
      {onIsland ? (
        <section className="space-y-4">
          <header>
            <p className="text-sm text-neutral-500">
              {stage.childAge}・你的角色：{stage.parentRole}
            </p>
            <h2 className="text-2xl font-bold">{stage.name}</h2>
            <p className="mt-1 italic text-neutral-600">{stage.mindset}</p>
          </header>
          {event ? (
            <EventCard
              key={event.id}
              event={event}
              onChoose={(choice) => {
                playSound("select");
                choose(event.id, choice.id);
              }}
            />
          ) : (
            <button type="button" className="btn-primary" onClick={leaveIsland}>
              {isLastStage ? "看看這一生" : "啟航前往下一座島"}
            </button>
          )}
        </section>
      ) : (
        <IslandMap currentIndex={stageIndex} onSelectCurrent={() => setOnIsland(true)} />
      )}
    </main>
  );
}
