import type { ReactNode } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { ending, img } from "../data/trip";
import { glow } from "../heartbreak";

/** Each part of the letter surfaces out of the dark, slowly, on a spring with no bounce. */
function Surface({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-18% 0px" }}
      transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 1.8, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Where the invitation used to end with "I'm in." By the time anyone gets here
 * the page has fallen apart; the glass drops away and this is what's left.
 */
export function Ending() {
  // one candle's worth of warmth comes back behind the last lines
  const candle = useTransform(glow, [0.35, 1], [0, 1]);

  return (
    <>
      <section id="ending" data-intact="" className="relative overflow-hidden bg-night">
        <img
          src={img("m-canal-night")}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/70 to-night" />
        <motion.div
          aria-hidden="true"
          style={{ opacity: candle }}
          className="pointer-events-none absolute inset-x-0 bottom-[4%] mx-auto h-[80vh] max-w-4xl bg-[radial-gradient(closest-side,rgb(236_189_108/0.17),rgb(236_189_108/0.05)_55%,transparent)]"
        />

        <div className="relative mx-auto max-w-2xl px-5 pb-40 pt-40 md:px-10 md:pb-56 md:pt-56">
          <Surface>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-soft/70 line-through decoration-ink-soft/50">
              {ending.kicker}
            </p>
          </Surface>
          <Surface delay={0.15}>
            <h2 className="mt-8 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-7xl">
              {ending.opening}
            </h2>
          </Surface>

          <div className="mt-14 space-y-8">
            {ending.paragraphs.map((text, i) => (
              <Surface key={i} delay={0.1}>
                <p className="text-lg leading-[1.75] text-ink-soft md:text-xl">{text}</p>
              </Surface>
            ))}
          </div>

          <div className="mt-40 text-center md:mt-56">
            {ending.love.map((line, i) => (
              <Surface key={line} delay={i * 0.9}>
                <p
                  className={`font-display font-semibold italic leading-[1.05] tracking-tight ${
                    i === 0 ? "text-5xl text-ink md:text-7xl" : "mt-4 text-4xl text-lamp md:text-6xl"
                  }`}
                >
                  {line}
                </p>
              </Surface>
            ))}
            <Surface delay={2}>
              <p className="mt-16 font-display text-4xl italic text-ink md:text-5xl">{ending.signature}</p>
            </Surface>
          </div>
        </div>
      </section>

      <footer data-intact="" className="border-t border-hairline bg-night-2 pb-24">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10">
          <p className="font-display text-3xl font-semibold italic tracking-tight">Kerst in Amsterdam</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            Planned in secret by Max for the Calcaterras. The music is an original arrangement of Carol of the Bells and Deck
            the Halls, both public domain, made for this page. Night canal photo by Luis van den Bos on Unsplash. Sinterklaas
            photo by Pieter Wiersinga for Wikiportrait, CC BY-SA 4.0.
          </p>
        </div>
      </footer>
    </>
  );
}
