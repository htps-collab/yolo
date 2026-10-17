import { Bank, CigaretteSlash, HandPalm, Hourglass, ProhibitInset } from "@phosphor-icons/react";
import { Eyebrow, Reveal, WordReveal } from "./motion";

/* HIFI house rules for guests. The building is a Rijksmonument inside
   Amsterdam's UNESCO World Heritage canal ring, so the rules are about the
   monument as much as the party. */
const RULES = [
  {
    icon: Bank,
    title: "It's a UNESCO-listed monument",
    body: "Herengracht 609 is a protected Rijksmonument in Amsterdam's UNESCO World Heritage canal ring. Treat it like one.",
  },
  {
    icon: ProhibitInset,
    title: "Stay in the open rooms",
    body: "Keep to the accessible areas. Anything roped off or closed is a restricted area, so stay out of it.",
  },
  {
    icon: CigaretteSlash,
    title: "No smoking, no drugs",
    body: "No smoking and no drug use anywhere in the monument. No exceptions.",
  },
  {
    icon: HandPalm,
    title: "Hands off the walls",
    body: "No touching, leaning on or marking the walls, stucco, paintings or artifacts. They've survived 280 years.",
  },
];

export function Rules() {
  return (
    <section id="rules" className="relative bg-ink-2/60">
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
        <Reveal>
          <Eyebrow>
            <span className="font-hifi text-[1.1em]">HIFI</span>&nbsp;house rules
          </Eyebrow>
        </Reveal>
        <h2 className="mt-6 max-w-4xl font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
          <WordReveal text="Party hard, tread lightly." />
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {/* Arrive early: the one rule that decides whether you get in */}
          <Reveal className="md:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-[2rem] bg-delft p-7 text-ink md:p-9">
              <Hourglass size={30} weight="light" />
              <div className="mt-14">
                <p className="font-sesh text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] tracking-[0.01em]">Arrive early</p>
                <p className="mt-4 max-w-xs text-base leading-relaxed text-ink/75">
                  Capacity in the monument is limited. Doors open at 16:00: get there early to make sure you get in, and to get first pick of the merch.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-7 md:gap-4">
            {RULES.map((r, i) => (
              <Reveal key={r.title} delay={0.06 * (i + 1)}>
                <div className="h-full rounded-[1.75rem] bg-ink p-6 ring-1 ring-ivory/10 md:p-7">
                  <r.icon size={24} weight="light" className="text-delft" />
                  <p className="mt-8 text-lg font-medium leading-snug tracking-tight">{r.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
