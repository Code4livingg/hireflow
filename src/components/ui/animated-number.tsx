"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
  value: string;
  className?: string;
};

function parseNumeric(value: string): { num: number; prefix: string; suffix: string; decimals: number } | null {
  const match = value.match(/^([^0-9.-]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  return {
    prefix,
    num: Number(numStr),
    suffix,
    decimals: numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0,
  };
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);
  const parsed = parseNumeric(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || !parsed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed.num * eased;
      setDisplay(
        `${parsed.prefix}${parsed.decimals > 0 ? current.toFixed(parsed.decimals) : Math.round(current)}${parsed.suffix}`,
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, parsed, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}
