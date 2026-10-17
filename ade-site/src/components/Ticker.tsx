import { memo } from "react";
import { Star } from "@phosphor-icons/react";

/* Pop-up event signal band. A bold ADE black-on-yellow ticker that runs right
   under the hero to foreground the one-day, show-up-or-miss-it nature of the
   event. Reuses the shared `.marquee-track` animation from index.css. Every
   phrase is a stated fact (date, time, venue, format) — nothing invented. */
const SIGNALS = [
  "ADE Pop-Up",
  "One day only",
  "Sat 24 Oct",
  "16:00 – 19:00",
  "Herengracht 609",
  "MCR-T",
  "DJ Cringey",
  "DJ Hyperdrive",
  "Clara Cuvé",
  "Limited HIFI 609 merch",
  "Arrive early",
  "HIFI 609 × Sesh Dawgs United",
];

export const Ticker = memo(function Ticker() {
  const row = [...SIGNALS, ...SIGNALS];
  return (
    <div
      className="relative overflow-hidden border-y border-ink/20 bg-delft text-ink"
      role="marquee"
      aria-label="ADE pop-up — one day only, Saturday 24 October, 16:00 to 19:00, Herengracht 609. MCR-T, DJ Cringey, DJ Hyperdrive, Clara Cuvé. Limited HIFI 609 merch. Arrive early."
    >
      <div className="marquee-track flex w-max items-center gap-7 py-2.5 whitespace-nowrap md:py-3.5">
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-7" aria-hidden>
            <span className="font-sesh text-[clamp(0.9rem,2.1vw,1.5rem)] uppercase leading-none tracking-[0.04em]">
              {s}
            </span>
            <Star weight="fill" className="h-2.5 w-2.5 shrink-0 md:h-3 md:w-3" />
          </span>
        ))}
      </div>
    </div>
  );
});
