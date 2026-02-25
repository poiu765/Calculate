import type { Deck } from "./types";
import { getTargetMs } from "./questions";

export const intervalMap = [1, 3, 7, 14, 30];

export function getIntervalForStreak(streak: number) {
  if (streak <= 0) return 0;
  const index = Math.min(streak, intervalMap.length) - 1;
  return intervalMap[index];
}

export function getLowerIntervalForStreak(streak: number) {
  const interval = getIntervalForStreak(streak);
  const index = intervalMap.indexOf(interval);
  if (index <= 0) return intervalMap[0];
  return intervalMap[index - 1];
}

export function shouldGraduate(streak: number, avgLast3Ms: number | null, deck: Deck) {
  if (streak < 5 || avgLast3Ms === null) return false;
  return avgLast3Ms <= getTargetMs(deck);
}
