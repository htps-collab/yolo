import { Gate } from "./components/Gate";
import { Snowfall } from "./components/Snowfall";
import { MusicToggle, Nav } from "./components/Nav";
import { Heartbreak } from "./components/Heartbreak";
import { Hero } from "./components/Hero";
import { Interlude } from "./components/Interlude";
import { Deal } from "./components/Deal";
import { GuestList } from "./components/GuestList";
import { Stay } from "./components/Stay";
import { Dutch } from "./components/Dutch";
import { Days } from "./components/Days";
import { Scrapbook, Surprises } from "./components/Scrapbook";
import { Ending } from "./components/Ending";
import { interludes } from "./data/trip";

export default function App() {
  return (
    <div className="grain min-h-[100dvh] bg-night">
      <Gate />
      <Snowfall />
      <Nav />
      <MusicToggle />
      <Heartbreak />
      <main>
        <Hero />
        <Interlude {...interludes.afterHero} />
        <Deal />
        <Interlude {...interludes.afterDeal} />
        <GuestList />
        <Interlude {...interludes.afterGuests} />
        <Stay />
        <Interlude {...interludes.afterStay} />
        <Dutch />
        <Interlude {...interludes.afterDutch} />
        <Days />
        <Interlude {...interludes.afterDays} />
        <Scrapbook />
        <Interlude {...interludes.afterScrapbook} />
        <Surprises />
        <Interlude {...interludes.afterSurprises} />
        <Ending />
      </main>
    </div>
  );
}
