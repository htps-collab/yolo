/**
 * A swag of street lights strung across the top of a section. Drawn as one
 * SVG path with bulbs placed along it, each glowing on its own offset.
 */
export function Garland({ className = "" }: { className?: string }) {
  const bulbs = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d="M0 12 Q 150 62 300 20 Q 450 -14 600 26 Q 750 66 900 18 Q 1050 -16 1200 30"
          fill="none"
          stroke="rgba(243,236,223,0.28)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {bulbs.map((i) => {
          const t = (i + 0.5) / bulbs.length;
          const x = t * 1200;
          const wave = Math.sin(t * Math.PI * 4 - 0.6);
          const y = 22 + wave * 22;
          return (
            <circle
              key={i}
              className="bulb"
              cx={x}
              cy={y}
              r="4.5"
              fill="#ecbd6c"
              style={{ animationDelay: `${(i % 5) * 0.55}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
