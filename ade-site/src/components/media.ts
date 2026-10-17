/* Real, hotlinked media only. No stock, no AI generated images.
   Monument photos: Walther Schoonenberg via Amsterdam Monumentenstad (credited in footer).
   Music-video thumbnail: img.youtube.com (YouTube still for LINKS.maxVid). */

const MON = "https://www.amsterdam-monumentenstad.nl/database/uploads";

export const IMG = {
  facade: `${MON}/2/20171001-4.jpg`,
  facadeAlt: `${MON}/1/h609.JPG`,
  arms: `${MON}/2/h609_7555.jpg`,
  attic: `${MON}/1/20200321-49.jpg`,
  entrance: `${MON}/2/20170609-103.jpg`,
  historic1917: `${MON}/2/OSIM00002005483.jpg`,
  engraving: `${MON}/2/h609-611gb.jpg`,
  hall: `${MON}/2/20170609-84.jpg`,
  hall2: `${MON}/2/20170609-89.jpg`,
  stairs: `${MON}/2/20170609-32.jpg`,
  lantern: `${MON}/2/20170609-17.jpg`,
  balusters: `${MON}/2/20170609-27.jpg`,
  firstStone: `${MON}/2/20170609-31.jpg`,
  backRoom: `${MON}/2/20170609-41.jpg`,
  mantel: `${MON}/2/20170609-78.jpg`,
  stuccoFront: `${MON}/2/20170609-79.jpg`,
  voorhout: `${MON}/2/20170609-44.jpg`,
  verkolje: `${MON}/2/20170609-71.jpg`,
  verkolje2: `${MON}/2/20170609-62.jpg`,
  dewit1928: `${MON}/2/dewit-plafond2.jpg`,
};

/* HIFI purple logo — the exact uploaded "HF" neon mark (the high-res upload of
   17 Oct, square-cropped), served from public/images/hifi-logo.webp.
   hifiLogoSvg.ts (HIFI_LOGO_SVG) holds the earlier copy of the same mark
   inline as a SafeImg fallback. */
export const HIFI_LOGO = "/images/hifi-logo.webp";

/* Interior photography of the monument, supplied by HIFI. Shown in the history
   section and the footer, everywhere after the hero facade. Files live in
   public/images/venue/; if one ever fails to load, the hotlinked archive shot
   in `fallback` is used instead. */
export const VENUE = [
  { src: "/images/venue/stairs.webp", fallback: IMG.stairs, alt: "Looking up the stairwell: dark wooden balustrade and Louis XV stucco to the skylight" },
  { src: "/images/venue/painted-ceiling.webp", fallback: IMG.verkolje, pos: "object-[50%_15%]", alt: "The painted ceiling, a sky full of figures, over a room lit purple and pink" },
  { src: "/images/venue/fanlight.webp", fallback: IMG.entrance, alt: "The carved front door and arrow fanlight under a stucco ceiling" },
  { src: "/images/venue/grand-room-fisheye.webp", fallback: IMG.hall, alt: "Feet up in the grand room, fisheye view of the stucco ceiling and canal windows" },
  { src: "/images/venue/grand-room.webp", fallback: IMG.lantern, alt: "The grand room: stucco ceiling, gilded mirror and tall windows onto the Herengracht" },
  { src: "/images/venue/hallway.webp", fallback: IMG.hall2, alt: "The marble hallway with a red runner, rococo stucco and a hanging lantern" },
  { src: "/images/venue/gilded-room.webp", fallback: IMG.mantel, alt: "Gold-panelled room with a black marble fireplace, a cowhide chaise and a dog statue" },
];

/* Confirmed-artist press photos for the lineup (supplied by the organisers).
   Solo shots feed the headliner cards; `duo` is the two of them together,
   used as the editorial feature beside the lineup. */
export const ARTIST = {
  mcrt: "/images/mcrt.webp",
  claraCuve: "/images/clara-cuve.webp",
  duo: "/images/headliners.webp",
  kit: "/images/sesh-kit-duo.webp",
  cringey: "/images/dj-cringey.webp",
  hyperdrive: "/images/dj-hyperdrive.webp",
};

/* The SESH range as listed on sesh.group (names and prices from the shop).
   Product shots are cropped from the shop's own listing photos. */
export const MERCH = [
  { name: "SESH Kit Hoody 2026", price: "€85", img: "/images/merch/sesh-kit-hoody-2026.webp", note: "Black, white piping, crest on the chest, SESH across the front" },
  { name: "SESH Team Jersey White", price: "€60", img: "/images/merch/sesh-jersey-white.webp", note: "Oversized team cut with black piping" },
  { name: "SESH Team Jersey Black", price: "€60", img: "/images/merch/sesh-jersey-black.webp", note: "The matching-kits jersey, white piping" },
  { name: "SESH Team Jersey Pink", price: "€60", img: "/images/merch/sesh-jersey-pink.webp", note: "Soft pink, tonal piping, white crest" },
];

export const SESH_ART = "https://f4.bcbits.com/img/a3389353840_10.jpg";
export const SESH_ART_SMALL = "https://f4.bcbits.com/img/a3389353840_2.jpg";


export const MAX_PHOTO =
  "https://static.wixstatic.com/media/5336bf_1d1b4406b07245beb3cff42e49f006b0~mv2.jpg/v1/fill/w_700,h_875,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0626_JPG.jpg";
export const MAX_PHOTO2 =
  "https://static.wixstatic.com/media/5336bf_7bcf6d16df464dc6995dd687678bde6e~mv2.jpg/v1/crop/x_312,y_118,w_3549,h_3699/fill/w_400,h_417,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5336bf_7bcf6d16df464dc6995dd687678bde6e~mv2.jpg";

export const LINKS = {
  hifi: "https://hifiamsterdam.com",
  hifiYT: "https://www.youtube.com/@HiFiAmsterdam",
  hifiIG: "https://www.instagram.com/hifiamsterdam/",
  seshShop: "https://sesh.group/",
  seshIG: "https://www.instagram.com/seshdawgsunited/",
  seshBC: "https://seshdawgsunited.bandcamp.com/",
  mcrT: "https://www.instagram.com/kolegajj/",
  clara: "https://www.instagram.com/clara_cuve/",
  max: "https://www.bbmancini.com/",
  maxVid: "https://www.youtube.com/watch?v=qoUNy0NGnUg",
  monDB: "https://www.amsterdam-monumentenstad.nl/database/grachtenboek_objecten.php?id=1596",
};
