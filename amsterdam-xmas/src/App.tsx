import { Gate } from "./components/Gate";
import { Snowfall } from "./components/Snowfall";
import { MusicToggle, Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Deal } from "./components/Deal";
import { GuestList } from "./components/GuestList";
import { Stay } from "./components/Stay";
import { Dutch } from "./components/Dutch";
import { Days } from "./components/Days";
import { Scrapbook, Surprises } from "./components/Scrapbook";
import { Closer } from "./components/Closer";

export default function App() {
  return (
    <div className="grain min-h-[100dvh] bg-night">
      <Gate />
      <Snowfall />
      <Nav />
      <MusicToggle />
      <main>
        <Hero />
        <Deal />
        <GuestList />
        <Stay />
        <Dutch />
        <Days />
        <Scrapbook />
        <Surprises />
        <Closer />
      </main>
    </div>
  );
}
