import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppleLogo, ArrowUpRight, CalendarPlus, GoogleLogo } from "@phosphor-icons/react";
import { EASE_OUT } from "./motion";
import { GCAL_URL, ICS_URL, useEventClock } from "./event";
import { LINKS } from "./media";

/* One unit of the countdown. Each new value slides up out of a clip box, like
   a split-flap board; reduced-motion users get a plain crossfade. */
function Unit({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion();
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <span className="relative block h-[1.1em] overflow-hidden font-mono text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.1] tabular-nums text-ivory">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={v}
            className="block"
            initial={reduce ? { opacity: 0 } : { transform: "translateY(100%)" }}
            animate={reduce ? { opacity: 1 } : { transform: "translateY(0%)" }}
            exit={reduce ? { opacity: 0 } : { transform: "translateY(-100%)" }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            {v}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.24em] text-ivory/40">{label}</span>
    </div>
  );
}

const Colon = () => (
  <span className="font-mono text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.1] text-delft/60" aria-hidden>
    :
  </span>
);

/* .ics for Apple / Outlook (a static file, so iOS opens it straight in
   Calendar) and a prefilled Google Calendar link. */
export function AddToCalendar({ align = "right" }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ivory/85 transition-colors duration-200 ease-[ease] hover:bg-ivory/[0.07] hover:text-ivory";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ivory/15 px-3 py-1.5 text-[11px] text-ivory/80 transition-[border-color,color,transform] duration-200 ease-[ease] hover:border-delft/50 hover:text-ivory active:scale-[0.97]"
      >
        <CalendarPlus size={14} weight="light" className="text-delft" />
        Add to calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            /* Solid surface, not .glass: this menu sits inside the glass
               countdown card, and a backdrop-filter nested in another one
               doesn't blur, so the digits behind would show through. */
            className={`absolute top-full z-30 mt-2 w-60 rounded-2xl bg-ink-3 p-1.5 shadow-[0_18px_50px_rgb(0_0_0/0.55)] ring-1 ring-ivory/12 ${align === "right" ? "right-0" : "left-0"}`}
            style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
            initial={{ opacity: 0, transform: "translateY(-6px) scale(0.97)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(-4px) scale(0.97)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <a role="menuitem" href={ICS_URL} onClick={() => setOpen(false)} className={item}>
              <AppleLogo size={16} weight="light" className="text-ivory/60" />
              Apple or Outlook
              <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-ivory/35">.ics</span>
            </a>
            <a role="menuitem" href={GCAL_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className={item}>
              <GoogleLogo size={16} weight="light" className="text-ivory/60" />
              Google Calendar
              <ArrowUpRight size={12} weight="light" className="ml-auto text-ivory/35" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Hero countdown. Flips to a live state while doors are open, then to a
   watch-back prompt once the pop-up is over. */
export function Countdown() {
  const { phase, days, hours, minutes, seconds } = useEventClock(1000);

  if (phase === "live") {
    return (
      <div className="glass w-full rounded-[1.5rem] p-5 md:w-[22rem]">
        <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-delft">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-delft opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-delft" />
          </span>
          Live now
        </p>
        <p className="mt-3 font-serif text-2xl leading-tight tracking-tight">Doors are open until 19:00.</p>
        <a
          href={LINKS.hifiYT}
          target="_blank"
          rel="noreferrer"
          className="group mt-4 inline-flex items-center gap-2 text-sm text-ivory/80 transition-colors duration-200 ease-[ease] hover:text-ivory"
        >
          Watch the stream
          <ArrowUpRight size={14} weight="light" className="text-delft transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px" />
        </a>
      </div>
    );
  }

  if (phase === "after") {
    return (
      <div className="glass w-full rounded-[1.5rem] p-5 md:w-[22rem]">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-ivory/55">That was the pop-up</p>
        <p className="mt-3 font-serif text-2xl leading-tight tracking-tight">Thank you for coming through.</p>
        <a
          href={LINKS.hifiYT}
          target="_blank"
          rel="noreferrer"
          className="group mt-4 inline-flex items-center gap-2 text-sm text-ivory/80 transition-colors duration-200 ease-[ease] hover:text-ivory"
        >
          Watch it back on <span className="font-hifi text-[0.85em]">HIFI</span>
          <ArrowUpRight size={14} weight="light" className="text-delft transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px" />
        </a>
      </div>
    );
  }

  return (
    <div
      role="timer"
      aria-label="Countdown to doors: Saturday 24 October, 16:00 Amsterdam time"
      className="glass w-full rounded-[1.5rem] px-5 pb-4 pt-4 md:w-auto"
    >
      <div className="flex items-center justify-between gap-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-ivory/55">Doors open in</span>
        <AddToCalendar />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 md:justify-start md:gap-4" aria-hidden>
        <Unit value={days} label="Days" />
        <Colon />
        <Unit value={hours} label="Hrs" />
        <Colon />
        <Unit value={minutes} label="Min" />
        <Colon />
        <Unit value={seconds} label="Sec" />
      </div>
    </div>
  );
}
