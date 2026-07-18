"use client";

import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

/** Animates a number counting up to `value` once it scrolls into view. */
export function StatCounter({ value, suffix = "", prefix = "", decimals = 0, label }: StatCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const gsap = ensureGsap();
    const el = numberRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }

    const counter = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
        },
      });
    });

    return () => ctx.revert();
  }, [value, suffix, prefix, decimals]);

  return (
    <div>
      <span ref={numberRef} className="text-ink font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
        {prefix}0{suffix}
      </span>
      <p className="mt-2 text-sm text-gray-500">{label}</p>
    </div>
  );
}
