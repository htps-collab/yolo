import { useSyncExternalStore } from "react";

/**
 * One looping soundtrack for the whole page. Browsers only allow sound after
 * a tap or key press, so we try immediately and otherwise start on the very
 * first interaction.
 */
const audio = typeof Audio !== "undefined" ? new Audio("./audio/christmas-medley.mp3") : null;
if (audio) {
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.55;
}

let playing = false;
let userMuted = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

audio?.addEventListener("play", () => {
  playing = true;
  emit();
});
audio?.addEventListener("pause", () => {
  playing = false;
  emit();
});

export function playMusic(): Promise<void> {
  if (!audio || userMuted) return Promise.resolve();
  return audio.play().catch(() => undefined);
}

export function toggleMusic() {
  if (!audio) return;
  if (audio.paused) {
    userMuted = false;
    void audio.play().catch(() => undefined);
  } else {
    userMuted = true;
    audio.pause();
  }
}

/** Autoplay attempt plus a first-interaction fallback. */
export function armAutoplay() {
  if (!audio) return () => {};
  void playMusic();
  const start = () => {
    if (!playing) void playMusic();
    cleanup();
  };
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  const cleanup = () => events.forEach((e) => window.removeEventListener(e, start));
  events.forEach((e) => window.addEventListener(e, start, { passive: true }));
  return cleanup;
}

export function useMusicPlaying() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => playing,
    () => false
  );
}

const FULL_VOLUME = 0.55;

/** Start the music silently inside a tap so the browser allows it, then swell it up. */
export function startMusicAt(level: number) {
  if (!audio || userMuted) return;
  audio.volume = Math.max(0, Math.min(1, level)) * FULL_VOLUME;
  if (audio.paused) void audio.play().catch(() => undefined);
}

export function setMusicLevel(level: number) {
  if (!audio || userMuted) return;
  audio.volume = Math.max(0, Math.min(1, level)) * FULL_VOLUME;
}
