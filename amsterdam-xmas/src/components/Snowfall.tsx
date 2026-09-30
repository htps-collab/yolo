import { useEffect, useRef } from "react";
import { decay } from "../heartbreak";

interface Flake {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
}

/**
 * Canvas snowfall. Sits above the page, ignores pointer events, and stops
 * itself entirely for anyone who asked for reduced motion.
 */
export function Snowfall({ density = 70 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;
    let running = true;

    const makeFlakes = () => {
      const count = Math.round(
        density * Math.min(1.2, Math.max(0.45, width / 1400))
      );
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.7 + Math.random() * 2.1,
        speed: 14 + Math.random() * 34,
        drift: 8 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.5,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeFlakes();
    };

    resize();

    let last = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      // as the page breaks the snow thins out, slows down and goes grey
      const d = decay.get();
      const falling = Math.round(flakes.length * (1 - 0.9 * d));
      const pace = 1 - 0.6 * d;
      const fade = 1 - 0.45 * d;
      for (let i = 0; i < falling; i++) {
        const flake = flakes[i];
        flake.y += flake.speed * pace * dt;
        flake.phase += dt * 0.7;
        flake.x += Math.sin(flake.phase) * flake.drift * dt;

        if (flake.y - flake.r > height) {
          flake.y = -flake.r * 2;
          flake.x = Math.random() * width;
        }
        if (flake.x < -10) flake.x = width + 10;
        if (flake.x > width + 10) flake.x = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(245, 248, 252, ${flake.alpha * fade})`;
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[65] h-full w-full"
    />
  );
}
