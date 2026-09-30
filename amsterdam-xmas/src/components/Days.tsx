import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { days, img } from "../data/trip";
import { Garland } from "./Garland";
import { Reveal } from "./Reveal";

export function Days() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const day = days[active];

  const choose = (i: number, el: HTMLElement) => {
    setActive(i);
    if (reduce || !days[i].note) return;
    const r = el.getBoundingClientRect();
    confetti({
      particleCount: 40,
      spread: 60,
      startVelocity: 26,
      scalar: 0.8,
      colors: ["#f3ecdf", "#ecbd6c", "#a8362a"],
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
      disableForReducedMotion: true,
    });
  };

  return (
    <section id="days" className="relative scroll-mt-16 overflow-hidden bg-night-2">
      <Garland className="opacity-70" />
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-lamp">December 22 to January 2</p>
          <h2 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Twelve days, <span className="italic text-lamp">zero tourist traps.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            The Amsterdam locals keep for themselves, plus every seasonal thing worth the cold. Everything is optional except two
            nights.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* date picker: a rail on phones, a column on desktop */}
          <div className="min-w-0 lg:col-span-4">
            <div role="tablist" aria-label="Pick a day" className="rail -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
              {days.map((d, i) => {
                const on = i === active;
                return (
                  <motion.button
                    key={d.date}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                    role="tab"
                    id={`day-tab-${i}`}
                    aria-selected={on}
                    aria-controls="day-panel"
                    onClick={(e) => choose(i, e.currentTarget)}
                    className={`group flex shrink-0 items-baseline gap-3 rounded-full px-4 py-2.5 text-left transition-colors lg:rounded-xl lg:py-3 ${
                      on ? "bg-lamp text-night" : "border border-hairline text-ink-soft hover:border-lamp/60 hover:text-ink lg:border-transparent"
                    }`}
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.12em]">{d.weekday}</span>
                    <span className="whitespace-nowrap font-mono text-sm font-medium">{d.date}</span>
                    <span className={`hidden truncate text-sm lg:inline ${on ? "font-semibold" : ""}`}>{d.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={day.date}
                id="day-panel"
                role="tabpanel"
                aria-labelledby={`day-tab-${active}`}
                initial={reduce ? false : { opacity: 0, y: 16, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.995 }}
                transition={{ type: "spring", bounce: 0, duration: 0.45 }}
                className={`grid gap-10 rounded-3xl border border-hairline bg-night p-7 md:p-10 ${day.image ? "md:grid-cols-5" : ""}`}
              >
                <div className={day.image ? "md:col-span-3" : ""}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-ink-soft">
                      {day.weekday}, {day.date}
                    </span>
                    {day.note && (
                      <span className="rounded-full border border-lamp/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-lamp">
                        {day.note}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-4xl font-semibold italic leading-tight tracking-tight text-ink md:text-5xl">{day.title}</h3>
                  <ul className="mt-7 space-y-4">
                    {day.items.map((item) => (
                      <li key={item} className="flex gap-4 text-base leading-relaxed text-ink-soft md:text-lg">
                        <span className="mt-[0.8em] h-px w-5 shrink-0 bg-lamp" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {day.image && (
                  <div className="md:col-span-2">
                    <img src={img(day.image.src)} alt={day.image.alt} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
