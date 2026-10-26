/**
 * 人生時鐘：人生階段越往後，天色從清晨走向深夜。
 * 回傳 0–24 的小時數，供場景燈光與介面顯示。
 */
const START_HOUR = 5.5;
const END_HOUR = 22;

export function lifeHour(stageIndex: number, stageCount: number): number {
  if (stageCount <= 1) return START_HOUR;
  const t = Math.min(1, Math.max(0, stageIndex / (stageCount - 1)));
  return START_HOUR + (END_HOUR - START_HOUR) * t;
}

export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function timeOfDayLabel(hour: number): string {
  if (hour < 8) return "清晨";
  if (hour < 16) return "白天";
  if (hour < 19) return "黃昏";
  return "夜晚";
}
