import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Clock, MapPin, ShoppingBag, Broadcast } from "@phosphor-icons/react";
import { EASE_OUT, Reveal, WordReveal } from "./motion";
import { SafeImg } from "./SafeImg";
import { ARTIST, LINKS } from "./media";
import { MAPS_URL, SETS } from "./event";

const FACTS = [
  { icon: Clock, label: "Doors", value: "16:00 to 19:00", note: "Capacity is limited. Come early to make sure you get in." },
  { icon: MapPin, label: "Address", value: "Herengracht 609", note: "Amsterdam, on the Golden Bend side", href: MAPS_URL, cta: "Directions" },
  { icon: ShoppingBag, label: "Merch", value: "SESH kits + HIFI 609", note: "Hoodies, team jerseys and a very small HIFI 609 drop", href: "#merch", cta: "See the merch", internal: true },
  { icon: Broadcast, label: "Can't make it?", value: "Watch live", note: "The sets go out on HIFI's YouTube channel", href: LINKS.hifiYT, cta: "HIFI on YouTube" },
];

/* The full lineup in set order. Set times come from SETS so the cards and the
   timetable can't drift apart. */
const time = (artist: string) => {
  const set = SETS.find((x) => x.artist === artist)!;
  return `${set.start} – ${set.end}`;
};

type Artist = {
  name: string;
  tag: string;
  img: string;
  pos: string;
  sound?: string;
  handle?: string;
  link?: string;
};

const ARTISTS: Artist[] = [
  { name: "MCR-T", tag: "Certified Sesh Dawg", sound: "Rap vocals over underground club techno", handle: "@kolegajj", link: LINKS.mcrT, img: ARTIST.mcrt, pos: "object-[50%_22%]" },
  { name: "DJ Cringey", tag: "On the decks", img: ARTIST.cringey, pos: "object-[50%_20%]" },
  { name: "DJ Hyperdrive", tag: "On the decks", img: ARTIST.hyperdrive, pos: "object-[50%_25%]" },
  { name: "Clara Cuvé", tag: "Certified Sesh Dawg", sound: "Fast, groovy techno into breaks, jungle and electro", handle: "@clara_cuve", link: LINKS.clara, img: ARTIST.claraCuve, pos: "object-[50%_18%]" },
];

function ArtistCard({ a, i }: { a: Artist; i: number }) {
  const inner = (
    <>
      <div className="aspect-[3/4] w-full overflow-hidden">
        <SafeImg
          src={a.img}
          alt={`${a.name}, press photo`}
          loading="lazy"
          className={`h-full w-full object-cover ${a.pos} grayscale transition-all duration-[900ms] ease-[var(--ease-out-strong)] group-hover:grayscale-0 group-hover:scale-[1.04]`}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/55 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="font-mono text-[11px] text-ivory/75">{String(i + 1).padStart(2, "0")}</span>
        <span className="rounded-full bg-delft px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-ink">{time(a.name)}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-delft">{a.tag}</p>
        <h4 className="mt-1.5 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] leading-none tracking-[-0.02em]">{a.name}</h4>
        {a.sound && <p className="mt-2 text-sm leading-snug text-ivory/70">{a.sound}</p>}
        {a.handle && (
          <div className="mt-3 flex items-center justify-end">
            <span className="inline-flex items-center gap-1 text-xs text-ivory/70">
              {a.handle}
              <ArrowUpRight size={14} weight="light" className="text-delft transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px" />
            </span>
          </div>
        )}
      </div>
    </>
  );
  const cls =
    "group relative block overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-ivory/10 transition-shadow duration-500 ease-[var(--ease-out-strong)] hover:ring-ivory/25";
  return (
    <Reveal delay={(i % 2) * 0.1}>
      {a.link ? (
        <a href={a.link} target="_blank" rel="noreferrer" className={cls} aria-label={`${a.name}, ${time(a.name)}`}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </Reveal>
  );
}

function Lineup() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {ARTISTS.map((a, i) => (
        <ArtistCard key={a.name} a={a} i={i} />
      ))}
    </div>
  );
}

/* Four equal 45-minute sets, so each one owns a quarter of the axis. */
function Timetable() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const fill = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <div id="timetable" ref={ref} className="mt-24 scroll-mt-28 md:mt-32">
      <Reveal>
        <h3 className="font-serif text-3xl tracking-tight md:text-4xl">Timetable</h3>
        <p className="mt-3 text-ivory/60">Saturday 24 October. Doors at 16:00, back to back until 19:00.</p>
      </Reveal>

      {/* Desktop axis */}
      <div className="relative mt-14 hidden md:block">
        <div className="mb-4 flex justify-between font-mono text-xs uppercase tracking-[0.18em] text-ivory/45">
          <span>Doors 16:00</span>
          <span>Close 19:00</span>
        </div>
        <div className="relative h-px w-full bg-ivory/10">
          {SETS.map((_, i) => (
            <div
              key={i}
              className="absolute -top-3 h-[25px] rounded-full bg-delft/10 ring-1 ring-delft/25"
              style={{ left: `calc(${i * 25}% + 3px)`, width: "calc(25% - 6px)" }}
            />
          ))}
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left bg-ivory"
            style={{ scaleX: reduce ? 1 : fill }}
          />
          {[0, 25, 50, 75, 100].map((p) => (
            <span key={p} className="absolute -top-[5px] h-[11px] w-px bg-ivory/60" style={{ left: `${p}%` }} />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-4 gap-6">
          {SETS.map((e, i) => (
            <Reveal key={e.artist} delay={0.08 * i}>
              <p className="font-mono text-sm text-delft">
                {e.start} – {e.end}
              </p>
              <p className="mt-3 font-serif text-2xl tracking-tight">{e.artist}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <ol className="relative mt-10 space-y-7 border-l hairline pl-6 md:hidden">
        {SETS.map((e, i) => (
          <Reveal as="li" key={e.artist} delay={0.05 * i}>
            <p className="font-mono text-sm text-delft">
              {e.start} – {e.end}
            </p>
            <p className="mt-1 font-serif text-2xl tracking-tight">{e.artist}</p>
          </Reveal>
        ))}
        <Reveal as="li" delay={0.2}>
          <p className="font-mono text-sm text-ivory/50">19:00</p>
          <p className="mt-1 text-lg">Doors close</p>
        </Reveal>
      </ol>
    </div>
  );
}

export function Day() {
  return (
    <section id="day" className="relative scroll-mt-10 mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <h2 className="max-w-4xl font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
        <WordReveal text="Three hours, four decks of talent, one very old monument." />
      </h2>

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] bg-ivory/10 ring-1 ring-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.07} className="bg-ink-2 p-7 md:p-8">
            <f.icon size={22} weight="light" className="text-delft" />
            <p className="mt-10 text-xs uppercase tracking-[0.2em] text-ivory/45">{f.label}</p>
            <p className="mt-2 font-serif text-2xl tracking-tight md:text-[1.7rem]">{f.value}</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/55">{f.note}</p>
            {"href" in f && (
              <a
                href={f.href}
                {...("internal" in f ? {} : { target: "_blank", rel: "noreferrer" })}
                className="group mt-4 inline-flex items-center gap-1.5 text-sm text-ivory/80 transition-colors duration-200 ease-[ease] hover:text-ivory"
              >
                {f.cta}
                <ArrowUpRight size={14} weight="light" className="text-delft transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px" />
              </a>
            )}
          </Reveal>
        ))}
      </div>

      <div className="mt-28 grid grid-cols-1 gap-12 md:mt-36 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <h3 className="font-serif text-3xl tracking-tight md:text-4xl">The lineup</h3>
            <p className="mt-4 max-w-xs text-ivory/60">
              Four DJs, 45 minutes each, back to back. MCR-T opens the doors at 16:00 and Clara Cuvé takes it home at 19:00.
            </p>
            <a
              href="#timetable"
              className="group mt-8 inline-flex items-center gap-2 text-sm text-ivory/80 transition-colors duration-200 ease-[ease] hover:text-ivory"
            >
              Full timetable
              <ArrowRight size={14} weight="light" className="transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
            </a>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 max-w-xs">
            <figure className="group overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-ivory/10">
              <div className="relative aspect-[4/5] overflow-hidden">
                <SafeImg
                  src={ARTIST.duo}
                  alt="MCR-T and Clara Cuvé together in front of a sound system"
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_32%] grayscale transition-all duration-[900ms] ease-[var(--ease-out-strong)] group-hover:grayscale-0 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-sesh text-lg uppercase leading-none tracking-[0.03em]">
                    MCR-T <span className="font-serif italic text-delft">×</span> Clara Cuvé
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-ivory/60">Certified Sesh Dawgs, off the decks</p>
                </figcaption>
              </div>
            </figure>
          </Reveal>
          <Reveal delay={0.16}>
            <a
              href={LINKS.seshBC}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex max-w-xs items-start gap-2 text-sm leading-snug text-ivory/65 transition-colors duration-200 ease-[ease] hover:text-ivory"
            >
              <span>
                SESHVA01 opens with MCR-T's <span className="font-sesh uppercase">Seshdawg Anthem</span>
              </span>
              <ArrowUpRight size={15} weight="light" className="mt-0.5 shrink-0 text-delft transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px" />
            </a>
          </Reveal>
        </div>
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <Lineup />
        </motion.div>
      </div>

      <Timetable />
    </section>
  );
}
