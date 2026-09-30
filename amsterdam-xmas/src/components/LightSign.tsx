import { motion, useReducedMotion } from "motion/react";

/** Bulb colours in the order they repeat along the strand. */
const BULBS = ["#f6d79b", "#d8452f", "#f6d79b", "#3f8f57", "#f6d79b", "#d8452f", "#3f8f57"];
const SAG = 9; // how far the wire droops in the middle

/**
 * A painted wooden signboard, the kind that hangs off an Amsterdam shopfront:
 * cut corners, a gold rule inside a red frame, screws at the corners, hung on
 * two chains. A strand of Christmas bulbs droops over the top of it.
 */
export function LightSign({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <div className={`relative ${className}`}>
      {/* the bracket the whole thing hangs from */}
      <div className="mx-auto h-[3px] w-[78%] rounded-full bg-[linear-gradient(90deg,transparent,#2a2018_12%,#3a2c20_50%,#2a2018_88%,transparent)]" />

      <motion.div
        className="relative mx-auto w-full max-w-[330px]"
        style={{ transformOrigin: "50% -18px" }}
        animate={reduce ? undefined : { rotate: [-0.9, 0.9, -0.9] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* two short chains */}
        {[14, 86].map((left) => (
          <span key={left} className="absolute -top-[19px] flex flex-col items-center" style={{ left: `${left}%` }} aria-hidden="true">
            <span className="h-[6px] w-[6px] rounded-full border-[1.5px] border-[#7d6c59]" />
            <span className="h-[9px] w-[2px] bg-[linear-gradient(180deg,#8a7862,#4b4136)]" />
            <span className="h-[6px] w-[6px] rounded-full border-[1.5px] border-[#7d6c59]" />
          </span>
        ))}

        {/* the board */}
        <div
          className="relative px-6 py-5 text-center [clip-path:polygon(0_14px,14px_0,calc(100%-14px)_0,100%_14px,100%_calc(100%-14px),calc(100%-14px)_100%,14px_100%,0_calc(100%-14px))]"
          style={{
            background:
              "repeating-linear-gradient(88deg, rgb(0 0 0 / 0.07) 0 1px, transparent 1px 6px), linear-gradient(168deg, #1a5a3c, #0e3a26 55%, #0a2c1d)",
            boxShadow:
              "inset 0 0 0 3px #8d2f22, inset 0 0 0 4px rgb(0 0 0 / 0.35), inset 0 0 0 5px rgb(236 189 108 / 0.45), inset 0 14px 26px rgb(0 0 0 / 0.35), 0 18px 34px -14px rgb(0 0 0 / 0.85)",
          }}
        >
          {/* screws holding the board to its frame */}
          {[
            ["10px", "10px"],
            ["10px", "auto"],
          ].map(([top], row) =>
            [true, false].map((leftSide) => (
              <span
                key={`${row}-${leftSide}`}
                aria-hidden="true"
                className="absolute h-[7px] w-[7px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9b79a,#5c4c3a)] shadow-[inset_0_-1px_1px_rgb(0_0_0/0.6)]"
                style={{
                  top: row === 0 ? top : "auto",
                  bottom: row === 0 ? "auto" : "10px",
                  left: leftSide ? "10px" : "auto",
                  right: leftSide ? "auto" : "10px",
                }}
              />
            ))
          )}

          <p className="flex flex-col font-display font-bold uppercase leading-[0.92] tracking-[0.04em]">
            {words.map((word, i) => (
              <span
                key={word}
                className="bg-[linear-gradient(180deg,#fbeec6_0%,#e8c073_45%,#b5882f_100%)] bg-clip-text text-transparent"
                style={{
                  fontSize: i === 0 ? "clamp(1.5rem,4vw,2rem)" : "clamp(1.9rem,5.4vw,2.7rem)",
                  filter: "drop-shadow(0 1px 0 rgb(0 0 0 / 0.55)) drop-shadow(0 -1px 0 rgb(255 245 220 / 0.14))",
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* the light strand, hung in front of the board */}
        <div className="pointer-events-none absolute inset-x-[-6px] -top-[30px] h-12" aria-hidden="true">
          <svg viewBox="0 0 300 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d={`M0 4 Q 150 ${4 + SAG * 2.2} 300 4`} fill="none" stroke="rgb(60 48 38 / 0.9)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          </svg>
          {BULBS.map((color, i) => {
            const t = (i + 0.5) / BULBS.length;
            const drop = 4 + Math.sin(Math.PI * t) * SAG;
            return (
              <span key={i} className="absolute flex flex-col items-center" style={{ left: `${t * 100}%`, top: drop, transform: "translateX(-50%)" }}>
                <span className="h-[5px] w-[6px] rounded-t-[2px] bg-[linear-gradient(180deg,#8d7b5f,#4a4034)]" />
                <span
                  className="bulb-drop h-[15px] w-[11px] rounded-[50%_50%_46%_46%/38%_38%_62%_62%]"
                  style={{
                    background: `radial-gradient(circle at 38% 30%, #fff6de 0%, ${color} 48%, rgb(0 0 0 / 0.35) 130%)`,
                    ["--bulb-color" as string]: color,
                    animationDelay: `${(i * 0.37) % 2.1}s`,
                    animationDuration: `${2.4 + (i % 3) * 0.6}s`,
                  }}
                />
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
