/** Wheels down at Schiphol. Everything before this is the waiting part. */
export const ARRIVAL = new Date(2027, 11, 22, 10, 0, 0);

export const img = (name: string) => `./img/${name}.webp`;

/** The roll call in the intro: each name brings its person onto the stage. */
export const rollCall: { line: string; cutout: string; ratio: number; alt: string; scale?: number }[] = [
  { line: "Dave.", cutout: "dave", ratio: 0.67, alt: "Dave in wraparound sunglasses", scale: 0.8 },
  { line: "Meggo.", cutout: "meg", ratio: 0.41, alt: "Meg in a jeweled cap" },
  { line: "Shea.", cutout: "shea", ratio: 0.528, alt: "Shea, smiling", scale: 0.62 },
  { line: "Ty.", cutout: "ty", ratio: 0.81, alt: "Ty raising a glass", scale: 0.7 },
  { line: "Avery June, Olive and Theo.", cutout: "max-kids", ratio: 0.82, alt: "Avery June, Olive and Theo piled onto Max" },
  { line: "Sam.", cutout: "sam", ratio: 0.6, alt: "Sam in a black bowl-cut wig", scale: 0.72 },
  { line: "Dan the Man.", cutout: "dan-euro", ratio: 0.83, alt: "Dan in sunglasses and a plaid blazer" },
  { line: "Sophie and Elana.", cutout: "sophie-elana", ratio: 0.8, alt: "Sophie and Elana on a canal-side windowsill" },
];

export interface Person {
  id: string;
  name: string;
  plaque: string;
  cutout: string;
  alt: string;
  lore: string;
  amsterdam: string;
  gable: "step" | "neck" | "spout" | "bell" | "cornice";
  tone: string;
  height: number;
  /** extra cutout that stands beside the main one */
  sidekick?: { src: string; alt: string };
}

export const people: Person[] = [
  {
    id: "dave",
    name: "Dave",
    plaque: "Head honcho",
    cutout: "dave",
    alt: "European Dave, sunglasses on, unbothered",
    lore: "Head of the family and the busiest man in retirement. Has a Caddyshack line for every occasion.",
    amsterdam:
      "A winter tee time at Spaarnwoude, a public course half an hour out that stays open all year. Be the ball, Dave.",
    gable: "step",
    tone: "#2a201c",
    height: 470,
  },
  {
    id: "meg",
    name: "Meggo",
    plaque: "Life of the party",
    cutout: "meg",
    alt: "European Meg in a velvet tracksuit and jeweled cap",
    lore: "Always out, always talking to someone new. Will know the bartender's whole life story by round two.",
    amsterdam:
      "The brown cafes, where strangers share long wooden tables. Cafe Hoppe has been pouring since 1670. She will run the room by nine.",
    gable: "bell",
    tone: "#1e2a2d",
    height: 500,
  },
  {
    id: "shea",
    name: "Shea",
    plaque: "The teacher",
    cutout: "shea",
    alt: "Shea, smiling in an olive top",
    lore: "The oldest, always down for a good time, and the family's authority on Dutch holiday lore. Sinterklaas, Piet, the whole saga. Also the only big sister on Earth who can still traumatize her little brother well into his mid-thirties.",
    amsterdam:
      "Leading the Dutch Christmas briefing further down this page, then the Rijksmuseum right at opening, before the crowds.",
    gable: "neck",
    tone: "#2b2521",
    height: 480,
  },
  {
    id: "ty",
    name: "Ty",
    plaque: "Mr. Reliable",
    cutout: "ty",
    alt: "Ty toasting with a beer",
    lore: "Super cool, super dependable, St. Louis sports forever. Works for JBL, so he will have notes on the sound system.",
    amsterdam:
      "A proper soundcheck on the studio speakers. Then the swing at A'DAM Lookout, hung off the edge of a tower above the river IJ.",
    gable: "cornice",
    tone: "#1f262e",
    height: 440,
  },
  {
    id: "kids",
    name: "Avery June, Olive and Theo",
    plaque: "The next generation",
    cutout: "max-kids",
    alt: "Avery June, Olive and Theo hugging Max",
    lore: "The oldest, the middle and the youngest. Already experts at tackling Uncle Max.",
    amsterdam:
      "Skating at Museumplein, the zoo and planetarium at ARTIS, the NEMO rooftop, and an oliebol in each hand.",
    gable: "spout",
    tone: "#29211f",
    height: 520,
    sidekick: { src: "theo", alt: "Theo in a blue suit and bow tie" },
  },
  {
    id: "sam",
    name: "Sam",
    plaque: "The rock",
    cutout: "sam",
    alt: "European Sam in a black bowl-cut wig",
    lore: "Level-headed, chill, and the sweetheart who cleans to de-stress. Loves every animal on Earth, and a few from beyond it.",
    amsterdam:
      "ARTIS, the old city zoo, which has its own planetarium. Animals and outer space in one afternoon. Also: sixteen bedrooms, and she is not allowed to clean any of them.",
    gable: "step",
    tone: "#1c2629",
    height: 460,
  },
  {
    id: "dan",
    name: "Dan the Man",
    plaque: "Crate digger",
    cutout: "dan-euro",
    alt: "European Dan in a plaid blazer and sunglasses",
    lore: "The sweetest guy there is. Cardinals fan for life, vinyl collector, always hunting for cool stuff.",
    amsterdam:
      "A record-shop crawl: Concerto on Utrechtsestraat, then Waxwell. Pack a half-empty suitcase. You will need it.",
    gable: "bell",
    tone: "#2a2320",
    height: 490,
  },
  {
    id: "sophie-elana",
    name: "Sophie and Elana",
    plaque: "Tofu and her person",
    cutout: "sophie-elana-bridge",
    alt: "Sophie and Elana on an Amsterdam canal bridge",
    lore: "Sophie: Max's twin and the most stubborn person alive, lovingly. Basketball, love, and Love and Basketball. Elana: the caring one who looks after her. Yoga, hot girl stuff.",
    amsterdam:
      "Elana: a candlelit morning class at Delight Yoga. Sophie: Max has found a court. First to 21, loser buys oliebollen.",
    gable: "neck",
    tone: "#1e2528",
    height: 500,
  },
  {
    id: "max",
    name: "Max",
    plaque: "Your host",
    cutout: "sophie-max",
    alt: "Max and his twin Sophie in matching Keith Haring shirts",
    lore: "The crazy, eclectic European of the family. Goes to work in a 1738 mansion every morning, which he considers normal.",
    amsterdam: "Everything else. You book one flight. He handles every bed, train, table, ticket and boat after that.",
    gable: "cornice",
    tone: "#2a1f1e",
    height: 510,
  },
];

export const maxHandles = [
  { icon: "bed", title: "Every bed", text: "A mansion room, a hotel room or Max's couch. Your pick, already sorted." },
  { icon: "train", title: "Airport to door", text: "Train tickets and directions from Schiphol, waiting for you when you land." },
  { icon: "fork", title: "Every table", text: "Christmas Eve, gourmetten, the brown cafes, the good oliebollen stall." },
  { icon: "ticket", title: "Every ticket", text: "Skates, the light festival boat, museums, the swing over the IJ." },
];

export interface Tradition {
  word: string;
  when: string;
  text: string;
}

export const traditions: Tradition[] = [
  {
    word: "Sinterklaas",
    when: "December 5",
    text: "The big Dutch present night happens before Christmas. The saint arrives by steamboat in November, with his helpers the Pieten. These days most cities do them with soot smudges instead of the old blackface, and Shea can tell you exactly why.",
  },
  {
    word: "Kerstavond",
    when: "December 24",
    text: "Christmas Eve. Candles in every window, church bells across the canals, one long dinner.",
  },
  {
    word: "Eerste and Tweede Kerstdag",
    when: "December 25 and 26",
    text: "The Dutch get two Christmas Days. The first is family and food. On the second, the whole country goes back out.",
  },
  {
    word: "Gourmetten",
    when: "Christmas dinner",
    text: "A tabletop grill in the middle of the table, tiny pans for everyone, three hours of cooking your own dinner. Nobody gets stuck in the kitchen.",
  },
  {
    word: "Oliebollen",
    when: "All of December",
    text: "Hot fried dough, buried in powdered sugar, sold from wooden stalls on street corners. New Year's Eve is their big night.",
  },
  {
    word: "Oudejaarsavond",
    when: "December 31",
    text: "New Year's Eve. Champagne, oliebollen, and at midnight the sky over the city goes up. We watch from the studio roof.",
  },
  {
    word: "Nieuwjaarsduik",
    when: "January 1",
    text: "Thousands of people in matching orange hats run into the freezing North Sea, then warm up with pea soup. Optional. Highly encouraged.",
  },
];

export interface Day {
  date: string;
  weekday: string;
  title: string;
  note?: string;
  items: string[];
  image?: { src: string; alt: string };
}

export const days: Day[] = [
  {
    date: "Dec 22",
    weekday: "Wed",
    title: "Everybody lands",
    items: [
      "Max meets you with train tickets. Fifteen minutes from Schiphol to Centraal",
      "Drop the bags at the studio, pick your bedroom, gasp at the ceilings",
      "Slow walk along the lit-up canal ring while the jet lag argues with you",
      "First dinner in a brown cafe with candles on the tables. Early night allowed",
    ],
    image: { src: "m-facade", alt: "The studio's canal-house front at dusk, windows glowing" },
  },
  {
    date: "Dec 23",
    weekday: "Thu",
    title: "Ice and light",
    items: [
      "Skating at Ice Amsterdam on Museumplein, the Rijksmuseum lit up behind the rink",
      "Hot chocolate in the Vondelpark, then Dan's record run through Concerto and Waxwell",
      "After dark: the Amsterdam Light Festival from a private electric boat, blankets and gluhwein on board",
    ],
  },
  {
    date: "Dec 24",
    weekday: "Fri",
    title: "Kerstavond",
    note: "Non-negotiable",
    items: [
      "Morning yoga with Elana for whoever is brave. ARTIS zoo and planetarium for Sam and the kids",
      "Afternoon in the Jordaan: hidden courtyards, tiny shops, apple pie at Winkel 43",
      "Christmas Eve dinner under the cherub ceiling, candles everywhere, toasts that run long",
      "Midnight carols at the Westerkerk for anyone still awake",
    ],
    image: { src: "m-fresco", alt: "Painted cherubs across the studio's ceiling" },
  },
  {
    date: "Dec 25",
    weekday: "Sat",
    title: "Eerste Kerstdag",
    items: [
      "Pajamas until noon. Stockings and presents in the mansion",
      "Gourmetten: tabletop grills, tiny pans, three hours minimum",
      "Caddyshack on the big screen. Dave narrates",
    ],
  },
  {
    date: "Dec 26",
    weekday: "Sun",
    title: "Tweede Kerstdag, over the water",
    items: [
      "Free ferry from behind Centraal across the IJ to Amsterdam Noord",
      "NDSM wharf: shipyard halls, giant street art, and the IJ-Hallen flea market if it is on that weekend",
      "Lunch at Pllek, right on the water, with a fire going",
      "Ty and Dave on the A'DAM Lookout swing. Everyone else films it",
    ],
  },
  {
    date: "Dec 27",
    weekday: "Mon",
    title: "Haarlem and the North Sea",
    items: [
      "Fifteen-minute train to Haarlem, a small storybook version of Amsterdam",
      "On to Zandvoort for a wild winter beach walk",
      "Beach-club lunch by the fire, back in the city for dinner",
    ],
  },
  {
    date: "Dec 28",
    weekday: "Tue",
    title: "Choose your own day",
    items: [
      "Dave: a round at Spaarnwoude",
      "Meggo, Sophie and Elana: saunas and pools at Spa Zuiver in the Amsterdamse Bos",
      "Evening: Winter Parade at Westergas, a winter circus and dinner show locals book every year",
    ],
  },
  {
    date: "Dec 29",
    weekday: "Wed",
    title: "Museums, the smart way",
    items: [
      "Rijksmuseum at opening with Shea, Stedelijk for modern art, NEMO's rooftop for the kids",
      "Jenever tasting at Wynand Fockink, a 1679 tasting room down a tiny alley",
      "Sophie's basketball game. Stakes: oliebollen",
    ],
  },
  {
    date: "Dec 30",
    weekday: "Thu",
    title: "Utrecht by train",
    items: [
      "Half an hour south to a city whose canals have cellars at water level, now full of cafes",
      "Climb the Dom Tower for the view, then a long lunch on the wharf",
      "Home for a quiet night. Big one tomorrow",
    ],
  },
  {
    date: "Dec 31",
    weekday: "Fri",
    title: "Oudejaarsavond",
    note: "Non-negotiable",
    items: [
      "Oliebollen from Max's favorite stall, bought by the bagful",
      "Dinner in, dressed up. Max on the decks in the fresco room",
      "Midnight on the studio roof, champagne in hand, fireworks over the whole city",
    ],
    image: { src: "m-rooftop", alt: "The view over Amsterdam's rooftops from the studio's roof terrace" },
  },
  {
    date: "Jan 1",
    weekday: "Sat",
    title: "Nieuwjaarsduik",
    items: [
      "The brave run into the North Sea in orange hats. The wise hold the towels",
      "Pea soup, a long nap, then one last family dinner",
    ],
  },
  {
    date: "Jan 2",
    weekday: "Sun",
    title: "Tot ziens",
    items: ["Max gets everyone back to Schiphol. Somebody cries. Probably Meggo. Probably Max too"],
  },
];

export const scrapbook: {
  src: string;
  caption: string;
  alt: string;
  cutout?: boolean;
  tilt: number;
}[] = [
  { src: "nineties", caption: "The original lineup", alt: "The family posed by the fireplace in the nineties", cutout: true, tilt: -3 },
  { src: "p-christmas-morning", caption: "Christmas morning with Meggo. Crowns mandatory", alt: "Meg with two granddaughters in crowns by the Christmas tree", tilt: 2.5 },
  { src: "p-reunion", caption: "The extended crew, before any of us had opinions", alt: "A big family reunion photo on a brick wall", tilt: -1.5 },
  { src: "four-generations", caption: "Four generations, one red pillow", alt: "Meg, Grandma and Shea with a newborn on a red pillow", cutout: true, tilt: 1.5 },
  { src: "p-sophie-elana-canal", caption: "Sophie and Elana already did the recon. Verdict: yes", alt: "Sophie and Elana on an Amsterdam canal bridge", tilt: -2 },
  { src: "p-max-kids-kiss", caption: "The Uncle Max tax, collected in full", alt: "The kids kissing Max's cheeks", tilt: 3 },
  { src: "dan-milkshake", caption: "Dan the Man, in the future in Amsterdam on shrooms (probably)", alt: "Dan behind a giant pink milkshake with three straws", cutout: true, tilt: -2.5 },
  { src: "shea-kids-max", caption: "Summer by the pool. Winter by the canal", alt: "Shea, her kids and Max around a patio table", cutout: true, tilt: 1 },
];

/** The first thing anyone sees behind the headline. */
export const HERO_BG = {
  src: "night-canal",
  tall: "night-canal-tall",
  alt: "The Reguliersgracht at night in December, every tree on the canal strung with lights and mirrored in the water",
  position: "50% 55%",
};

/**
 * After the intro, the page turns. These lines sit between the sections, and
 * each one lands a little more broken than the last (`level`, 0..1).
 */
export const interludes = {
  afterHero: {
    kicker: "A note, added later",
    line: "I made all of this before you cancelled. I'm leaving it up anyway.",
    level: 0.08,
  },
  afterDeal: { line: "All you had to do was book a flight.", level: 0.2 },
  afterGuests: { line: "I gave every one of you a house on the canal. The lights are still on. Nobody's home.", level: 0.32 },
  afterStay: { line: "I kept picturing which room each of you would pick.", level: 0.45 },
  afterDutch: { line: "I learned every one of these so I could share them with you.", level: 0.56 },
  afterDays: { line: "Twelve days, planned down to the hour. I don't know what to do with them now.", level: 0.68 },
  afterScrapbook: { line: "Thirty years of photos. I only wanted one more.", level: 0.8 },
  afterSurprises: { line: "I guess the surprise was on me.", level: 0.92 },
};

/** The letter at the bottom of the page. */
export const ending = {
  kicker: "Christmas 2027",
  opening: "So. Nobody's coming.",
  paragraphs: [
    "I could pretend I'm fine. I'm not going to.",
    "I didn't just book a trip. I found Dad a golf course that stays open in December. I found Sophie a court. I mapped out Dan's record shops, picked Meggo's brown cafe, checked the rink hours for the kids, found Sam a zoo with a planetarium. I put every one of you into this page, one photo at a time, and gave you each a house on the canal.",
    "When you cancelled, it didn't feel like a change of plans. It felt like finding out I wanted this more than anyone else did. That's the part that hurts the most.",
    "I'm not saying this to make you feel guilty. I'm saying it because you're my family, and you should know what it did to me.",
  ],
  love: ["I love you.", "I will always love you."],
  signature: "Max",
};
