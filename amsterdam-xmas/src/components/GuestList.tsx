import { useCallback, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { img, people, type Person } from "../data/trip";
import { Reveal } from "./Reveal";

function House({ p }: { p: Person }) {
  const style = { "--h": p.height } as CSSProperties;
  return (
    <article className="w-[80vw] max-w-[330px] shrink-0 snap-start sm:w-[330px]">
      <div className="relative h-[437px] md:h-[520px]">
      <div className="absolute inset-x-0 bottom-0 h-[calc(var(--h)*0.84px)] md:h-[calc(var(--h)*1px)]" style={style}>
        {/* the facade */}
        <div
          className={`gable-${p.gable} absolute inset-x-0 bottom-0 top-[13%]`}
          style={{
            background: `radial-gradient(ellipse 60% 45% at 50% 62%, rgb(236 189 108 / 0.30), transparent 70%),
              repeating-linear-gradient(0deg, rgb(255 255 255 / 0.018) 0 2px, transparent 2px 9px),
              linear-gradient(180deg, ${p.tone}, #0f1719)`,
          }}
        >
          {/* tall lit windows either side, the way canal houses actually look at night */}
          <div className="absolute inset-x-[9%] top-[24%] flex justify-between">
            <span className="h-16 w-7 rounded-t-sm bg-lamp/25 shadow-[0_0_24px_rgb(236_189_108/0.35)]" />
            <span className="h-16 w-7 rounded-t-sm bg-lamp/15" />
          </div>
          <div className="absolute inset-x-[9%] top-[52%] flex justify-between">
            <span className="h-14 w-7 rounded-t-sm bg-lamp/10" />
            <span className="h-14 w-7 rounded-t-sm bg-lamp/25 shadow-[0_0_24px_rgb(236_189_108/0.35)]" />
          </div>
        </div>
        {/* hoist beam at the peak, every canal house has one */}
        <span aria-hidden="true" className="absolute left-1/2 top-[13%] h-5 w-[3px] -translate-x-1/2 -translate-y-3 bg-[#0a0f11]" />

        {/* the person, standing in their house with their head through the roofline */}
        <img
          src={img(p.cutout)}
          alt={p.alt}
          loading="lazy"
          draggable={false}
          className="cutout absolute bottom-0 left-1/2 h-[93%] w-auto max-w-[112%] -translate-x-1/2 object-contain object-bottom"
        />
        {p.sidekick && (
          <img
            src={img(p.sidekick.src)}
            alt={p.sidekick.alt}
            loading="lazy"
            draggable={false}
            className="cutout absolute -right-3 bottom-0 h-[46%] w-auto object-contain object-bottom"
          />
        )}
      </div>
      </div>
      {/* canal edge + reflection */}
      <div className="relative h-8 overflow-hidden bg-gradient-to-b from-[#0b2027] to-night">
        <span className="water-glint absolute left-[30%] top-2 h-[3px] w-20 rounded-full bg-lamp/40 blur-[2px]" />
        <span className="water-glint absolute left-[55%] top-4 h-[2px] w-12 rounded-full bg-lamp/30 blur-[2px] [animation-delay:1.3s]" />
      </div>

      <div className="pr-4 pt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lamp">{p.plaque}</p>
        <h3 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-ink">{p.name}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.lore}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink">
          <span className="font-semibold text-lamp">In Amsterdam: </span>
          {p.amsterdam}
        </p>
      </div>
    </article>
  );
}

/** Where a flick would come to rest, the way scroll deceleration projects it. */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export function GuestList() {
  const rail = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, startScroll: 0, moved: false, samples: [] as { t: number; x: number }[] });
  const glide = useRef<{ stop: () => void } | null>(null);

  /** Width of one house plus the gap: the distance a single step moves. */
  const step = () => {
    const el = rail.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 24 : 354;
  };

  const settle = useCallback((target: number, velocity: number) => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, target));
    glide.current?.stop();
    glide.current = animate(el.scrollLeft, to, {
      type: "spring",
      bounce: 0.1,
      duration: 0.6,
      velocity,
      onUpdate: (v) => {
        el.scrollLeft = v;
      },
      onComplete: () => {
        el.style.scrollSnapType = "";
      },
    });
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    if (reduce) {
      el.scrollBy({ left: dir * step(), behavior: "smooth" });
      return;
    }
    el.style.scrollSnapType = "none";
    settle(Math.round(el.scrollLeft / step()) * step() + dir * step(), 0);
  };

  // Grab the street and pull it: 1:1 with the pointer, then thrown with its own momentum.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || reduce || !rail.current) return; // touch keeps native scrolling
    glide.current?.stop();
    rail.current.style.scrollSnapType = "none";
    rail.current.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startScroll: rail.current.scrollLeft, moved: false, samples: [{ t: performance.now(), x: e.clientX }] };
    setDragging(true);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = rail.current;
    if (!dragging || !el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
    const s = drag.current.samples;
    s.push({ t: performance.now(), x: e.clientX });
    if (s.length > 6) s.shift();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = rail.current;
    if (!dragging || !el) return;
    setDragging(false);
    rail.current?.releasePointerCapture?.(e.pointerId);
    const s = drag.current.samples;
    const first = s[0];
    const last = s[s.length - 1];
    const dt = last && first ? last.t - first.t : 0;
    // pointer velocity, flipped because dragging right scrolls left
    const velocity = dt > 0 ? -((last.x - first.x) / dt) * 1000 : 0;
    if (!drag.current.moved) {
      el.style.scrollSnapType = "";
      return;
    }
    const projected = el.scrollLeft + project(velocity);
    settle(Math.round(projected / step()) * step(), velocity);
  };

  return (
    <section id="guests" className="relative scroll-mt-16 overflow-hidden bg-night pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <Reveal>
          <h2 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            One canal, <span className="italic text-lamp">nine lit windows.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            The guest list, one house each. Walk down the street and see what Amsterdam has waiting for you personally.
          </p>
        </Reveal>
        <div className="flex gap-3">
          {([-1, 1] as const).map((dir) => (
            <motion.button
              key={dir}
              onClick={() => nudge(dir)}
              aria-label={dir < 0 ? "Previous house" : "Next house"}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-lamp hover:text-lamp"
            >
              {dir < 0 ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </motion.button>
          ))}
        </div>
      </div>

      <div
        ref={rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`rail mt-16 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-5 pt-10 select-none md:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollPaddingLeft: "max(1.25rem, calc((100vw - 80rem) / 2 + 2.5rem))" }}
      >
        {people.map((p) => (
          <House key={p.id} p={p} />
        ))}
        <span className="w-2 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
