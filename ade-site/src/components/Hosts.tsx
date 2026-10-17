import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "./motion";
import { SafeImg } from "./SafeImg";
import { HIFI_LOGO, LINKS, SESH_ART_SMALL } from "./media";
import { HIFI_LOGO_SVG } from "./hifiLogoSvg";

function HostCard({
  mark,
  markFallback,
  markAlt,
  name,
  line,
  links,
  delay = 0,
}: {
  mark: string;
  markFallback?: string;
  markAlt: string;
  name: ReactNode;
  line: ReactNode;
  links: { label: string; href: string }[];
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="flex-1">
      <div className="group flex h-full items-center gap-5 rounded-[1.75rem] bg-ink-2 p-5 ring-1 ring-ivory/10 transition-shadow duration-500 ease-[var(--ease-out-strong)] hover:ring-ivory/20 md:p-6">
        <SafeImg
          src={mark}
          fallbackSrc={markFallback}
          alt={markAlt}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-ivory/15 transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-105 md:h-20 md:w-20"
        />
        <div className="min-w-0">
          <p className="tracking-tight md:text-2xl">{name}</p>
          <p className="mt-1 text-sm leading-snug text-ivory/55">{line}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[13px] text-ivory/70 transition-colors duration-200 ease-[ease] hover:text-ivory"
              >
                {l.label}
                <ArrowUpRight size={12} weight="light" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Hosts() {
  return (
    <section aria-label="The hosts" className="relative mx-auto max-w-7xl px-5 pt-16 md:px-10 md:pt-24">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-stretch">
        <HostCard
          mark={HIFI_LOGO}
          markFallback={HIFI_LOGO_SVG}
          markAlt="HIFI Amsterdam logo"
          name={<span className="font-hifi text-lg md:text-xl">HIFI Amsterdam</span>}
          line="Hidden Frequencies. Broadcasts from a canal mansion, run by Boom Boom Mancini."
          links={[
            { label: "Website", href: LINKS.hifi },
            { label: "YouTube", href: LINKS.hifiYT },
            { label: "Instagram", href: LINKS.hifiIG },
          ]}
        />
        <Reveal delay={0.08} className="flex items-center justify-center px-1 md:px-2">
          <span aria-hidden className="font-serif text-4xl italic text-delft md:text-5xl">
            &times;
          </span>
        </Reveal>
        <HostCard
          mark={SESH_ART_SMALL}
          markAlt="SESH label artwork"
          name={<span className="font-sesh text-xl uppercase tracking-[0.02em] md:text-2xl">Sesh Dawgs United</span>}
          line={
            <>
              Berlin label and crew. MCR-T, Clara Cuvé and the{" "}
              <span className="font-sesh uppercase text-ivory/75">Seshdawg</span> anthem.
            </>
          }
          links={[
            { label: "Shop", href: LINKS.seshShop },
            { label: "Instagram", href: LINKS.seshIG },
            { label: "Bandcamp", href: LINKS.seshBC },
          ]}
          delay={0.12}
        />
      </div>
    </section>
  );
}
