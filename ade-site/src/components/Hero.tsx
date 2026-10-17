import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { EASE_OUT, WordReveal } from "./motion";
import { IMG } from "./media";
import { Countdown } from "./Countdown";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.35, 0.85]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100dvh] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { scale: imgScale, y: imgY }}
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      >
        <img
          src={IMG.facade}
          alt="The real facade of Herengracht 609-611 in Amsterdam"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </motion.div>

      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: veil }} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
      <div className="absolute inset-0 bg-delft-deep/20 mix-blend-multiply" />

      <motion.div
        className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 md:px-10 md:pb-20"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-delft/35 bg-delft/[0.08] py-1.5 pl-3 pr-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-delft backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-delft opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-delft" />
            </span>
            ADE Pop-Up
            <span className="text-delft/45">—</span>
            One day only
          </span>
        </motion.div>

        {/* Shadows are filters on the line wrappers, not text-shadow: each word
            reveals out of its own overflow-hidden box, which would clip a
            text-shadow into visible rectangles. drop-shadow traces the glyphs. */}
        <h1 className="max-w-5xl text-balance text-delft">
          <span className="block font-sesh text-[clamp(2.6rem,7.5vw,7rem)] uppercase leading-[0.95] tracking-[0.01em] [filter:drop-shadow(0_2px_22px_rgb(0_0_0/0.6))]">
            <WordReveal text="Sesh Dawgs United" immediate delay={0.45} />
          </span>{" "}
          <span className="mt-4 block font-hifi text-[clamp(1.6rem,4.6vw,4.25rem)] font-bold uppercase leading-[1.05] tracking-[0.02em] text-ivory [filter:drop-shadow(0_0_14px_rgb(168_85_247/0.7))_drop-shadow(0_2px_20px_rgb(0_0_0/0.55))]">
            <WordReveal text="At HIFI 609" immediate delay={0.65} />
          </span>
        </h1>

        <motion.ul
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ivory/75 sm:flex sm:flex-wrap sm:items-center"
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.95 }}
        >
          {["Sat 24 Oct", "16:00 – 19:00", "Herengracht 609", "4 DJs + Merch"].map((f, i) => (
            <li key={f} className="flex items-center gap-x-6">
              {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-delft sm:block" aria-hidden />}
              {f}
            </li>
          ))}
        </motion.ul>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            className="max-w-md text-base leading-relaxed text-ivory/70 md:text-lg"
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.1 }}
          >
            MCR-T, DJ Cringey, DJ Hyperdrive and Clara Cuvé, plus <span className="font-sesh uppercase">Sesh</span> kits and a tiny{" "}
            <span className="font-hifi text-[0.85em] text-ivory">HIFI 609</span> drop, inside the 1742 canal residence of an Amsterdam mayor. Capacity is limited: come early.
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 md:items-end"
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.25 }}
          >
            <Countdown />
            <div className="flex flex-wrap items-center gap-3">
            <a
              href="#day"
              className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-ivory py-2 pl-6 pr-2 text-sm font-medium text-ink transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
            >
              Lineup &amp; times
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowUpRight size={16} weight="light" />
              </span>
            </a>
            <a
              href="#house"
              className="whitespace-nowrap rounded-full border border-ivory/20 px-6 py-[0.95rem] text-sm text-ivory/90 transition-colors duration-200 ease-[ease] hover:border-ivory/40"
            >
              The monument
            </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
