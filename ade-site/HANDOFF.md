# Handoff: HIFI 609 × Sesh Dawgs United — ADE pop-up website

Session handoff written 17 Oct 2026. Attach this file together with
`ade-event-website-design.zip`, the project in its latest state. This file is
also inside the zip, at the project root.

## Next session's goal

Turn the site into a **public-facing** event page. Remove the content that was
written for the collaboration proposal between HIFI and Sesh Dawgs United (who
brings what, the donation request, crew logistics, internal timings, production
rationale). The owner will share more detail at the start of the new session.
Section 7 below is a first-pass map of what looks internal versus public.
Confirm it with the owner before cutting anything.

---

## 1. Quick start

```bash
unzip ade-event-website-design.zip -d site && cd site
npm install
npx tsc --noEmit      # type-check: run it, because the build does NOT type-check
npm run build         # vite + vite-plugin-singlefile -> dist/index.html (+ dist/images, dist/fonts, …)
```

**Verifying in the browser.** Serve `dist` over HTTP. Don't open it as a
`file://` URL: images and fonts use absolute `/images/...` and `/fonts/...`
paths, which only resolve when served.

```bash
cd dist && (nohup python3 -m http.server 8139 >/dev/null 2>&1 &)
```

Playwright with Chromium works for screenshots: `executablePath` is
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and the global package is
at `/opt/node-tools/node_modules/playwright`, so run scripts from
`/opt/node-tools`.

**Sandbox limits (Claude Code cloud).** The egress proxy blocks almost every
external host: ra.co, YouTube, Google Fonts, amsterdam-monumentenstad.nl,
Shopify, Bandcamp, Wix, the Met. Hotlinked images therefore show their fallback
in sandbox screenshots, but they load for real visitors. npm and PyPI are
reachable. Fonts are self-hosted, so typography renders correctly in the
sandbox.

---

## 2. The event (facts used across the site)

| | |
|---|---|
| What | Sesh Dawgs United pop-up during Amsterdam Dance Event (ADE): merch sales and a livestream |
| Headline | **SESH DAWGS UNITED / AT HIFI 609** |
| When | **Saturday 24 October 2026, doors 16:00–19:00** Amsterdam time (CEST, UTC+2). Optional extra hour to 20:00 if a fourth DJ is booked |
| Where | Herengracht 609, Amsterdam: HIFI 609 / HIFI Studios, a 1742 canal monument and Rijksmonument (no. 1689) |
| Host | HIFI Amsterdam ("Hidden Frequencies"), run by **Boom Boom Mancini** |
| Partner | Sesh Dawgs United (SESH), a Berlin label and crew |
| Confirmed DJs | **MCR-T** and **Clara Cuvé** (two more slots are TBA or optional) |
| Stream | HIFI YouTube: https://www.youtube.com/@HiFiAmsterdam |
| Owner's music video | https://www.youtube.com/watch?v=qoUNy0NGnUg (the footer "Now playing" card) |

All the links live in `src/components/media.ts` (`LINKS`). Event time and place
live in `src/components/event.ts`, which is the single source of truth for the
countdown, the calendar links and the maps link.

---

## 3. The owner's standing preferences (keep following these)

- **They love the original design and flow.** Changes have to genuinely add to
  the experience; don't restructure for its own sake. The second reference site
  they shared earlier was context only.
- **HIFI logo:** use their exact image file
  (`public/images/hifi-logo.webp`). Never recreate or redraw it. The
  favicons are crops of that same file.
- **Name:** always **Boom Boom Mancini**, never "Max" or "Max Calcaterra". This
  includes casual mentions; the short form "Boom Boom" is used in the donation
  reply text.
- **The venue is a "monument" or "mansion", never a "house".** "Space" is
  acceptable but should be grander. *Exception kept on purpose:* the history
  timeline still says the building began as "four houses" for David ter Haar,
  because that's historical fact. The owner was told about this and didn't
  object.
- **Emphasise that it's a pop-up** (one day only, ADE).
- **Headliner tag** on both cards: **"CERTIFIED SESH DAWG"**.
- **Brand voices:** SESH is set in **Anton** in ADE yellow `#FFFF07`. HIFI is
  set in **Silkscreen** pixel bold, ivory with a purple neon glow (`#a855f7`).
  Editorial headings use **Newsreader** (with optical sizing) and body text uses
  **Geist** and Geist Mono. One dark theme.
- **Deliverable:** always send the owner a zip of the project when done,
  excluding `node_modules` and `dist`.

---

## 4. What was done in the previous session (chronological)

1. **HIFI logo fix:** replaced a hand-drawn stand-in logo and placeholder PNG
   with the owner's exact uploaded image. The inline fallback
   (`hifiLogoSvg.ts`) is that same image, base64-encoded.
2. **Pop-up emphasis:** a live "ADE POP-UP — ONE DAY ONLY" badge, a facts row
   (date / time / venue / merch + livestream) and a yellow ticker band
   (`Ticker.tsx`) under the hero.
3. **Renamed Max → Boom Boom Mancini** throughout.
4. **Sticky header glitch fixed:** the hide-on-scroll used a ±4px threshold
   that kept flipping under Lenis smooth scroll. It now uses an 8px dead zone
   measured from the last committed position, plus hysteresis on the solid
   background. Verified by a scripted scroll: one hide, no oscillation.
5. **"House" → monument/mansion** copy pass.
6. **Music video:** a "Now playing" card with a YouTube thumbnail in the
   footer, under Boom Boom Mancini's quote.
7. **Headliners:** the owner supplied 5 press photos. They are used as:
   - solo MCR-T → `public/images/mcrt.webp` (tight upper-body crop)
   - solo Clara Cuvé → `public/images/clara-cuve.webp`
   - duo in front of a speaker wall → `public/images/headliners.webp` (lineup
     feature card and the share card)
   - duo in matching SESH kits on stone steps →
     `public/images/sesh-kit-duo.webp` (merch lookbook)
   - Miami night shot (not used)

   The lineup became two large 3:4 headliner cards (grayscale that turns to
   colour on hover, CONFIRMED pill, a one-line "sound" description from each
   artist's own bio) with the TBA slots in a slim list below.
8. **Hero line** "at Herengracht 609" became **"AT HIFI 609"** in Silkscreen
   with a purple glow.
9. **Refinement pass:**
   - live **countdown** in the hero, which switches to "Live now" (with a link
     to the stream) during 16:00–19:00 and to a watch-back message afterwards;
     all three states were tested
   - a **doors chip** in the sticky nav: "18D 07H", then LIVE NOW, then hidden
   - **Add to calendar**: a static RFC 5545 `.ics` file (validated with a
     parser) plus a Google Calendar link, in the hero and the footer
   - **Directions** links on the address tile and in the footer
   - **Merch lookbook** with a toggle: "Worn / The hoody", captioned "Two
     kits, one for a friend."
   - **Self-hosted fonts** in `public/fonts`, replacing Google Fonts
     (GDPR-safe, no third-party request)
   - **OG share card** `public/og.jpg` (1200×630), favicons, Twitter card,
     schema.org Event JSON-LD with mixed attendance (in person + stream)
   - **Fixes:** glow clipped into rectangles by the word-reveal masks, broken
     images showing in the House section, a see-through calendar menu, a
     `LINKS` naming clash in Nav, the low-contrast card index, straight quotes,
     and the facts row on mobile (now a 2×2 grid)

---

## 5. File map

```
index.html                     meta, OG/Twitter, JSON-LD Event, font preloads, favicons
public/
  images/                      hifi-logo.webp, mcrt.webp, dj-cringey.webp, dj-hyperdrive.webp, merch/, venue/, clara-cuve.webp, headliners.webp, sesh-kit-duo.webp
  fonts/                       self-hosted woff2 (latin): Newsreader opsz (+italic), Geist, Geist Mono, Anton, Silkscreen 400/700
  og.jpg                       share card
  favicon-32.png, apple-touch-icon.png
  sesh-dawgs-united-hifi-609.ics
src/
  index.css                    @font-face rules, Tailwind v4 @theme tokens (ink/ivory/delft=ADE yellow), .glass, .grain, marquee
  App.tsx                      section order: Nav, Hero, Ticker, Hosts, Day, House, Frame, Flow, Stream, Logistics, Donation, Footer
  components/
    event.ts                   DOORS_OPEN/CLOSE (UTC), MAPS_URL, ICS_URL, GCAL_URL, useEventClock()
    media.ts                   IMG (hotlinked monument photos), ARTIST (local photos), LINKS, HIFI_LOGO
    Countdown.tsx              hero countdown (before/live/after) + AddToCalendar menu (also used in Footer)
    Nav.tsx                    sticky pill nav, hide-on-scroll, DoorsChip, mobile menu
    Hero.tsx  Ticker.tsx  Hosts.tsx  Day.tsx (facts, lineup, run of day)  House.tsx (history)
    Frame.tsx (decks/camera rationale + de Wit ceiling)  Flow.tsx (floor plan + lookbook)
    Stream.tsx  Logistics.tsx  Donation.tsx  Footer.tsx
    motion.tsx (Reveal, WordReveal, Eyebrow, easings)  SafeImg.tsx (img with fallback chain)  SmoothScroll.tsx (Lenis)
```

---

## 6. Gotchas learned the hard way

- **`npm run build` doesn't type-check.** Always run `npx tsc --noEmit` too
  (`noUnusedLocals` and `noUnusedParameters` are on).
- **`Nav.tsx` has its own local `LINKS` array** (the menu items). The media
  links are imported as `SITE`.
- **`vite-plugin-singlefile` base64-inlines anything imported.** Large assets
  (images, fonts) go in `public/` and are referenced by absolute URL so they
  stay separate cacheable files.
- **`WordReveal` wraps each word in an `overflow-hidden` box,** which clips
  `text-shadow` into rectangles. Use `filter: drop-shadow(...)` on the line
  wrapper instead.
- **A `backdrop-filter` element nested inside another one doesn't blur.**
  Popovers inside `.glass` cards need a solid background.
- **Motion rewrites `opacity` every frame,** so setting `style.opacity` in an
  `onError` handler on a `motion.img` doesn't hide it. Swap the element through
  state instead (see `House.tsx`).
- **Testing the countdown phases:** use Playwright `page.clock.setFixedTime()`.
  `clock.install()` also fakes `requestAnimationFrame`, which freezes Motion's
  entrance animations.
- **Don't run `pkill -f "<pattern>"`** in a shell whose own command line
  contains that pattern; it kills itself (exit 144).

---

## 7. Public-facing conversion: first-pass content map (confirm with the owner)

| Section | Status | Notes |
|---|---|---|
| Nav | Rework | Drop the "Donation" link (and "Flow" if that section goes). Doors chip is public-ready. |
| Hero | Keep | Public-ready: badge, title, facts, countdown, add to calendar. |
| Ticker | Keep | |
| Hosts (HIFI × SESH cards) | Keep | Public brand intros. |
| Day: facts tiles | Light edit | "One more hour if the room is flying" is internal wording; "Four-camera switch" is fine. |
| Day: lineup | Edit | Headliner cards are public-ready. Rewrite the intro "Two names locked, two to land. A fourth DJ is what unlocks the extra hour on the stream." TBA rows say "SESH to confirm" / "Unlocks the 19:00 to 20:00 extension", which are internal. Decide whether to show TBA slots at all. |
| Day: run of the day | Rework | 13:00 "Crew call" and 15:00 "DJs arrive… Sesh's call" are internal. A public timeline would start at 16:00 doors (with set times once known). |
| House (history timeline) | Keep, 1 edit | Public heritage story. The hallway chapter says "On the night this is the staff lane: roped, watched, kept clear." That's operational; reword as a visitor note or cut it. |
| Frame ("Why the decks stay exactly where they are") | Rework or cut | Production rationale written for the partner. The de Wit ceiling story ("Painted for this mansion.") is public-worthy and could stay. |
| Flow (floor plan + steps) | Mostly internal | Security counting heads, staff lane, crew-led groups, merch table moving. Could become a short public visitor guide (arrive → shop → watch the set, respect the monument) or go. **Keep the merch lookbook.** |
| Stream | Rework | Camera gear, signal chain (ATEM/OBS), the wifi caveat and "Got an Insta360… Bring it" are aimed at the partner. Public version: "Watch live" with the HIFI YouTube link. Possibly keep one line about the room on camera. |
| Logistics ("Who brings what / HIFI brings the monument / What we need from Sesh") | **Remove** | Pure partnership negotiation. The "provides" marquee goes with it. |
| Donation (€200, payment methods, "Copy reply for Boom Boom") | **Remove** | A private arrangement between the partners. |
| Footer | Keep | Quote, music video card, Where/When (+ directions and calendar), hosts, links, photo credits. |
| index.html meta | Update | Description is fine. Change `og:image`/`og:url` to absolute URLs once the domain is known (Facebook and LinkedIn need them). |

**Things a public page usually needs that the site doesn't have yet** (ask the
owner): entry policy (free? RSVP? capacity?), age limit, guest house rules for
a monument, accessibility info, contact or press, set times once confirmed, and
merch prices or drop details.

---

## 8. Open items carried over

- **Hotlinked images:** monument photos (amsterdam-monumentenstad.nl), the
  SESH hoody (Shopify), SESH cover art (Bandcamp), the Met ceiling study, Boom
  Boom Mancini portraits (Wix) and the YouTube thumbnail are all loaded from
  other sites. Download them into `public/` before launch; this sandbox can't
  reach those hosts. `SafeImg` and the House fallback prevent visible breakage
  meanwhile.
- **`og:image` / `og:url` need absolute URLs** once the domain is set.
- **Countdown date** is hard-coded in `event.ts` (2026-10-24, 16:00–19:00
  CEST). The JSON-LD in `index.html` and the `.ics` file repeat the same times;
  update all three together.
- **Verify MCR-T's Instagram handle.** The original design used `@kolegajj`
  (`LINKS.mcrT`) and it was never confirmed.
- **Photo mapping** (which upload became which image) was stated to the owner
  and not contested.

---

## 9. Session of 17 Oct 2026: public-facing conversion (done)

- **Removed:** Logistics (who brings what), Donation (€200), Stream (camera
  specs, signal chain, wifi caveat), Frame (decks/camera rationale), and the
  Flow floor plan / sales logistics.
- **Lineup:** four artist cards in set order with set-time pills. DJ Cringey
  (`public/images/dj-cringey.webp`) and DJ Hyperdrive
  (`public/images/dj-hyperdrive.webp`) added. Tag on the new DJs: "On the decks".
- **Timetable** (replaces "Run of the day"): `SETS` in `event.ts` is the single
  source for cards, timetable, ticker, .ics and JSON-LD.
  16:00 MCR-T · 16:45 DJ Cringey · 17:30 DJ Hyperdrive · 18:15 Clara Cuvé.
- **Merch** (`Merch.tsx`, `#merch`): kit lookbook photo, four SESH products
  (`MERCH` in `media.ts`, images cropped from the sesh.group listing into
  `public/images/merch/`), HIFI 609 limited-edition banner, links to sesh.group.
- **House rules** (`Rules.tsx`, `#rules`): arrive early / limited capacity,
  UNESCO monument, stay in accessible areas, no smoking or drugs, hands off.
- **History** (`House.tsx`): cut to four chapters + a 3-photo gallery. All
  images after the hero facade come from `VENUE` in `media.ts`, which points at
  `public/images/venue/` (stairs, painted-ceiling, fanlight, grand-room-fisheye, grand-room, hallway, gilded-room .webp; supplied by HIFI). All seven are in; the old hotlinked archive photos remain
  only as a load-failure fallback.
