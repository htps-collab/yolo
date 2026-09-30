import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { img } from "../data/trip";
import { Garland } from "./Garland";
import { Reveal } from "./Reveal";

const packing = [
  "A real waterproof coat. Dutch drizzle comes in sideways",
  "Shoes you can walk eight miles of cobbles in",
  "One dressed-up outfit for Christmas Eve and one for New Year's",
  "Gloves, a scarf and the most ridiculous hat you own",
  "Swimsuit, if you're doing the North Sea dive",
];

export function Closer() {
  const [inYes, setIn] = useState(false);
  const reduce = useReducedMotion();

  const imIn = () => {
    setIn(true);
    if (reduce) return;
    const colors = ["#f3ecdf", "#ecbd6c", "#b98a3e", "#a8362a"];
    confetti({ particleCount: 140, spread: 100, startVelocity: 48, origin: { y: 0.7 }, colors, disableForReducedMotion: true });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <img
          src={img("m-canal-night")}
          alt="A canal at night outside the studio, boats moored under lit windows"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/60 to-night" />
        <Garland className="z-10" />

        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center md:px-10 md:py-40">
          <Reveal>
            <h2 className="font-display text-6xl font-semibold leading-[0.98] tracking-tight md:text-8xl">
              Book the flight. <span className="block italic text-lamp">Max has the rest.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Same family, same holiday, better street lighting. All of us in the same photo, on the same canal.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex min-h-[120px] flex-col items-center">
              <AnimatePresence mode="wait">
                {!inYes ? (
                  <motion.button
                    key="btn"
                    onClick={imIn}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    className="seal-pulse rounded-full bg-lamp px-10 py-5 text-base font-semibold text-night transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    I'm in
                  </motion.button>
                ) : (
                  <motion.div key="yes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} role="status">
                    <p className="font-display text-4xl font-semibold italic text-lamp">Tot snel.</p>
                    <p className="mt-2 text-base text-ink-soft">That's Dutch for "see you soon." Now go tell Max in the group chat.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none relative mx-auto flex max-w-5xl items-end justify-center px-5">
          <img src={img("sophie-max")} alt="Max and his twin Sophie in matching shirts" loading="lazy" className="cutout h-[260px] w-auto md:h-[360px]" />
          <img src={img("meg")} alt="Meggo in her jeweled cap" loading="lazy" className="cutout -ml-6 h-[240px] w-auto md:h-[330px]" />
        </div>
      </section>

      <footer className="border-t border-hairline bg-night-2 pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-display text-3xl font-semibold italic tracking-tight">Kerst in Amsterdam</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              Planned in secret by Max for the Calcaterras. The music is an original arrangement of Carol of the Bells and Deck
              the Halls, both public domain, made for this page. Night canal photo by Luis van den Bos on Unsplash. Sinterklaas photo by Pieter Wiersinga for Wikiportrait, CC BY-SA 4.0.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">What to pack</h3>
            <ul className="mt-4 space-y-3">
              {packing.map((note) => (
                <li key={note} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-[10px] h-px w-4 shrink-0 bg-lamp" aria-hidden="true" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
