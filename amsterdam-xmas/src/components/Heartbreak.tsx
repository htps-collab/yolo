import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { armGrief, glassHit, setGrief } from "../audio";
import { clamp01, damageAt, decay, glow, onEntered, seeded } from "../heartbreak";

/* ------------------------------------------------------------------------
 * The screen cracks
 * ---------------------------------------------------------------------- */

interface Crack {
  d: string;
  len: number;
  /** 0..1: when this line starts growing within its impact */
  delay: number;
  width: number;
  main: boolean;
}

interface Impact {
  x: number;
  y: number;
  /** page damage at which this impact starts; the first one is set off by a timer instead */
  start: number;
  cracks: Crack[];
}

// Where each impact lands on the screen (fractions of the viewport), and how big it spreads.
const IMPACTS = [
  { x: 0.8, y: 0.2, start: -1, scale: 0.55 },
  { x: 0.16, y: 0.64, start: 0.07, scale: 0.7 },
  { x: 0.62, y: 0.82, start: 0.2, scale: 0.8 },
  { x: 0.38, y: 0.3, start: 0.35, scale: 0.9 },
  { x: 0.9, y: 0.58, start: 0.5, scale: 0.85 },
  { x: 0.08, y: 0.12, start: 0.63, scale: 0.8 },
  { x: 0.52, y: 0.52, start: 0.76, scale: 1 },
];
const SPREAD = 0.2; // damage it takes for one impact to finish spreading

function polyline(points: [number, number][]) {
  let len = 0;
  for (let i = 1; i < points.length; i++) len += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  return { d, len };
}

/** Spider-web fractures: jagged radial cracks, a few branches, broken rings between them. */
function makeImpacts(w: number, h: number): Impact[] {
  const diag = Math.hypot(w, h);
  // a phone screen fills up fast: fewer impacts, fewer spokes
  const small = w < 700;
  const specs = small ? IMPACTS.filter((_, i) => i !== 3 && i !== 5) : IMPACTS;
  return specs.map((spec, n) => {
    const rand = seeded(1207 + n * 97);
    const cx = spec.x * w;
    const cy = spec.y * h;
    const cracks: Crack[] = [];
    const count = small ? 5 + Math.floor(rand() * 3) : 6 + Math.floor(rand() * 4);
    const spokes: [number, number][][] = [];
    const offset = rand() * Math.PI * 2;

    for (let i = 0; i < count; i++) {
      let angle = offset + (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.5;
      const length = diag * spec.scale * (0.18 + rand() * 0.42);
      const segments = 6 + Math.floor(rand() * 6);
      const pts: [number, number][] = [[cx, cy]];
      let x = cx;
      let y = cy;
      for (let s = 0; s < segments; s++) {
        angle += (rand() - 0.5) * 0.45;
        const step = (length / segments) * (0.6 + rand() * 0.8);
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
        pts.push([x, y]);
      }
      spokes.push(pts);
      const main = polyline(pts);
      cracks.push({ ...main, delay: rand() * 0.25, width: 1 + rand() * 0.5, main: true });

      // a branch or two splitting off the spoke
      const branches = rand() < 0.55 ? 1 : 0;
      for (let b = 0; b < branches; b++) {
        const from = pts[2 + Math.floor(rand() * (pts.length - 3))];
        let a = Math.atan2(from[1] - cy, from[0] - cx) + (rand() < 0.5 ? -1 : 1) * (0.4 + rand() * 0.6);
        const bl = length * (0.15 + rand() * 0.3);
        const bp: [number, number][] = [from];
        let bx = from[0];
        let by = from[1];
        for (let s = 0; s < 4; s++) {
          a += (rand() - 0.5) * 0.5;
          bx += (Math.cos(a) * bl) / 4;
          by += (Math.sin(a) * bl) / 4;
          bp.push([bx, by]);
        }
        cracks.push({ ...polyline(bp), delay: 0.3 + rand() * 0.35, width: 0.6 + rand() * 0.4, main: false });
      }
    }

    // concentric rings: short broken arcs linking neighbouring spokes
    for (const [ring, r] of [0.035, 0.075, 0.13].entries()) {
      const radius = diag * spec.scale * r;
      for (let i = 0; i < spokes.length; i++) {
        if (rand() < 0.45) continue;
        const a = pointAt(spokes[i], radius);
        const b = pointAt(spokes[(i + 1) % spokes.length], radius * (0.85 + rand() * 0.3));
        if (!a || !b) continue;
        const mid: [number, number] = [(a[0] + b[0]) / 2 + (rand() - 0.5) * radius * 0.2, (a[1] + b[1]) / 2 + (rand() - 0.5) * radius * 0.2];
        cracks.push({ ...polyline([a, mid, b]), delay: 0.35 + ring * 0.2 + rand() * 0.1, width: 0.5 + rand() * 0.4, main: false });
      }
    }

    return { x: cx, y: cy, start: spec.start, cracks };
  });
}

/** The point on a spoke at a given distance from its impact, if the spoke reaches that far. */
function pointAt(pts: [number, number][], radius: number): [number, number] | null {
  const [ox, oy] = pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (Math.hypot(pts[i][0] - ox, pts[i][1] - oy) >= radius) {
      const [px, py] = pts[i - 1];
      const [qx, qy] = pts[i];
      const dp = Math.hypot(px - ox, py - oy);
      const dq = Math.hypot(qx - ox, qy - oy);
      const t = (radius - dp) / Math.max(1e-6, dq - dp);
      return [px + (qx - px) * t, py + (qy - py) * t];
    }
  }
  return null;
}

/* ------------------------------------------------------------------------
 * The page comes loose
 * ---------------------------------------------------------------------- */

interface Piece {
  el: HTMLElement;
  top: number;
  height: number;
  /** how badly this piece breaks, 0..~1.2 */
  weight: number;
  dir: 1 | -1;
  kind: "hinge" | "drop" | "slab";
  text: boolean;
  target: number;
  x: number;
  v: number;
  written: string;
}

const PIECES = "h2, h3, p, li, img, figure";

function docTop(el: HTMLElement) {
  // offsetTop ignores transforms, so pieces that have already fallen still measure where they belong
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/** Critically damped spring step: no overshoot, no bounce, just settles. */
function spring(x: number, v: number, target: number, stiffness: number, dt: number) {
  const damping = 2 * Math.sqrt(stiffness);
  const a = stiffness * (target - x) - damping * v;
  v += a * dt;
  x += v * dt;
  return [x, v] as const;
}

/* ------------------------------------------------------------------------ */

export function Heartbreak() {
  const reduce = useReducedMotion();
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const impacts = useMemo(() => makeImpacts(size.w, size.h), [size]);
  const svgRef = useRef<SVGSVGElement>(null);
  const drainRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const shock = useRef({ target: 0, x: 0, v: 0, at: 0 });
  const damage = useRef({ target: 0, x: 0, v: 0 });
  const ending = useRef({ x: 0, v: 0 });

  useEffect(() => {
    let id = 0;
    const onResize = () => {
      window.clearTimeout(id);
      // only redraw the cracks for a real size change, not the phone toolbar sliding
      id = window.setTimeout(() => {
        setSize((s) =>
          Math.abs(s.w - window.innerWidth) > 40 || Math.abs(s.h - window.innerHeight) > 160 ? { w: window.innerWidth, h: window.innerHeight } : s
        );
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // The first crack lands a couple of seconds after the intro hands over
  useEffect(
    () =>
      onEntered(() => {
        armGrief();
        window.setTimeout(
          () => {
            shock.current.target = 1;
            shock.current.at = performance.now();
            if (reduce) shock.current.x = 1;
            glassHit();
            navigator.vibrate?.([8, 30, 14]);
          },
          reduce ? 600 : 2300
        );
      }),
    [reduce]
  );

  useEffect(() => {
    const svg = svgRef.current;
    const main = document.querySelector("main");
    if (!svg || !main) return;

    const lines = Array.from(svg.querySelectorAll<SVGPathElement>("path[data-i]")).map((el) => ({
      el,
      impact: Number(el.dataset.i),
      delay: Number(el.dataset.delay),
      len: Number(el.dataset.len),
      shown: -1,
    }));
    const groups = Array.from(svg.querySelectorAll<SVGGElement>("g[data-impact]"));
    const hubs = Array.from(svg.querySelectorAll<SVGCircleElement>("circle[data-hub]"));

    // ---- the pieces of the page that are going to come loose
    const known = new WeakMap<HTMLElement, Piece>();
    let pieces: Piece[] = [];
    let docH = 1;
    const collect = () => {
      docH = Math.max(1, document.documentElement.scrollHeight);
      const next: Piece[] = [];
      const consider = (el: HTMLElement, slab: boolean) => {
        if (el.closest("[data-intact], #top")) return;
        if (!slab && el.parentElement?.closest(PIECES) && main.contains(el.parentElement.closest(PIECES))) return;
        let piece = known.get(el);
        if (!piece) {
          const r = Math.random();
          piece = {
            el,
            top: 0,
            height: 0,
            // most things break, a few hold on
            weight: r < 0.15 ? 0.12 : 0.35 + Math.random() * 0.85,
            dir: Math.random() < 0.5 ? -1 : 1,
            kind: slab ? "slab" : Math.random() < 0.45 ? "hinge" : "drop",
            text: /^(H2|H3|P|LI)$/.test(el.tagName),
            target: 0,
            x: 0,
            v: 0,
            written: "",
          };
          el.style.transformOrigin = piece.kind === "drop" ? "50% 50%" : piece.dir > 0 ? "0% 0%" : "100% 0%";
          known.set(el, piece);
        }
        piece.top = docTop(el);
        piece.height = el.offsetHeight;
        next.push(piece);
      };
      main.querySelectorAll<HTMLElement>("section").forEach((el) => consider(el, true));
      main.querySelectorAll<HTMLElement>(PIECES).forEach((el) => consider(el, false));
      // anything that left the page (a tab switch in the plan) lets go of its transform
      for (const p of pieces) if (!next.includes(p)) p.el.style.translate = p.el.style.rotate = "";
      pieces = next;
    };
    let collectId = 0;
    const recollect = () => {
      window.clearTimeout(collectId);
      collectId = window.setTimeout(collect, 250);
    };
    collect();
    const mo = new MutationObserver(recollect);
    mo.observe(main, { childList: true, subtree: true });
    const ro = new ResizeObserver(recollect);
    ro.observe(main);

    const root = document.documentElement;
    let lightsOut = false;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // ---- page damage: follows the deepest point reached, through a slow spring
      const s = shock.current;
      const dmg = damage.current;
      if (s.target > 0) {
        const fraction = scrollY / Math.max(1, root.scrollHeight - vh);
        dmg.target = Math.max(dmg.target, damageAt(fraction));
      }
      [dmg.x, dmg.v] = spring(dmg.x, dmg.v, dmg.target, 22, dt);
      if (!reduce) [s.x, s.v] = spring(s.x, s.v, s.target, 30, dt);
      const d = clamp01(dmg.x);

      // ---- the closing letter: glass falls away, warmth creeps back
      const letter = document.getElementById("ending");
      const end = ending.current;
      const endTarget = letter ? clamp01((vh * 0.9 - letter.getBoundingClientRect().top) / (vh * 1.1)) : 0;
      [end.x, end.v] = spring(end.x, end.v, endTarget, 26, dt);
      const e = clamp01(end.x);

      decay.set(d);
      glow.set(e);
      root.style.setProperty("--decay", d.toFixed(3));
      if (!lightsOut && d > 0.3) {
        lightsOut = true;
        root.dataset.lightsOut = "";
      }

      // ---- cracks grow
      for (const line of lines) {
        const imp = impacts[line.impact];
        const progress = imp.start < 0 ? s.x : clamp01((d - imp.start) / SPREAD);
        const shown = clamp01((progress - line.delay * 0.55) / 0.45);
        if (Math.abs(shown - line.shown) > 0.002) {
          line.shown = shown;
          line.el.style.strokeDashoffset = String(line.len * (1 - shown));
          line.el.style.visibility = shown > 0 ? "visible" : "hidden";
        }
      }
      hubs.forEach((hub, i) => {
        const imp = impacts[i];
        const progress = imp.start < 0 ? s.x : clamp01((d - imp.start) / SPREAD);
        hub.style.opacity = String(Math.min(1, progress * 3));
      });
      // at the letter, each shattered patch drops out of the frame on its own
      groups.forEach((g, i) => {
        const t = reduce ? e : clamp01(e * 1.5 - i * 0.07);
        g.style.opacity = String(1 - t);
        g.style.transform = reduce ? "" : `translateY(${(t * t * vh * 0.9).toFixed(1)}px) rotate(${((i % 2 ? 1 : -1) * t * 9).toFixed(2)}deg)`;
      });

      // ---- color drains out, the edges go dark
      const drain = Math.min(0.94, d * 1.1) * (1 - e * 0.6);
      if (drainRef.current) {
        drainRef.current.style.opacity = drain.toFixed(3);
        drainRef.current.style.display = drain > 0.005 ? "block" : "none";
      }
      if (shadeRef.current) shadeRef.current.style.opacity = (Math.pow(d, 1.2) * 0.85 * (1 - e * 0.35)).toFixed(3);

      // ---- the jolt when the first crack lands
      if (!reduce && s.at) {
        const t = (now - s.at) / 1000;
        if (t < 0.7) {
          const amp = 7 * Math.exp(-t / 0.12);
          main.style.translate = `${(amp * Math.sin(t * 95)).toFixed(2)}px ${(amp * 0.5 * Math.cos(t * 80)).toFixed(2)}px`;
        } else {
          main.style.translate = "";
          s.at = 0;
        }
      }

      // ---- pieces sag, swing off one corner, and drop as they pass
      if (!reduce) {
        for (const p of pieces) {
          const center = p.kind === "slab" ? p.top + Math.min(p.height, vh) * 0.5 : p.top + p.height * 0.5;
          const yn = (center - scrollY) / vh;
          if (yn > -1.5 && yn < 2.5) {
            // the further down the page, the worse it breaks, but never ahead of the page itself
            const severity = Math.min(damageAt(center / docH), d + 0.03) * p.weight;
            const loosened = Math.pow(clamp01((0.8 - yn) / 0.95), 1.5);
            p.target = Math.max(p.target, loosened * severity);
          }
          [p.x, p.v] = spring(p.x, p.v, p.target, p.kind === "slab" ? 12 : 16, dt);
          if (p.x < 0.001 && p.target === 0) continue;
          let tx = 0;
          let ty = 0;
          let rot = 0;
          const k = p.x;
          if (p.kind === "slab") {
            ty = k * 26;
            rot = k * p.dir * 1.2;
          } else if (p.kind === "hinge") {
            ty = k * (8 + 26 * p.weight);
            rot = k * p.dir * (6 + 20 * p.weight) * (p.text ? 0.55 : 1);
          } else {
            ty = k * (40 + 170 * p.weight);
            tx = k * p.dir * (6 + 24 * p.weight);
            rot = k * p.dir * (2 + 9 * p.weight);
          }
          const next = `${tx.toFixed(1)}px ${ty.toFixed(1)}px|${rot.toFixed(2)}deg`;
          if (next !== p.written) {
            p.written = next;
            p.el.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
            p.el.style.rotate = `${rot.toFixed(2)}deg`;
          }
        }
      }

      setGrief(d, e, now);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(collectId);
      mo.disconnect();
      ro.disconnect();
    };
  }, [impacts, reduce]);

  return (
    <>
      {/* the edges of the world darken */}
      <div
        ref={shadeRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[64] opacity-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgb(4 7 9 / 0.75) 75%, rgb(2 3 4 / 0.95) 100%)" }}
      />
      {/* the color drains out of everything underneath */}
      <div
        ref={drainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[66] hidden opacity-0"
        style={{ background: "#7a7f84", mixBlendMode: "saturation" }}
      />
      {/* the glass */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[67] h-full w-full"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        {impacts.map((imp, i) => (
          <g key={`${size.w}x${size.h}-${i}`} data-impact={i} style={{ transformOrigin: `${imp.x}px ${imp.y}px`, transformBox: "view-box" }}>
            <circle
              data-hub=""
              cx={imp.x}
              cy={imp.y}
              r={14}
              fill="url(#hub)"
              style={{ opacity: 0 }}
            />
            {imp.cracks.map((c, j) => (
              <Fragment key={j}>
                {/* dark edge, a pale glint, and a soft glow on the big fractures */}
                {[
                  { stroke: "rgb(0 0 0 / 0.55)", width: c.width * 2.4, shift: 0.9 },
                  ...(c.main ? [{ stroke: "rgb(220 232 240 / 0.12)", width: c.width * 5, shift: 0 }] : []),
                  { stroke: "rgb(236 242 247 / 0.62)", width: c.width, shift: 0 },
                ].map((layer, k) => (
                  <path
                    key={k}
                    data-i={i}
                    data-delay={c.delay}
                    data-len={c.len}
                    d={c.d}
                    fill="none"
                    stroke={layer.stroke}
                    strokeWidth={layer.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={c.len}
                    strokeDashoffset={c.len}
                    transform={layer.shift ? `translate(${layer.shift} ${layer.shift})` : undefined}
                    style={{ visibility: "hidden" }}
                  />
                ))}
              </Fragment>
            ))}
          </g>
        ))}
        <defs>
          <radialGradient id="hub">
            <stop offset="0%" stopColor="rgb(245 248 250 / 0.7)" />
            <stop offset="45%" stopColor="rgb(245 248 250 / 0.18)" />
            <stop offset="100%" stopColor="rgb(245 248 250 / 0)" />
          </radialGradient>
        </defs>
      </svg>
    </>
  );
}
