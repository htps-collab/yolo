import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { EASE_DRAWER, EASE_OUT, Eyebrow, Reveal, WordReveal } from "./motion";
import { SafeImg } from "./SafeImg";
import { VENUE } from "./media";

/* Short and punchy: four beats from 1742 to the pop-up. Photos are HIFI's own
   interior shots (VENUE), with the archive hotlink as a fallback. */
const CHAPTERS = [
  {
    year: "1742",
    title: "A five-year-old laid the first stone.",
    body: "Gerrit Hooft, later mayor of Amsterdam, joins two canal houses behind one grand facade. His daughter Isabella, aged five, lays the first stone. It's still in the hall.",
    photo: VENUE[0],
  },
  {
    year: "1744",
    title: "Painted skies overhead.",
    body: "Hooft hires Jacob de Wit for the grand room. Gold leaf, Louis XV stucco, and ceiling pieces by Voorhout and Verkolje still above your head.",
    photo: VENUE[1],
  },
  {
    year: "1970",
    title: "Rijksmonument 1689.",
    body: "A wartime embassy, then protected for good inside the UNESCO canal ring. Today it's HIFI Studios.",
    photo: VENUE[2],
  },
  {
    year: "24.10.26",
    title: "One afternoon, it's a Sesh.",
    body: "Four DJs under 280-year-old stucco. Three hours, then it goes back to being a monument.",
    photo: VENUE[3],
  },
];

const GALLERY = [
  { photo: VENUE[4] },
  { photo: VENUE[5] },
  { photo: VENUE[6] },
];

function Chapter({ c, i, onActive }: { c: (typeof CHAPTERS)[number]; i: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);

  return (
    <div ref={ref} className="flex min-h-[70dvh] flex-col justify-center py-10">
      <motion.div
        animate={{ opacity: inView ? 1 : 0.28 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <p className="font-mono text-sm text-delft">{c.year}</p>
        <h3 className="mt-4 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.015em]">{c.title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ivory/65">{c.body}</p>
      </motion.div>
      {/* Mobile image inline */}
      <div className="mt-8 overflow-hidden rounded-[1.5rem]">
        <SafeImg src={c.photo.src} fallbackSrc={c.photo.fallback} alt={c.photo.alt} loading="lazy" className="aspect-[4/3] w-full object-cover lg:hidden" />
      </div>
    </div>
  );
}

export function House() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, number>>({});
  const reduce = useReducedMotion();
  const current = CHAPTERS[active];
  const stage = failed[current.photo.src] ?? 0;
  const currentSrc = stage === 0 ? current.photo.src : current.photo.fallback;

  return (
    <section id="house" className="relative bg-ink-2/60">
      <div className="mx-auto max-w-7xl px-5 pt-28 md:px-10 md:pt-40">
        <Reveal>
          <Eyebrow>The monument</Eyebrow>
        </Reveal>
        <h2 className="mt-6 max-w-4xl font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
          <WordReveal text="Two hundred and eighty years, and not a wall moved." />
        </h2>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-20 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="relative hidden lg:col-span-7 lg:block">
          <div className="sticky top-0 flex h-[100dvh] items-center">
            <div className="w-full rounded-[2rem] bg-ivory/[0.04] p-2 ring-1 ring-ivory/10">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[calc(2rem-0.5rem)] bg-ink">
                {/* A failed hotlink swaps to a quiet gradient panel. (Setting
                    style.opacity in onError doesn't work here: Motion rewrites
                    opacity every frame, which left the broken-image icon and
                    alt text showing.) */}
                <AnimatePresence initial={false}>
                  {stage > 1 ? (
                    <motion.div
                      key={`${current.photo.src}:fallback`}
                      role="img"
                      aria-label={current.photo.alt}
                      className="absolute inset-0 bg-[radial-gradient(110%_110%_at_50%_0%,rgb(87_84_0/0.85),rgb(11_11_13)_72%)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: EASE_DRAWER }}
                    />
                  ) : (
                    <motion.img
                      key={currentSrc}
                      src={currentSrc}
                      alt={current.photo.alt}
                      referrerPolicy="no-referrer"
                      onError={() => setFailed((f) => ({ ...f, [current.photo.src]: stage + 1 }))}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(1.08)" }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "scale(1)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: EASE_DRAWER }}
                    />
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-7 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={current.year}
                      className="font-serif text-[clamp(2.5rem,5vw,5rem)] italic leading-none"
                      initial={{ transform: "translateY(100%)", opacity: 0 }}
                      animate={{ transform: "translateY(0%)", opacity: 1 }}
                      exit={{ transform: "translateY(-100%)", opacity: 0 }}
                      transition={{ duration: 0.7, ease: EASE_DRAWER }}
                    >
                      {current.year}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {CHAPTERS.map((c, i) => (
            <Chapter key={c.year} c={c} i={i} onActive={setActive} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-28 md:px-10 md:pb-40">
        <Reveal>
          <p className="text-sm text-ivory/45">Inside the monument</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {GALLERY.map((g, i) => (
            <Reveal key={g.photo.src} delay={i * 0.08}>
              <figure className="overflow-hidden rounded-[1.75rem] bg-ink ring-1 ring-ivory/10">
                <SafeImg src={g.photo.src} fallbackSrc={g.photo.fallback} alt={g.photo.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
