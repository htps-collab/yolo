import { motion, useReducedMotion } from "motion/react";
import { img, scrapbook } from "../data/trip";
import { Reveal } from "./Reveal";

export function Scrapbook() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-night">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            We've been practicing <span className="italic text-lamp">for thirty years.</span>
          </h2>
        </Reveal>

        <div className="mt-16 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {scrapbook.map((s, i) => (
            <motion.figure
              key={s.src}
              initial={reduce ? false : { opacity: 0.15, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: s.tilt }}
              whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", bounce: 0.18, duration: 0.75, delay: (i % 3) * 0.06 }}
              className="mb-10 break-inside-avoid"
            >
              {s.cutout ? (
                <div className="relative px-2 pt-4">
                  <div className="absolute inset-x-6 bottom-0 top-10 rounded-[40%] bg-[radial-gradient(ellipse_at_50%_70%,rgb(236_189_108/0.18),transparent_70%)]" />
                  <img src={img(s.src)} alt={s.alt} loading="lazy" className="cutout relative w-full" />
                </div>
              ) : (
                <div className="bg-ink p-3 pb-4 shadow-[0_30px_50px_-20px_rgb(0_0_0/0.8)]">
                  <img src={img(s.src)} alt={s.alt} loading="lazy" className="w-full" />
                </div>
              )}
              <figcaption className="mt-4 text-center font-display text-xl italic text-ink-soft">{s.caption}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Surprises() {
  return (
    <section className="relative overflow-hidden bg-night-2">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
        <Reveal>
          <h2 className="font-display text-6xl font-semibold leading-[0.98] tracking-tight md:text-8xl">
            And there may be <span className="block pb-2 italic text-lamp">surprises...</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">That's all we're saying. Don't ask Dad.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto max-w-md rotate-2 bg-ink p-3 pb-14 shadow-[0_40px_70px_-25px_rgb(0_0_0/0.85)] transition-transform duration-500 hover:rotate-0">
            <img
              src={img("p-surprises")}
              alt="Max, Dave and a friend grinning, thumbs up, in a stone-walled restaurant"
              loading="lazy"
              className="w-full"
            />
            <p className="mt-4 text-center font-display text-2xl italic text-night">Say no more.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
