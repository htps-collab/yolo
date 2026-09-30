import { img, traditions } from "../data/trip";
import { LightSign } from "./LightSign";
import { Reveal } from "./Reveal";

export function Dutch() {
  return (
    <section id="dutch" className="relative scroll-mt-16 bg-night">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                Shea explains the <span className="italic text-lamp">Dutch holidays.</span>
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink-soft">
                Our teacher already knows all of this. Here's the cheat sheet so the rest of us can keep up.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="mt-7">
                <LightSign text="Free Palestine" />
                <div className="relative mt-1 h-[300px] sm:h-[330px]">
                  <div className="absolute inset-x-0 bottom-0 h-40 rounded-t-full bg-[radial-gradient(ellipse_at_50%_100%,rgb(236_189_108/0.22),transparent_70%)]" />
                  {/* Sinterklaas on Amerigo, standing behind the teacher and her front-row student */}
                  <img
                    src={img("sinterklaas")}
                    alt="Sinterklaas in his red robes and mitre on his white horse Amerigo"
                    loading="lazy"
                    className="cutout absolute bottom-0 left-0 h-[97%] w-auto max-w-[62%] object-contain object-bottom object-left"
                  />
                  <div className="absolute bottom-0 right-0 flex h-full items-end gap-1">
                    <img src={img("shea")} alt="Shea, ready to teach" loading="lazy" className="cutout relative h-[92%] w-auto object-contain" />
                    <img src={img("theo")} alt="Theo, front row of the class" loading="lazy" className="cutout relative -ml-5 h-[60%] w-auto object-contain" />
                  </div>
                </div>
                <figcaption className="mt-3 text-sm text-ink-soft">The man himself, on his horse Amerigo.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {traditions.map((t, i) => (
            <Reveal key={t.word} delay={(i % 2) * 0.06} className={i === 0 ? "sm:col-span-2" : ""}>
              <article
                className={`h-full rounded-2xl border border-hairline p-7 ${
                  i === 0 ? "bg-[linear-gradient(135deg,#1c2a2f,#131d21)]" : i === 5 ? "bg-[linear-gradient(160deg,#2a2218,#141c1f)]" : "bg-night-2"
                }`}
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-lamp">{t.when}</p>
                <h3 className={`mt-3 font-display font-semibold italic leading-tight text-ink ${i === 0 ? "text-5xl" : "text-3xl"}`}>{t.word}</h3>
                <p className={`mt-3 leading-relaxed text-ink-soft ${i === 0 ? "max-w-2xl text-lg" : "text-[15px]"}`}>{t.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
