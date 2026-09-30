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

/* ------------------------------------------------------------------------
 * The music comes apart with the page: slower, lower, muffled, drowned in
 * reverb. Playback rate works on the bare <audio> element everywhere. The
 * filter and reverb need a Web Audio graph, which can only be started inside
 * a tap, so it's built on the first tap after the intro and skipped quietly
 * if the browser won't allow it.
 * ---------------------------------------------------------------------- */

type Graph = { ctx: AudioContext; lowpass: BiquadFilterNode; dry: GainNode; wet: GainNode; master: GainNode };
let graph: Graph | null = null;
let graphFailed = false;
let griefArmed = false;
let hiccup = 0;
let hiccupAt = 0;
let lastRate = 1;
let lastRateAt = 0;

if (audio) {
  // let the pitch sink with the tempo, like a record slowing down
  const el = audio as HTMLAudioElement & { webkitPreservesPitch?: boolean; mozPreservesPitch?: boolean };
  el.preservesPitch = false;
  el.webkitPreservesPitch = false;
  el.mozPreservesPitch = false;
}

/** A long, dark hall: decaying stereo noise as the reverb's impulse response. */
function impulse(ctx: AudioContext, seconds: number, falloff: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, falloff);
  }
  return buffer;
}

function buildGraph() {
  if (!audio || graph || graphFailed) return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) {
    graphFailed = true;
    return;
  }
  try {
    const ctx = new AC();
    const source = ctx.createMediaElementSource(audio);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 18000;
    lowpass.Q.value = 0.4;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx, 4.5, 2.4);
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    wet.gain.value = 0;
    const master = ctx.createGain();
    source.connect(lowpass);
    lowpass.connect(dry);
    lowpass.connect(verb);
    verb.connect(wet);
    dry.connect(master);
    wet.connect(master);
    master.connect(ctx.destination);
    graph = { ctx, lowpass, dry, wet, master };
    void ctx.resume();
  } catch {
    graphFailed = true;
  }
}

const unlockEvents = ["click", "touchend", "keydown", "pointerup"] as const;
function unlock() {
  buildGraph();
  if (graph && graph.ctx.state !== "running") void graph.ctx.resume();
  if (graphFailed || graph?.ctx.state === "running") unlockEvents.forEach((e) => window.removeEventListener(e, unlock, true));
}

/** Called once the intro is over: from here on the music is allowed to fall apart. */
export function armGrief() {
  if (griefArmed || !audio) return;
  griefArmed = true;
  unlockEvents.forEach((e) => window.addEventListener(e, unlock, { capture: true, passive: true }));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && graph?.ctx.state === "suspended") void graph.ctx.resume();
  });
}

/** The first crack: a thin glass ping, and the music stumbles for a second. */
export function glassHit() {
  hiccup = 1;
  hiccupAt = performance.now();
  if (!graph || graph.ctx.state !== "running" || userMuted || audio?.paused) return;
  const { ctx } = graph;
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = 0.16;
  out.connect(ctx.destination);
  for (const [freq, level, length] of [
    [2637, 0.5, 0.9],
    [3951, 0.32, 0.6],
    [5588, 0.2, 0.35],
    [7040, 0.12, 0.2],
  ] as const) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = freq;
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }
  // the crack itself: a very short burst of bright noise
  const noise = ctx.createBufferSource();
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2500;
  const ng = ctx.createGain();
  ng.gain.value = 0.9;
  noise.buffer = buf;
  noise.connect(hp).connect(ng).connect(out);
  noise.start(t);
}

/**
 * Called every frame with the page's damage (0..1) and how far into the
 * closing letter we are (0..1).
 */
export function setGrief(damage: number, ending: number, now: number) {
  if (!audio || !griefArmed) return;
  const d = Math.min(1, Math.max(0, damage));

  // the stumble after the first crack eases off over about a second and a half
  if (hiccup > 0) hiccup = Math.max(0, 1 - (now - hiccupAt) / 1500);
  const stumble = hiccup > 0 ? Math.sin(hiccup * Math.PI) * 0.16 : 0;
  // a tape-warble that only shows up once things are really coming apart
  const warble = Math.sin(now / 1900) * 0.014 * d * d;
  const rate = Math.max(0.5, 1 - 0.4 * Math.pow(d, 1.3) - stumble + warble);
  // Safari clicks if the rate changes every frame, so step it gently
  if (Math.abs(rate - lastRate) > 0.004 && now - lastRateAt > 90) {
    audio.playbackRate = rate;
    lastRate = rate;
    lastRateAt = now;
  }

  if (!graph) return;
  const { ctx, lowpass, dry, wet, master } = graph;
  const t = ctx.currentTime;
  lowpass.frequency.setTargetAtTime(18000 * Math.pow(650 / 18000, Math.pow(d, 1.1)), t, 0.12);
  wet.gain.setTargetAtTime(0.7 * d, t, 0.2);
  dry.gain.setTargetAtTime(1 - 0.4 * d, t, 0.2);
  master.gain.setTargetAtTime((1 - 0.25 * d) * (1 - 0.45 * ending), t, 0.25);
}
