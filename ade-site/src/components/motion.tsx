import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* Curves taken from the animate skill tables. No hand-rolled values. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const SPRING = { type: "spring", duration: 0.5, bounce: 0.15 } as const;
export const SPRING_SOFT = { type: "spring", duration: 0.7, bounce: 0.1 } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "p" | "span" | "h2" | "h3";
};

/* Heavy, gentle fade-up for marketing content entering view */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: `translateY(${y}px)`, filter: "blur(8px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  );
}

const wordParent: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

/* Masked word reveal: each word slides up out of its own clip box */
export function WordReveal({
  text,
  className,
  stagger = 0.06,
  delay = 0,
  immediate = false,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const child: Variants = {
    hidden: reduce ? { opacity: 0 } : { transform: "translateY(110%)" },
    show: reduce
      ? { opacity: 1, transition: { duration: 0.4, delay } }
      : { transform: "translateY(0%)", transition: { duration: 1.1, ease: EASE_DRAWER, delay } },
  };
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-10%" } };
  return (
    <motion.span
      className={className}
      variants={wordParent}
      custom={stagger}
      initial="hidden"
      {...trigger}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden>
          <motion.span variants={child} className="inline-block will-change-transform">
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ivory/15 bg-ivory/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/70">
      {children}
    </span>
  );
}
