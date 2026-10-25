"use client";

import { motion, useReducedMotion } from "motion/react";
import { STAGES } from "@/content/stages";

interface Props {
  currentIndex: number;
  onSelectCurrent: () => void;
}

export function IslandMap({ currentIndex, onSelectCurrent }: Props) {
  const pulse = !useReducedMotion();
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-sea">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <polyline
          points={STAGES.map((s) => `${s.mapPosition.x},${s.mapPosition.y}`).join(" ")}
          fill="none"
          stroke="white"
          strokeOpacity={0.5}
          strokeWidth={0.4}
          strokeDasharray="1.5 1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {STAGES.map((stage, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "locked";
        return (
          <motion.button
            key={stage.id}
            type="button"
            disabled={state !== "current"}
            onClick={onSelectCurrent}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-sm font-medium shadow-md data-[state=current]:bg-sand data-[state=done]:bg-island data-[state=locked]:bg-white/40 data-[state=locked]:text-white/80"
            data-state={state}
            style={{ left: `${stage.mapPosition.x}%`, top: `${stage.mapPosition.y}%` }}
            animate={pulse && state === "current" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={
              pulse && state === "current" ? { repeat: Infinity, duration: 2 } : undefined
            }
          >
            {stage.name}
          </motion.button>
        );
      })}
    </div>
  );
}
