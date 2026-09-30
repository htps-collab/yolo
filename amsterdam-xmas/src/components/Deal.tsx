import { AirplaneTilt, Bed, ForkKnife, Ticket, Train } from "@phosphor-icons/react";
import { maxHandles } from "../data/trip";
import { Countdown } from "./Countdown";
import { Reveal } from "./Reveal";

const icons = { bed: Bed, train: Train, fork: ForkKnife, ticket: Ticket } as const;

function Field({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-night/55">{label}</p>
      <p className={`mt-1 font-mono font-medium text-night ${big ? "text-4xl tracking-tight sm:text-5xl" : "text-sm sm:text-base"}`}>
        {value}
      </p>
    </div>
  );
}

/** A boarding pass printed on candle-colored card: the one thing anyone has to do. */
function BoardingPass() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] rotate-[-1.5deg] transition-transform duration-500 hover:rotate-0">
      <div className="overflow-hidden rounded-[18px] bg-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center justify-between bg-holly px-6 py-3 text-ink">
          <span className="font-mono text-xs uppercase tracking-[0.22em]">Boarding pass</span>
          <span className="font-display text-lg font-semibold italic">KLM, or whatever gets you there</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 pt-7">
          <Field label="From" value="HOME" big />
          <AirplaneTilt size={30} weight="fill" className="text-lamp-deep" aria-hidden="true" />
          <div className="text-right">
            <Field label="To" value="AMS" big />
          </div>
        </div>
        <p className="px-6 pt-1 text-right font-mono text-xs text-night/60">Schiphol, Amsterdam</p>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 px-6 sm:grid-cols-3">
          <Field label="Passenger" value="The whole family" />
          <Field label="Arrive" value="Wed, Dec 22" />
          <Field label="Fly home" value="Sun, Jan 2" />
          <Field label="Seat" value="Next to Meggo" />
          <Field label="Baggage" value="Room for gifts" />
          <Field label="Gate" value="Max is waiting" />
        </div>
        <div className="relative mt-7 border-t-2 border-dashed border-night/20">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-night-2" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-night-2" />
        </div>
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <p className="font-display text-xl font-semibold italic leading-tight text-night">
            Your one job: book this flight.
          </p>
          <div
            aria-hidden="true"
            className="h-10 w-28 shrink-0 bg-[repeating-linear-gradient(90deg,#0d1417_0_2px,transparent_2px_4px,#0d1417_4px_5px,transparent_5px_9px)]"
          />
        </div>
      </div>
    </div>
  );
}

export function Deal() {
  return (
    <section id="deal" className="relative scroll-mt-16 bg-night-2">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <BoardingPass />
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={0.08}>
              <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                Nobody has a flight yet. <span className="italic text-lamp">That's the only part that's yours.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
                Land at Schiphol on the 22nd, fly out on the 2nd, or whatever your calendar allows. The minute you're on the
                ground, Max has it covered.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {maxHandles.map((m) => {
                  const Icon = icons[m.icon as keyof typeof icons];
                  return (
                    <div key={m.title} className="flex gap-4">
                      <Icon size={26} weight="duotone" className="mt-0.5 shrink-0 text-lamp" aria-hidden="true" />
                      <div>
                        <h3 className="text-base font-semibold text-ink">{m.title}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{m.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 border-t border-hairline pt-8">
                <Countdown />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
