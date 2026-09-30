import { Bathtub, Couch } from "@phosphor-icons/react";
import { img } from "../data/trip";
import { Reveal } from "./Reveal";

const studioFacts = [
  { value: "1738", label: "Built as the mayor's residence" },
  { value: "16", label: "Bedrooms, pick yours" },
  { value: "€0", label: "What it costs you to stay" },
];

const studioShots = [
  { src: "m-fresco", alt: "Painted cherubs and clouds across the studio ceiling", caption: "Look up. Every room does this.", span: "md:col-span-7", aspect: "aspect-[16/9]" },
  { src: "m-max-decks", alt: "Max at the DJ decks under the painted ceiling", caption: "Max's office, most mornings.", span: "md:col-span-5", aspect: "aspect-[3/4] md:aspect-auto md:h-full" },
  { src: "m-stucco", alt: "Hand-carved plaster scrolls and gilded moulding in a corner of the ceiling", caption: "Stucco carved by hand, gold leaf on the edges.", span: "md:col-span-4", aspect: "aspect-[3/4] md:aspect-auto md:h-[440px]" },
  { src: "m-rooftop", alt: "Amsterdam rooftops and spires seen from the studio's roof terrace", caption: "The roof. Where we watch midnight on New Year's Eve.", span: "md:col-span-8", aspect: "aspect-[3/2] md:aspect-auto md:h-[440px]" },
];

export function Stay() {
  return (
    <section id="stay" className="relative scroll-mt-16 bg-night-2">
      {/* The studio: the big reveal inside the big reveal */}
      <div className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-24 md:px-10 md:pt-32 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:pt-10">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-lamp">Where you sleep</p>
              <h2 className="mt-5 pb-1 font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
                Live like <span className="italic text-lamp">Dutch royalty</span> for eleven nights.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
                The Hifi Studio sits right in the middle of Amsterdam: a sixteen-bedroom canal mansion with cherubs painted on the
                ceilings, in beautiful shape, where Max goes to work every day. Anyone who wants a room gets one, free.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-hairline pt-8">
                {studioFacts.map((f) => (
                  <div key={f.value}>
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="block font-display text-5xl font-semibold leading-none text-ink md:text-6xl">{f.value}</span>
                      <span className="mt-3 block text-sm leading-snug text-ink-soft">{f.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <Reveal delay={0.06}>
              <div className="relative">
                {/* an arched window onto the fresco room, like looking through a canal-house door */}
                <div className="overflow-hidden rounded-t-[999px] border border-hairline">
                  <img
                    src={img("m-fresco-room")}
                    alt="The studio's grand room: a painted ceiling full of cherubs over tall canal windows"
                    className="aspect-[3/4] w-full object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {studioShots.map((s, i) => (
            <Reveal key={s.src} delay={i * 0.05} className={s.span}>
              <figure className="flex h-full flex-col">
                <div className={`overflow-hidden border border-hairline ${s.aspect} md:flex-1`}>
                  <img src={img(s.src)} alt={s.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
                </div>
                <figcaption className="mt-3 text-sm text-ink-soft">{s.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* The other two front doors */}
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-20 md:px-10 md:pb-32">
        <Reveal>
          <h3 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Or pick one of the other two doors.</h3>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.05}>
            <div className="flex gap-5">
              <Bathtub size={34} weight="duotone" className="shrink-0 text-lamp" aria-hidden="true" />
              <div>
                <h4 className="text-xl font-semibold text-ink">The hotel next door</h4>
                <p className="mt-2 max-w-md text-base leading-relaxed text-ink-soft">
                  For anyone who wants a proper bed, a big hot shower and a bath with their name on it. Max is holding a few rooms
                  right beside the mansion, so breakfast in a palace is thirty seconds away.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex gap-5">
              <Couch size={34} weight="duotone" className="shrink-0 text-lamp" aria-hidden="true" />
              <div>
                <h4 className="text-xl font-semibold text-ink">Max's house</h4>
                <p className="mt-2 max-w-md text-base leading-relaxed text-ink-soft">
                  Home base number one. The kitchen, the couch, the late-night talks, and the host himself.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
