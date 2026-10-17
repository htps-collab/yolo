import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { EASE_DRAWER, EASE_OUT } from "./motion";
import { HIFI_LOGO, LINKS as SITE } from "./media";
import { HIFI_LOGO_SVG } from "./hifiLogoSvg";
import { SafeImg } from "./SafeImg";
import { useEventClock } from "./event";

const pad = (n: number) => String(n).padStart(2, "0");

/* Persistent doors countdown. Becomes a link to the stream while doors are
   open, and disappears once the pop-up is over. Hidden at md, where the full
   link row already fills the bar. */
function DoorsChip() {
  const { phase, days, hours, minutes } = useEventClock(30_000);
  if (phase === "after") return null;
  const live = phase === "live";
  const label = live ? "Live now" : days > 0 ? `${days}d ${pad(hours)}h` : `${pad(hours)}h ${pad(minutes)}m`;
  return (
    <a
      href={live ? SITE.hifiYT : "#top"}
      {...(live ? { target: "_blank", rel: "noreferrer" } : {})}
      aria-label={live ? "Live now: watch the stream" : `Doors open in ${label}`}
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-delft/30 bg-delft/[0.08] px-3 py-1.5 font-mono text-[11px] uppercase tabular-nums text-delft transition-colors duration-200 ease-[ease] hover:bg-delft/15 md:hidden lg:inline-flex"
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-delft opacity-70" />}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-delft" />
      </span>
      {label}
    </a>
  );
}

const LINKS = [
  { href: "#day", label: "Lineup" },
  { href: "#timetable", label: "Timetable" },
  { href: "#merch", label: "Merch" },
  { href: "#house", label: "The monument" },
  { href: "#rules", label: "House rules" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (v) => {
    // Solid background past a threshold, with hysteresis so a micro-scroll near
    // the edge can't flicker it on and off.
    setSolid((s) => (s ? v > 24 : v > 64));

    // Hide on a committed downward scroll, reveal on any upward move. Measure
    // against the last committed position and ignore sub-threshold jitter, so
    // Lenis' many small inertial deltas can't rapidly toggle the header.
    const delta = v - lastY.current;
    if (v <= 600 || open) {
      setHidden(false);
      lastY.current = v;
    } else if (Math.abs(delta) > 8) {
      setHidden(delta > 0);
      lastY.current = v;
    }
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5"
        animate={{ transform: hidden ? "translateY(-140%)" : "translateY(0%)" }}
        transition={{ duration: 0.5, ease: EASE_DRAWER }}
      >
        <nav
          className={`flex w-full max-w-3xl items-center justify-between gap-6 rounded-full py-2 pl-5 pr-2 lg:max-w-4xl transition-[background-color,box-shadow] duration-500 ease-[var(--ease-out-strong)] ${
            solid || open ? "glass" : "bg-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5 whitespace-nowrap tracking-tight">
            <SafeImg
              src={HIFI_LOGO}
              fallbackSrc={HIFI_LOGO_SVG}
              alt="HIFI Amsterdam"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-ivory/20"
            />
            <span className="flex items-baseline gap-2">
              <span className="font-hifi text-[12px] font-bold">HIFI 609</span>
              <span className="font-serif text-[13px] italic text-delft">&times;</span>
              <span className="hidden font-sesh text-[13px] uppercase tracking-[0.06em] text-ivory/80 sm:inline">
                Sesh Dawgs United
              </span>
              <span className="font-sesh text-[13px] uppercase tracking-[0.06em] text-ivory/80 sm:hidden">
                Sesh
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-2 text-[13px] text-ivory/65 transition-colors duration-200 ease-[ease] hover:text-ivory"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
          <DoorsChip />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ivory/[0.06] transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] md:hidden"
          >
            <span
              className={`absolute h-px w-4 bg-ivory transition-transform duration-300 ease-[var(--ease-drawer)] ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-ivory transition-transform duration-300 ease-[var(--ease-drawer)] ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/80 px-6 pb-16 backdrop-blur-3xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE_OUT } }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-serif text-5xl leading-[1.15] tracking-tight"
                    initial={{ transform: "translateY(100%)" }}
                    animate={{ transform: "translateY(0%)" }}
                    exit={{ transform: "translateY(100%)", transition: { duration: 0.2 } }}
                    transition={{ duration: 0.7, ease: EASE_DRAWER, delay: 0.05 + i * 0.05 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-ivory/50">Herengracht 609, Amsterdam</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
