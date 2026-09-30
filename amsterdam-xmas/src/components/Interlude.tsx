import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { seeded } from "../heartbreak";

interface InterludeProps {
  line: string;
  kicker?: string;
  /** 0..1: how far the words have come apart by this point */
  level: number;
}

/**
 * One line from Max between the sections. The words surface out of a blur one
 * at a time on a critically damped spring, and settle a little out of true:
 * the further down the page, the less they line up.
 */
export function Interlude({ line, kicker, level }: InterludeProps) {
  const reduce = useReducedMotion();
  const rand = seeded(line.length * 131 + Math.round(level * 1000));
  const words = line.split(" ").map((word) => ({
    word,
    y: (rand() - 0.5) * 16 * level,
    rotate: (rand() - 0.5) * 8 * level,
    opacity: 1 - rand() * 0.4 * level,
  }));

  return (
    <section data-intact="" className="relative bg-night px-5 py-36 md:py-56">
      <div className="mx-auto max-w-4xl text-center">
        {kicker && (
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.2 }}
            className="mb-8 font-mono text-[11px] uppercase tracking-[0.32em] text-ink-soft/70"
          >
            {kicker}
          </motion.p>
        )}
        <p className="font-display text-4xl font-medium italic leading-[1.15] tracking-tight text-ink/85 sm:text-5xl md:text-6xl">
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(12px)" }}
                whileInView={{ opacity: w.opacity, y: w.y, rotate: w.rotate, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 1.4, delay: i * (0.08 + level * 0.06) }}
              >
                {w.word}
              </motion.span>{" "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
