import { useEffect, useState } from "react";
import { ARRIVAL } from "../data/trip";

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function Countdown() {
  const [left, setLeft] = useState(() => split(ARRIVAL.getTime() - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(split(ARRIVAL.getTime() - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { value: left.days, label: "days" },
    { value: left.hours, label: "hours" },
    { value: left.minutes, label: "min" },
    { value: left.seconds, label: "sec" },
  ];

  return (
    <div>
      <p className="text-sm text-ink-soft">Until everyone lands at Schiphol</p>
      <div className="mt-3 flex items-end gap-6 sm:gap-9">
        {units.map((unit) => (
          <div key={unit.label}>
            <span className="block font-mono text-4xl font-medium leading-none tabular-nums tracking-tight text-ink sm:text-5xl" aria-hidden="true">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">{unit.label}</span>
          </div>
        ))}
      </div>
      <p className="sr-only">
        {left.days} days, {left.hours} hours and {left.minutes} minutes until the family lands in Amsterdam.
      </p>
    </div>
  );
}
