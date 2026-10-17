import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Play } from "@phosphor-icons/react";
import { Reveal } from "./motion";
import { SafeImg } from "./SafeImg";
import { HIFI_LOGO, LINKS, MAX_PHOTO2, SESH_ART_SMALL, VENUE } from "./media";
import { HIFI_LOGO_SVG } from "./hifiLogoSvg";
import { MAPS_URL } from "./event";
import { AddToCalendar } from "./Countdown";

const ELSEWHERE = [
  { label: "hifiamsterdam.com", href: LINKS.hifi },
  {
    label: (
      <>
        <span className="font-hifi text-[0.85em]">HIFI</span> on YouTube
      </>
    ),
    href: LINKS.hifiYT,
  },
  {
    label: (
      <>
        <span className="font-hifi text-[0.85em]">HIFI</span> on Instagram
      </>
    ),
    href: LINKS.hifiIG,
  },
  { label: "sesh.group", href: LINKS.seshShop },
  {
    label: (
      <>
        <span className="font-sesh uppercase">Sesh</span> on Instagram
      </>
    ),
    href: LINKS.seshIG,
  },
  {
    label: (
      <>
        <span className="font-sesh uppercase">Sesh</span> on Bandcamp
      </>
    ),
    href: LINKS.seshBC,
  },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t hairline">
      <div className="absolute inset-0 opacity-25">
        <SafeImg src={VENUE[4].src} fallbackSrc={VENUE[4].fallback} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 md:px-10 md:pt-40">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <SafeImg
              src={MAX_PHOTO2}
              alt="Boom Boom Mancini, founder of HIFI"
              loading="lazy"
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-ivory/20"
            />
            <div>
              <blockquote className="max-w-3xl font-serif text-[clamp(1.5rem,3vw,2.25rem)] italic leading-[1.15] tracking-tight text-ivory/90">
                “We can’t wait to have you at HIFI Amsterdam.”
              </blockquote>
              <p className="mt-3 text-sm text-ivory/50">
                <a href={LINKS.max} target="_blank" rel="noreferrer" className="font-medium uppercase tracking-[0.14em] text-ivory/80 underline-offset-4 hover:underline">
                  Boom Boom Mancini
                </a>
                , <span className="font-hifi text-[0.9em] text-ivory/70">HIFI 609</span> Founder
              </p>

              <a
                href={LINKS.maxVid}
                target="_blank"
                rel="noreferrer"
                aria-label="Watch a Boom Boom Mancini music video on YouTube"
                className="group mt-5 inline-flex items-center gap-3 rounded-xl border border-ivory/10 bg-ivory/[0.03] p-2 pr-4 transition-colors duration-300 ease-[ease] hover:border-delft/40"
              >
                <span className="relative block h-11 w-[74px] shrink-0 overflow-hidden rounded-md ring-1 ring-ivory/10">
                  <SafeImg
                    src="https://img.youtube.com/vi/qoUNy0NGnUg/mqdefault.jpg"
                    fallbackSrc="https://img.youtube.com/vi/qoUNy0NGnUg/hqdefault.jpg"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-ink/35 transition-colors duration-300 group-hover:bg-ink/15">
                    <Play size={15} weight="fill" className="text-ivory drop-shadow-[0_1px_4px_rgb(0_0_0/0.6)]" />
                  </span>
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-delft">Now playing</span>
                  <span className="mt-0.5 block text-sm text-ivory/80 transition-colors duration-300 group-hover:text-ivory">
                    A Boom Boom Mancini music video
                  </span>
                </span>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-16">
          <div className="flex items-center gap-4">
            <a href={LINKS.hifi} target="_blank" rel="noreferrer" aria-label="HIFI Amsterdam website">
              <SafeImg
                src={HIFI_LOGO}
                fallbackSrc={HIFI_LOGO_SVG}
                alt="HIFI Amsterdam logo"
                loading="lazy"
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-ivory/15 transition-transform duration-500 ease-[var(--ease-out-strong)] hover:scale-105"
              />
            </a>
            <span aria-hidden className="font-serif text-2xl italic text-delft">
              &times;
            </span>
            <a href={LINKS.seshShop} target="_blank" rel="noreferrer" aria-label="Sesh shop">
              <SafeImg
                src={SESH_ART_SMALL}
                alt="SESH label artwork"
                loading="lazy"
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-ivory/15 transition-transform duration-500 ease-[var(--ease-out-strong)] hover:scale-105"
              />
            </a>
          </div>
        </Reveal>

        <motion.div className="mt-10 md:mt-14" style={reduce ? undefined : { y, opacity }}>
          <p className="text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] tracking-[-0.02em]">
            <span className="font-hifi">HIFI</span>{" "}
            <span className="font-serif italic text-delft">&times;</span>{" "}
            <span className="font-sesh uppercase">Sesh</span>
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-8 border-t hairline pt-8 text-sm text-ivory/55 md:grid-cols-4">
          <div>
            <p className="text-ivory/35">Where</p>
            <p className="mt-2">Herengracht 609<br />Amsterdam</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="group mt-3 inline-flex items-center gap-1.5 text-sm text-ivory/60 transition-colors duration-200 ease-[ease] hover:text-ivory"
            >
              Directions
              <ArrowUpRight size={13} weight="light" className="text-delft transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px" />
            </a>
          </div>
          <div>
            <p className="text-ivory/35">When</p>
            <p className="mt-2">Saturday 24 October<br />Doors 16:00 to 19:00</p>
            <div className="mt-3">
              <AddToCalendar align="left" />
            </div>
          </div>
          <div>
            <p className="text-ivory/35">Hosts</p>
            <p className="mt-2">
              <span className="font-hifi text-[0.85em]">HIFI Studios</span>
              <br />
              <span className="font-sesh uppercase">Sesh Dawgs United</span>
            </p>
          </div>
          <div>
            <p className="text-ivory/35">Elsewhere</p>
            <ul className="mt-2 space-y-1.5">
              {ELSEWHERE.map((l, i) => (
                <li key={i}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition-colors duration-200 ease-[ease] hover:text-ivory"
                  >
                    {l.label}
                    <ArrowUpRight size={12} weight="light" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-ivory/35">
          Facade photography by{" "}
          <a href={LINKS.monDB} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            Walther Schoonenberg via Amsterdam Monumentenstad
          </a>
          . Interior photography courtesy of <span className="font-hifi text-[0.9em]">HIFI</span>. Merch photography by{" "}
          <span className="font-sesh uppercase">Sesh</span>. Artist photos courtesy of the artists. Portrait by Boom Boom Mancini. Herengracht 609-611, Rijksmonument 1689.
        </p>
      </div>
    </footer>
  );
}
