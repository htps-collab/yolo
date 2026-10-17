import { MotionConfig } from "motion/react";
import { useSmoothScroll } from "./components/SmoothScroll";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { Hosts } from "./components/Hosts";
import { Day } from "./components/Day";
import { House } from "./components/House";
import { Merch } from "./components/Merch";
import { Rules } from "./components/Rules";
import { Footer } from "./components/Footer";

/*
  Design read: editorial luxury for a 1742 canal monument hosting a
  streetwear and techno pop-up during ADE.
  Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 7, VISUAL_DENSITY 3.
  One dark theme, one ADE-yellow accent (#FFFF07), Newsreader + Geist.
  Brand voices: Silkscreen pixel for HIFI, Anton condensed for SESH.
*/
export default function App() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-[100dvh] bg-ink text-ivory">
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <Hosts />
          <Day />
          <Merch />
          <House />
          <Rules />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
