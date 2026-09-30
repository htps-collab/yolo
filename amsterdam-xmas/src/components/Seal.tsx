import { useEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import confetti from "canvas-confetti";
import { setMusicLevel, startMusicAt } from "../audio";

const HOLD_SECONDS = 2.4; // three beats: everyone counts 3, 2, 1
const RING = "OPEN IT TOGETHER • KERST 2027 • AMSTERDAM • THE CALCATERRAS • ";

/**
 * The wax seal on the invitation. Press and hold: the room counts down, the seal
 * shakes, the music swells in, and at zero it cracks in half with a burst of light.
 */
export function Seal({ onBroken }: { onBroken: () => void }) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const shakeX = useMotionValue(0);
  const shakeR = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const pressedAt = useRef(0);
  const [holding, setHolding] = useState(false);
  const [count, setCount] = useState(3);
  const [broken, setBroken] = useState(false);
  const [hint, setHint] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const dash = useTransform(progress, [0, 1], [0, 1]);
  const halo = useTransform(progress, [0, 1], [0.35, 1]);
  const haloScale = useTransform(progress, [0, 1], [1, 1.55]);
  const sealScale = useTransform(progress, [0, 0.9, 1], [1, 1.08, 1.12]);
  const raysOpacity = useTransform(progress, [0, 1], [0.35, 0.95]);

  useEffect(() => btnRef.current?.focus(), []);

  useMotionValueEvent(progress, "change", (p) => {
    setMusicLevel(0.12 + p * 0.88);
    setCount(p < 1 / 3 ? 3 : p < 2 / 3 ? 2 : 1);
  });

  // Nervous tremble that grows the longer the seal is held
  useAnimationFrame((t) => {
    if (reduce || broken) return;
    const p = progress.get();
    const amp = p * p * 7;
    shakeX.set(Math.sin(t / 22) * amp * (0.6 + Math.random() * 0.4));
    shakeR.set(Math.cos(t / 31) * amp * 0.5);
  });

  const burst = () => {
    setBroken(true);
    setMusicLevel(1);
    navigator.vibrate?.([30, 40, 90]);
    if (!reduce) {
      const colors = ["#f3ecdf", "#ecbd6c", "#b98a3e", "#a8362a"];
      confetti({ particleCount: 90, spread: 360, startVelocity: 38, ticks: 220, origin: { y: 0.58 }, colors, shapes: ["star"], scalar: 1.3, disableForReducedMotion: true });
      confetti({ particleCount: 140, spread: 110, startVelocity: 55, origin: { y: 0.62 }, colors, disableForReducedMotion: true });
    }
    window.setTimeout(onBroken, reduce ? 150 : 1100);
  };

  const press = () => {
    if (broken) return;
    pressedAt.current = performance.now();
    setHint(false);
    startMusicAt(0.12 + progress.get() * 0.88);
    navigator.vibrate?.(12);
    if (reduce) {
      burst();
      return;
    }
    setHolding(true);
    controls.current?.stop();
    const remaining = HOLD_SECONDS * (1 - progress.get());
    controls.current = animate(progress, 1, { duration: remaining, ease: "linear", onComplete: burst });
  };

  const release = () => {
    if (broken || !holding) return;
    setHolding(false);
    controls.current?.stop();
    if (performance.now() - pressedAt.current < 350) setHint(true);
    controls.current = animate(progress, 0, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  };

  const sealBody = (
    <>
      {/* raised rim */}
      <span className="absolute inset-[9%] rounded-full border-2 border-[#e27a64]/25 shadow-[inset_0_2px_3px_rgb(0_0_0/0.45),0_1px_0_rgb(255_255_255/0.12)]" />
      <span className="relative font-display text-7xl font-semibold italic leading-none text-[#e98a72] [text-shadow:-1px_-1px_0_rgb(255_210_190/0.35),2px_3px_3px_rgb(40_0_0/0.75)]">
        C
      </span>
      <span className="absolute bottom-[18%] font-mono text-[9px] uppercase tracking-[0.3em] text-[#f0b3a2]/70">2027</span>
    </>
  );

  const waxShape =
    "rounded-[47%_53%_50%_50%/52%_46%_54%_48%] bg-[radial-gradient(circle_at_34%_28%,#e05a43_0%,#b3321f_38%,#7a1a10_78%,#5a120b_100%)] shadow-[0_24px_50px_-10px_rgb(0_0_0/0.8),inset_0_-10px_22px_rgb(0_0_0/0.45),inset_0_6px_14px_rgb(255_170_140/0.28)]";

  return (
    <div className="relative mx-auto flex flex-col items-center">
      {/* The countdown the whole room shouts */}
      <div className="h-24 sm:h-28" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {holding && !broken && (
            <motion.span
              key={count}
              initial={{ opacity: 0, scale: 2.2, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block font-display text-8xl font-bold italic leading-none text-lamp drop-shadow-[0_0_30px_rgb(236_189_108/0.6)] sm:text-9xl"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex h-[290px] w-[290px] items-center justify-center sm:h-[330px] sm:w-[330px]">
        {/* slow light rays */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: raysOpacity }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-30%] rounded-full bg-[repeating-conic-gradient(from_0deg,rgb(236_189_108/0.22)_0deg_4deg,transparent_4deg_18deg)] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]"
        />
        {/* halo */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: halo, scale: haloScale }}
          className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgb(236_189_108/0.55),rgb(168_54_42/0.25)_45%,transparent_70%)] blur-2xl"
        />
        {/* engraved ring of text, turning slowly */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <path id="seal-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
          </defs>
          <text fill="#ecbd6c" fillOpacity="0.8" fontFamily="DM Mono, monospace" fontSize="8.4" letterSpacing="2.6">
            <textPath href="#seal-ring">{RING}</textPath>
          </text>
        </motion.svg>
        {/* progress ring fills as it's held */}
        <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-[9%] h-[82%] w-[82%] -rotate-90">
          <circle cx="100" cy="100" r="94" fill="none" stroke="rgb(236 189 108 / 0.14)" strokeWidth="2" />
          <motion.circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="#ecbd6c"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ pathLength: dash }}
            className="drop-shadow-[0_0_8px_rgb(236_189_108/0.9)]"
          />
        </svg>

        {!broken ? (
          <motion.button
            ref={btnRef}
            type="button"
            aria-label="Press and hold to break the seal"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId);
              press();
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                press();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") release();
            }}
            onContextMenu={(e) => e.preventDefault()}
            style={{ x: shakeX, rotate: shakeR, scale: sealScale }}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            className={`relative flex h-[168px] w-[168px] touch-none select-none items-center justify-center sm:h-[190px] sm:w-[190px] ${waxShape} cursor-pointer outline-offset-8 [-webkit-touch-callout:none]`}
          >
            {sealBody}
          </motion.button>
        ) : (
          <>
            {/* the seal cracks in two and the halves fly apart */}
            {[-1, 1].map((side) => (
              <motion.div
                key={side}
                aria-hidden="true"
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: side * 170, y: 140, rotate: side * 38, opacity: 0 }}
                transition={{ duration: 1, ease: [0.3, 0, 0.6, 1] }}
                className={`absolute flex h-[168px] w-[168px] items-center justify-center sm:h-[190px] sm:w-[190px] ${waxShape}`}
                style={{ clipPath: side < 0 ? "polygon(0 0, 54% 0, 44% 38%, 56% 60%, 46% 100%, 0 100%)" : "polygon(54% 0, 100% 0, 100% 100%, 46% 100%, 56% 60%, 44% 38%)" }}
              >
                {sealBody}
              </motion.div>
            ))}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0.95, scale: 0.3 }}
              animate={{ opacity: 0, scale: 4 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="pointer-events-none absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,#fff7e6,rgb(236_189_108/0.8)_35%,transparent_70%)]"
            />
          </>
        )}
      </div>

      <div className="mt-2 h-12 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={broken ? "b" : holding ? "h" : hint ? "hint" : "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={hint && !holding ? { opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs uppercase tracking-[0.24em] text-ink-soft"
          >
            {broken
              ? "Here we go"
              : holding
                ? "Keep holding. Everybody count!"
                : hint
                  ? "Hold it down, don't just tap"
                  : reduce
                    ? "Tap the seal"
                    : "Press and hold the seal"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* white-gold flash across the whole screen at the moment it breaks */}
      <AnimatePresence>
        {broken && !reduce && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.9, times: [0, 0.15, 1] }}
            className="pointer-events-none fixed inset-0 z-[80] bg-[radial-gradient(circle_at_50%_58%,#fff4dc,rgb(236_189_108/0.6)_40%,rgb(13_20_23/0)_80%)]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
