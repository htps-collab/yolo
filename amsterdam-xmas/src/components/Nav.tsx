import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { toggleMusic, useMusicPlaying } from "../audio";

const links = [
  { label: "Guest list", href: "#guests" },
  { label: "Where you sleep", href: "#stay" },
  { label: "Dutch Christmas", href: "#dutch" },
  { label: "The plan", href: "#days" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // the bar frosts over as the page moves under it, rather than snapping to a solid block
  const smooth = useSpring(scrollY, { stiffness: 140, damping: 30, mass: 0.5 });
  const blur = useTransform(smooth, [0, 160], [0, 18], { clamp: true });
  const tint = useTransform(smooth, [0, 160], [0, 0.82], { clamp: true });
  const backdropFilter = useMotionTemplate`blur(${blur}px) saturate(160%)`;
  const background = useMotionTemplate`rgb(13 20 23 / ${tint})`;

  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? "border-b border-hairline" : "border-b border-transparent"}`}
      style={
        reduce
          ? { paddingTop: "env(safe-area-inset-top, 0px)", background: "rgb(13 20 23 / 0.85)" }
          : { paddingTop: "env(safe-area-inset-top, 0px)", backdropFilter, WebkitBackdropFilter: backdropFilter, background }
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <a href="#top" className="font-display text-xl font-semibold italic tracking-tight text-ink">
          Kerst in Amsterdam
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Sections">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-ink-soft transition-colors hover:text-lamp">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#days"
          className="rounded-full border border-hairline px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-lamp hover:text-lamp lg:hidden"
        >
          The plan
        </a>
      </div>
    </motion.header>
  );
}

export function MusicToggle() {
  const playing = useMusicPlaying();
  return (
    <motion.button
      onClick={toggleMusic}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", bounce: 0, duration: 0.25 }}
      aria-pressed={playing}
      aria-label={playing ? "Pause the music" : "Play the music"}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-full border border-hairline bg-night/80 py-2.5 pl-4 pr-5 text-xs font-medium text-ink backdrop-blur-md transition-colors hover:border-lamp"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-sm bg-lamp ${playing ? "eq-bar" : ""}`}
            style={{ height: playing ? "100%" : "30%", animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      {playing ? "Music on" : "Music off"}
    </motion.button>
  );
}
