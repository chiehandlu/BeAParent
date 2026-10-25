import type { GameEvent, StageId } from "@/game/types";
import { newbornEvents } from "./newborn";
import { pregnancyEvents } from "./pregnancy";

/** 新增階段事件時，建立 <stageId>.ts 並在此註冊。 */
export const ALL_EVENTS: GameEvent[] = [...pregnancyEvents, ...newbornEvents];

export function getEventsForStage(stageId: StageId): GameEvent[] {
  return ALL_EVENTS.filter((e) => e.stageId === stageId);
}
