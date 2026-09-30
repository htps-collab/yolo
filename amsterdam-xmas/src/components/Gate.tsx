import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { img, rollCall } from "../data/trip";
import { armAutoplay, playMusic } from "../audio";
import { Seal } from "./Seal";

const STORAGE_KEY = "kerst-2027-opened";
const NAME_MS = 1450;

const outro = ["Clear the calendar.", "Christmas and New Year's.", "Eleven nights. All of us.", "Everybody is coming to"];

type Phase = "sealed" | "roll" | "arrived";

function readOpened() {
  // "?plan" in the link skips the intro and goes straight to the page
  if (new URLSearchParams(window.location.search).has("plan")) return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "yes";
  } catch {
    return false;
  }
}

const w = (p: (typeof rollCall)[number]) => p.ratio * (p.scale ?? 1);
const ROW_BREAK = 4;

/** Figure height for the lineup. Phones get two rows so nobody shrinks to a speck. */
function useLineup() {
  const [layout, setLayout] = useState({ h: 220, rows: 1 });
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 768) {
        // first figure at full width, the rest overlap by 28%
        const rowWidth = (row: typeof rollCall) => w(row[0]) + row.slice(1).reduce((a, p) => a + w(p) * 0.72, 0);
        const widest = Math.max(rowWidth(rollCall.slice(0, ROW_BREAK)), rowWidth(rollCall.slice(ROW_BREAK)));
        const h = Math.min(vh * 0.22, (vw - 24) / widest);
        setLayout({ h: Math.round(h), rows: 2 });
      } else {
        const sum = rollCall.reduce((a, p) => a + w(p), 0);
        setLayout({ h: Math.round(Math.min(vh * 0.36, (vw * 0.96) / (sum * 0.86), 360)), rows: 1 });
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return layout;
}

export function Gate() {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<Phase>("sealed");
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const enterRef = useRef<HTMLButtonElement>(null);
  const lineup = useLineup();
  const lineupH = lineup.h;

  useEffect(() => {
    const opened = readOpened();
    setDone(opened);
    setMounted(true);
    if (opened) return armAutoplay();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done, mounted]);

  useEffect(() => {
    if (phase === "arrived") enterRef.current?.focus();
  }, [mounted, done, phase]);

  const totalSteps = rollCall.length + outro.length;

  const celebrate = useCallback(() => {
    if (reduce) return;
    const colors = ["#f3ecdf", "#ecbd6c", "#b98a3e", "#a8362a"];
    confetti({ particleCount: 120, spread: 90, startVelocity: 52, origin: { y: 0.45 }, colors, scalar: 1, disableForReducedMotion: true });
    window.setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, colors, disableForReducedMotion: true });
      confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, colors, disableForReducedMotion: true });
    }, 260);
  }, [reduce]);

  // Drive the roll call
  useEffect(() => {
    if (phase !== "roll") return;
    if (step >= totalSteps) {
      setPhase("arrived");
      celebrate();
      return;
    }
    const isOutro = step >= rollCall.length;
    const ms = isOutro ? (step === totalSteps - 1 ? 1700 : 1900) : NAME_MS;
    const id = window.setTimeout(() => setStep((s) => s + 1), reduce ? 500 : ms);
    return () => window.clearTimeout(id);
  }, [phase, step, totalSteps, celebrate, reduce]);

  const breakSeal = () => {
    setPhase("roll");
    setStep(0);
  };

  const skip = () => {
    setStep(totalSteps);
  };

  const enter = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "yes");
    } catch {
      /* private mode: the intro just plays again next visit */
    }
    void playMusic();
    setDone(true);
  };

  if (!mounted) return null;

  const onStage = phase === "arrived" ? rollCall.length : Math.min(step + 1, rollCall.length);
  const line =
    phase === "roll"
      ? step < rollCall.length
        ? rollCall[step].line
        : outro[step - rollCall.length]
      : null;
  const outroLine = phase === "roll" && step >= rollCall.length;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="gate"
          role="dialog"
          aria-modal="true"
          aria-label="A surprise for the Calcaterra family"
          className="fixed inset-0 z-[60] overflow-hidden bg-night"
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          transition={{ duration: reduce ? 0.2 : 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={img("night-canal-tall")} />
            <img src={img("night-canal")} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.28]" />
          </picture>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgb(236_189_108/0.22),transparent_60%)]" />

          {/* Sealed envelope */}
          <AnimatePresence>
            {phase === "sealed" && (
              <motion.div
                key="sealed"
                className="absolute inset-0 flex items-center justify-center overflow-y-auto px-5 py-6"
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-xl text-center"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-lamp">For the Calcaterras</p>
                  <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl">
                    Everybody, gather round <span className="italic text-lamp">one screen.</span>
                  </h1>
                  <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                    Sound all the way up. One person holds the seal down, everybody else counts.
                  </p>
                  <div className="mt-4">
                    <Seal onBroken={breakSeal} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roll call + arrival */}
          {phase !== "sealed" && (
            <div className="absolute inset-0 flex flex-col">
              <div className="flex flex-1 flex-col items-center justify-center px-5 pb-4 pt-16 text-center">
                <AnimatePresence mode="wait">
                  {phase === "roll" && line && (
                    <motion.p
                      key={line}
                      initial={reduce ? false : { opacity: 0, y: 26, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`font-display font-semibold leading-[1.05] tracking-tight ${
                        outroLine ? "text-4xl text-ink-soft sm:text-6xl" : "text-5xl text-ink sm:text-7xl md:text-8xl"
                      }`}
                    >
                      {line}
                    </motion.p>
                  )}
                  {phase === "arrived" && (
                    <motion.div
                      key="arrived"
                      initial={reduce ? false : { opacity: 0, scale: 0.86 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 90, damping: 14 }}
                    >
                      <h1 className="font-display text-[19vw] font-bold italic leading-[0.9] tracking-tight text-lamp drop-shadow-[0_0_40px_rgb(236_189_108/0.35)] sm:text-[15vw] lg:text-[11rem]">
                        Amsterdam.
                      </h1>
                      <p className="mt-4 font-mono text-xs uppercase tracking-[0.24em] text-ink sm:text-sm">
                        Dec 22, 2027 to Jan 2, 2028
                      </p>
                      <motion.button
                        ref={enterRef}
                        onClick={enter}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="mt-8 inline-flex items-center gap-3 rounded-full bg-lamp px-8 py-4 text-sm font-semibold text-night transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        Show us the plan
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* The family assembles, one cutout per name */}
              <div
                className="relative flex shrink-0 flex-wrap content-end items-end justify-center px-2"
                style={{ height: lineupH * lineup.rows }}
              >
                <div className="water-glint pointer-events-none absolute inset-x-[10%] bottom-0 h-6 rounded-[50%] bg-lamp/15 blur-xl" />
                {rollCall.slice(0, onStage).map((p, i) => {
                  const rowStart = i === 0 || (lineup.rows === 2 && i === ROW_BREAK);
                  return (
                    <Fragment key={p.cutout}>
                      {lineup.rows === 2 && i === ROW_BREAK && <span className="h-0 basis-full" aria-hidden="true" />}
                      <motion.img
                        src={img(p.cutout)}
                        alt={p.alt}
                        initial={reduce ? false : { opacity: 0, y: 80, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 16 }}
                        className="cutout relative w-auto object-contain object-bottom"
                        style={{
                          height: lineupH * (p.scale ?? 1),
                          marginLeft: rowStart ? 0 : -lineupH * w(p) * (lineup.rows === 2 ? 0.28 : 0.14),
                          zIndex: i % 2 === 0 ? 2 : 1,
                        }}
                      />
                    </Fragment>
                  );
                })}
              </div>

              {phase === "roll" && (
                <button
                  onClick={skip}
                  className="absolute right-4 top-4 rounded-full border border-hairline bg-night/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft backdrop-blur transition-colors hover:text-lamp"
                  style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
                >
                  Skip
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
