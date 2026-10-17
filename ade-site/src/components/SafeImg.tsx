import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

/* Hotlinked real photography with a graceful fallback chain:
   primary -> optional fallbackSrc -> dark gradient. Never a broken icon. */
export function SafeImg({ src, alt, className, fallbackSrc, ...rest }: Props) {
  const [stage, setStage] = useState(0);
  const current = stage === 0 ? src : fallbackSrc;
  if (!current) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className ?? ""} bg-[radial-gradient(110%_110%_at_50%_0%,rgb(87_84_0/0.85),rgb(11_11_13)_72%)]`}
      />
    );
  }
  return (
    <img
      src={current}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setStage((s) => s + 1)}
      {...rest}
    />
  );
}
