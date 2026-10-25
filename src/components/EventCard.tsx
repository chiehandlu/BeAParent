"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SOURCES } from "@/content/sources";
import type { Choice, GameEvent } from "@/game/types";

interface Props {
  event: GameEvent;
  onChoose: (choice: Choice) => void;
}

export function EventCard({ event, onChoose }: Props) {
  const [picked, setPicked] = useState<Choice | null>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p className="mt-2 text-neutral-700">{event.description}</p>

      {picked ? (
        <div className="mt-4 space-y-4">
          <p className="rounded-xl bg-sand/40 p-4">{picked.feedback}</p>
          <button type="button" className="btn-primary" onClick={() => onChoose(picked)}>
            繼續
          </button>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {event.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                className="w-full rounded-xl border border-neutral-200 p-3 text-left hover:bg-neutral-50"
                onClick={() => setPicked(choice)}
              >
                {choice.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {event.sourceIds && event.sourceIds.length > 0 && (
        <footer className="mt-4 text-xs text-neutral-500">
          了解更多：
          {event.sourceIds.map((id) => {
            const source = SOURCES[id];
            return (
              <a
                key={id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="ml-2 underline"
              >
                {source.publisher}・{source.title}
              </a>
            );
          })}
        </footer>
      )}
    </motion.article>
  );
}
