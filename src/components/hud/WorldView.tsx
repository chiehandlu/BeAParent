"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { select, useSelection } from "@/lib/selection";
import { useGameStore, useHasHydrated } from "@/store/gameStore";
import { DetailCard } from "./DetailCard";
import { IndexPanel } from "./IndexPanel";
import { TopBar } from "./TopBar";

// WebGL 只能在瀏覽器執行
const World = dynamic(() => import("../scene/World"), {
  ssr: false,
  loading: () => (
    <p className="absolute inset-0 grid place-items-center text-neutral-500">島嶼載入中…</p>
  ),
});

export function WorldView() {
  const hydrated = useHasHydrated();
  const selection = useSelection();
  const finished = useGameStore((s) => s.finished);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <World />
      <TopBar />
      <DetailCard selection={selection} />
      <IndexPanel selection={selection} />
      {finished && (
        <Link
          href="/result"
          className="btn-primary absolute bottom-6 left-1/2 z-40 -translate-x-1/2"
        >
          這一生已走完，查看評分
        </Link>
      )}
    </div>
  );
}
