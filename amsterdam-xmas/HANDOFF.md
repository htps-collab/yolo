# Kerst in Amsterdam — handoff

A surprise invitation site for the Calcaterra family: Christmas and New Year's 2027 in Amsterdam,
hosted by Max. Private, family-only. Built from an earlier "Eastern Europe travel guide" draft,
which was replaced entirely.

**Live page:** https://claude.ai/artifact/7A8Yps1LdWR88f6Bdq4tVH (private Claude artifact, version 5).
Only Max can open it until he shares it from the page's Share menu.

## The trip being announced

- Arrive Wed **Dec 22, 2027**, fly home Sun **Jan 2, 2028** (11 nights). Every weekday in the
  itinerary is computed for that year — if the dates move, fix `weekday` in `src/data/trip.ts` too.
- The pitch: everyone books their own flight, Max covers everything else.
- Three places to sleep: the Hifi Studio (16-bedroom 1738 canal mansion, free), a few hotel rooms
  next door, Max's house.

## Stack

Vite 7 + React 19 + TypeScript, Tailwind v4 (`@tailwindcss/vite`), Motion (`motion/react`),
`@phosphor-icons/react`, `canvas-confetti`. No router, no backend, no analytics.

```bash
npm install
npm run dev       # local dev
npm run build     # -> dist/
npm run preview   # serve dist/ (opening dist/index.html directly will NOT work)
```

## Layout of the code

`src/App.tsx` renders, in order: `Gate`, `Snowfall`, `Nav`, `MusicToggle`, then `Hero`, `Deal`,
`GuestList`, `Stay`, `Dutch`, `Days`, `Scrapbook`, `Surprises`, `Closer`.

- **`data/trip.ts`** — all content: arrival date, the intro roll call, the nine guest-list
  "houses" (lore + their personal Amsterdam pick), what Max handles, Dutch traditions, the
  twelve itinerary days, scrapbook captions, and `HERO_BG`. Edit copy here, not in components.
- **`components/Gate.tsx`** — the surprise intro. Sealed screen -> `Seal` -> roll call where each
  name walks a cutout on stage -> "Amsterdam." with confetti. Two rows of figures on phones, one
  on desktop. Adding `?plan` to the URL skips the whole intro (handy for testing and for linking
  someone straight to the plan). Session storage key `kerst-2027-opened`.
- **`components/Seal.tsx`** — press-and-hold wax seal: 3-2-1 countdown, growing tremble, music
  swelling in, then the seal cracks in half with a gold flash. Tapping instead of holding shows a
  "hold it down" hint.
- **`components/GuestList.tsx`** — the canal street. Each person gets a house with a real Amsterdam
  gable (clip-paths in `index.css`), lit windows, a hoist beam, and their cutout standing inside
  with their head through the roofline. Drag it with a mouse: 1:1 tracking, then momentum
  projection and a spring settle onto the nearest house. Touch keeps native scrolling.
- **`components/Dutch.tsx`** — Shea's Dutch-holiday explainer, with `LightSign` above the figures.
- **`components/LightSign.tsx`** — the hanging FREE PALESTINE signboard: painted wood, cut corners,
  gold-leaf type, corner screws, chains, and a strand of teardrop bulbs drooping over the top.
- **`audio.ts`** — one looping `<audio>`. Browsers block autoplay until a gesture, so the seal press
  starts it; on a revisit `armAutoplay()` starts it on first interaction. `setMusicLevel()` swells
  the volume while the seal is held. **iOS Safari ignores `volume`**, so on iPhone it just starts at
  full level; don't spend time debugging that.

## Motion

Apple's fluid-interface approach: critically damped springs (`bounce: 0`) as the default rather
than fixed-duration easing, press feedback on pointer-down, spring-smoothed parallax in the hero,
momentum projection in the guest rail, a nav bar that frosts gradually with scroll. Everything
collapses to static under `prefers-reduced-motion`.

## Images

All photos live in `public/img/*.webp` and were produced from Max's originals in
`~/Downloads/xmaspics` plus `~/Pictures/BTS SHOTS HIFI ZEYNEP` and `~/Pictures/HF BTS BOUJEEPOST`.

- Cutouts were made with macOS's Vision framework (`VNGenerateForegroundInstanceMaskRequest`) via a
  small Swift tool, then graded with Pillow: one shared warm-evening grade, lifted shadows,
  unsharp mask, Lanczos upscaling for the low-res ones, and alpha fades where a subject was cut off
  by the original frame.
- `everyone.webp` is a composite: the six-person crew photo with Dan, Ty and Elana added and the
  three kids composited in front (Max cropped out of the kids' photo so he doesn't appear twice).
- `night-canal.webp` / `night-canal-tall.webp`: Reguliersgracht at Christmas by Luis van den Bos
  (Unsplash). `sinterklaas.webp`: Bram van der Vlugt with the horse Amerigo, by Pieter Wiersinga for
  Wikiportrait, CC BY-SA 4.0. **Both are credited in the footer — keep those credits.**
- Music is an original synthesized arrangement of Carol of the Bells into Deck the Halls, both
  public-domain melodies, rendered to `public/audio/christmas-medley.mp3` (96s seamless loop).
  Nothing here is licensed stock, so there's nothing to renew.

The Python/Swift asset scripts lived in a session scratchpad and are gone; the outputs in
`public/img` are the source of truth now. Re-cutting a photo means redoing that pipeline.

## Publishing an update

The artifact is a plain static build, published as a page plus supporting files:

1. `npm run build`
2. Publish `dist/index.html`'s content as the page — but note the artifact page must not contain
   `<!doctype>`, `<html>`, `<head>` or `<body>` tags. The published page is a stripped version:
   title, font links, the stylesheet link, a background style, `<div id="root">`, and the module
   script, with `assets/...` paths (no leading `./`).
3. Publish `assets/`, `img/` and `audio/` alongside it, and pass `null` for the previous build's
   hashed `assets/index-*.js` and `.css` so old files don't pile up.
4. Artifacts block external images and media, so everything must ship as a published file.
   Don't reintroduce remote image URLs (the original draft used Pexels links).

## Decisions worth knowing

- **No Zwarte Piet imagery.** Max asked twice; the traditional look is blackface and it stays off
  the page. The Sinterklaas section explains the shift to soot-smudged Piet instead. If Max adds a
  photo himself, it goes in `public/img` and gets referenced in `Dutch.tsx`.
- **"I'm in" goes nowhere.** It fires confetti and says to tell Max in the group chat. Options
  offered but not built: a pre-filled text to Max, or a live RSVP list where each person taps their
  name.
- **"Hifi Studio"** is an assumption from Max's folder names (he dictated "headlock studio").
  Worth confirming before the family sees it.
- Unused leftovers in `public/img`: `crew.webp`, `elana.webp`, `m-salon.webp`, `p-nineties.webp`,
  `max-kids-kiss.webp`. Kept as source material for recomposites.

## If you change one thing, change it here

Copy edits: `src/data/trip.ts`. Dates: `ARRIVAL` there, plus the boarding pass fields in
`Deal.tsx` and the date line in `Gate.tsx`. Colors and gables: `src/index.css` theme block.
