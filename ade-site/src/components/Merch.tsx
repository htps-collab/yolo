import { ArrowUpRight, Sparkle } from "@phosphor-icons/react";
import { Eyebrow, Reveal, WordReveal } from "./motion";
import { SafeImg } from "./SafeImg";
import { ARTIST, HIFI_LOGO, LINKS, MERCH } from "./media";
import { HIFI_LOGO_SVG } from "./hifiLogoSvg";

/* The SESH range (four pieces, prices as on sesh.group) beside the kit as the
   headliners wear it, then the HIFI 609 drop that only exists at the door. */

function ProductCard({ p, delay }: { p: (typeof MERCH)[number]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <a
        href={LINKS.seshShop}
        target="_blank"
        rel="noreferrer"
        aria-label={`${p.name}, ${p.price}, on sesh.group`}
        className="group block overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-ivory/10 transition-shadow duration-500 ease-[var(--ease-out-strong)] hover:ring-ivory/25"
      >
        <div className="aspect-[3/4] overflow-hidden bg-white">
          <SafeImg
            src={p.img}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
          />
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-medium tracking-tight">{p.name}</p>
            <p className="shrink-0 font-mono text-sm tabular-nums text-delft">{p.price}</p>
          </div>
          <p className="mt-1.5 text-[13px] leading-snug text-ivory/50">{p.note}</p>
        </div>
      </a>
    </Reveal>
  );
}

export function Merch() {
  return (
    <section id="merch" className="relative mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <Reveal>
        <Eyebrow>Merch</Eyebrow>
      </Reveal>
      <h2 className="mt-6 max-w-4xl font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
        <WordReveal text="Shop, dance, then buy another hoodie for a friend." />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/60">
          The full <span className="font-sesh uppercase">Sesh</span> kit is on the rail at the pop-up, with the music on. Can't wait until Saturday? It's all on{" "}
          <a href={LINKS.seshShop} target="_blank" rel="noreferrer" className="text-ivory underline decoration-delft/60 underline-offset-4 hover:decoration-delft">
            sesh.group
          </a>
          .
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5">
          <figure className="h-full overflow-hidden rounded-[1.5rem] bg-ink-2 ring-1 ring-ivory/10">
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[calc(100%-4rem)]">
              <SafeImg
                src={ARTIST.kit}
                alt="MCR-T and Clara Cuvé walking down stone steps in matching black SESH kits"
                loading="lazy"
                className="h-full w-full object-cover object-[50%_18%]"
              />
            </div>
            <figcaption className="flex h-16 items-center justify-between gap-4 px-5">
              <span className="text-sm text-ivory/70">Two kits, one for a friend.</span>
              <a href={LINKS.seshShop} target="_blank" rel="noreferrer" className="shrink-0 text-xs text-ivory/40 underline-offset-4 hover:underline">
                Shop sesh.group
              </a>
            </figcaption>
          </figure>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:col-span-7">
          {MERCH.map((p, i) => (
            <ProductCard key={p.name} p={p} delay={(i % 2) * 0.08} />
          ))}
        </div>
      </div>

      {/* HIFI 609 limited drop */}
      <Reveal delay={0.1} className="mt-5 lg:mt-6">
        <div className="relative overflow-hidden rounded-[2rem] p-7 ring-1 ring-[#a855f7]/35 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,rgb(168_85_247/0.28),transparent_55%),radial-gradient(90%_120%_at_100%_100%,rgb(168_85_247/0.14),transparent_60%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5 md:gap-7">
              <SafeImg
                src={HIFI_LOGO}
                fallbackSrc={HIFI_LOGO_SVG}
                alt="HIFI Amsterdam logo"
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-ivory/15 md:h-28 md:w-28"
              />
              <div>
                <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#c99bff]">
                  <Sparkle size={13} weight="fill" />
                  Limited edition
                </p>
                <p className="mt-2 font-hifi text-[clamp(1.6rem,4vw,3rem)] font-bold uppercase leading-none text-ivory [filter:drop-shadow(0_0_14px_rgb(168_85_247/0.7))]">
                  HIFI 609 merch
                </p>
              </div>
            </div>
            <div className="max-w-sm">
              <p className="font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.15] tracking-tight">
                In extremely limited quantity. When it's gone, it's gone.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/60">
                Only at the pop-up, only on the day. Another reason to arrive early.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex justify-center">
        <a
          href={LINKS.seshShop}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-ivory py-2 pl-6 pr-2 text-sm font-medium text-ink transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
        >
          Shop the full range on sesh.group
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
            <ArrowUpRight size={16} weight="light" />
          </span>
        </a>
      </Reveal>
    </section>
  );
}
