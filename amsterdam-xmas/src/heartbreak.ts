import { motionValue } from "motion/react";

/**
 * How broken the page is, 0 (the invitation as it was) to 1 (the end).
 * Driven by scroll in `Heartbreak`, spring-smoothed, and it only ever goes up:
 * scrolling back to the top doesn't put anything back together.
 */
export const decay = motionValue(0);

/** 0..1 as the closing letter comes into view. The glass falls away and a little warmth comes back. */
export const glow = motionValue(0);

let entered = false;
const enterListeners = new Set<() => void>();

/** Called when the intro hands over to the page (or is skipped). Nothing breaks before this. */
export function markEntered() {
  if (entered) return;
  entered = true;
  enterListeners.forEach((l) => l());
  enterListeners.clear();
}

export function onEntered(listener: () => void) {
  if (entered) {
    listener();
    return () => {};
  }
  enterListeners.add(listener);
  return () => enterListeners.delete(listener);
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Scroll fraction of the page -> damage. Nothing through the hero, then it
 * creeps in and gathers pace toward the letter at the bottom.
 */
export function damageAt(fraction: number) {
  return Math.pow(clamp01((fraction - 0.035) / 0.93), 1.15);
}

/** Small deterministic PRNG so the cracks land in the same places every render. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
