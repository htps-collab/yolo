import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { HERO_BG, img } from "../data/trip";
import { Garland } from "./Garland";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // a spring between scroll and pixels: the parallax trails the scroll instead of snapping to it
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.6, restDelta: 0.0005 });
  const bgY = useTransform(smooth, [0, 1], ["0%", "16%"]);
  const crewY = useTransform(smooth, [0, 1], ["0%", "-6%"]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-night">
      <div id="top-sentinel" className="absolute top-0 h-px w-px" />

      <motion.picture style={reduce ? undefined : { y: bgY }} className="absolute inset-0 block h-[116%] w-full">
        <source media="(max-width: 767px)" srcSet={img(HERO_BG.tall)} />
        <img
          src={img(HERO_BG.src)}
          alt={HERO_BG.alt}
          style={{ objectPosition: HERO_BG.position }}
          className="h-full w-full object-cover opacity-90"
        />
      </motion.picture>
      <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/30 to-night/0" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/5 to-night/70" />
      <Garland className="z-10 h-24" />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pt-28 md:px-10 md:pt-32">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-[0.26em] text-lamp"
        >
          The Calcaterras, Christmas 2027
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl pb-2 font-display text-[3.4rem] font-semibold leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[6.25rem]"
        >
          Christmas is in <span className="italic text-lamp">Amsterdam.</span>
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
        >
          Christmas and New Year's, every single one of us, in a 1738 mansion on the canals. You book the flight. Max does
          everything else.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-7 flex flex-wrap items-center gap-4"
        >
          <motion.a
            href="#deal"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="rounded-full bg-lamp px-7 py-3.5 text-sm font-semibold text-night"
          >
            What you have to do
          </motion.a>
          <a
            href="#guests"
            className="px-2 py-3.5 text-sm font-semibold text-ink underline decoration-lamp/60 underline-offset-8 transition-colors hover:text-lamp"
          >
            See who's coming
          </a>
        </motion.div>
      </div>

      {/* Everybody, all twelve of us, lined up on the canal edge */}
      <motion.div
        style={reduce ? undefined : { y: crewY }}
        className="pointer-events-none relative z-10 mt-auto flex justify-center overflow-visible pt-6 lg:justify-end lg:px-10"
      >
        <div className="absolute inset-x-[6%] bottom-3 h-12 rounded-[50%] bg-black/70 blur-2xl" />
        <motion.img
          src={img("everyone")}
          alt="The whole family together: Dan, Ty and the kids up front, then Dave, Meg, Shea, Sam, Max, Sophie and Elana"
          initial={reduce ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="cutout relative w-[112%] max-w-none object-contain sm:w-full sm:max-w-full lg:-mt-24 lg:w-[57%] xl:w-[60%]"
        />
      </motion.div>
    </section>
  );
}
