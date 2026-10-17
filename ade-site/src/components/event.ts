import { useEffect, useState } from "react";

/* Single source of truth for when and where the pop-up happens.
   Doors 16:00–19:00 Amsterdam time on Saturday 24 October 2026. Amsterdam is
   still on summer time (CEST, UTC+2) that day — clocks go back the next
   morning — so 16:00 local is 14:00 UTC. */
export const DOORS_OPEN = Date.UTC(2026, 9, 24, 14, 0);
export const DOORS_CLOSE = Date.UTC(2026, 9, 24, 17, 0);

const ADDRESS = "Herengracht 609, Amsterdam";
const TITLE = "Sesh Dawgs United at HIFI 609 — ADE Pop-Up";
const DETAILS = "One day only. MCR-T, DJ Cringey, DJ Hyperdrive and Clara Cuvé live, SESH kits and limited HIFI 609 merch, inside the 1742 monument at Herengracht 609. Capacity is limited: arrive early.";

const utcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/* The timetable. Four 45-minute sets fill the door hours back to back. */
export const SETS = [
  { start: "16:00", end: "16:45", artist: "MCR-T" },
  { start: "16:45", end: "17:30", artist: "DJ Cringey" },
  { start: "17:30", end: "18:15", artist: "DJ Hyperdrive" },
  { start: "18:15", end: "19:00", artist: "Clara Cuvé" },
] as const;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

/* Static file in public/, so iOS Safari hands it straight to Calendar. */
export const ICS_URL = "/sesh-dawgs-united-hifi-609.ics";

export const GCAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(TITLE)}` +
  `&dates=${utcStamp(DOORS_OPEN)}/${utcStamp(DOORS_CLOSE)}` +
  `&details=${encodeURIComponent(DETAILS)}` +
  `&location=${encodeURIComponent(`HIFI 609, ${ADDRESS}`)}`;

export type Phase = "before" | "live" | "after";

/* Ticks on an interval and reports where we are relative to the doors. */
export function useEventClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  const phase: Phase = now < DOORS_OPEN ? "before" : now < DOORS_CLOSE ? "live" : "after";
  const left = Math.max(0, DOORS_OPEN - now);
  return {
    phase,
    days: Math.floor(left / 86_400_000),
    hours: Math.floor(left / 3_600_000) % 24,
    minutes: Math.floor(left / 60_000) % 60,
    seconds: Math.floor(left / 1000) % 60,
  };
}
