"use client";

import { createElement, useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type RevealVariant = "up" | "fade" | "scale" | "blur";

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  as?: string;
  className?: string;
}

const variantFrom: Record<RevealVariant, gsap.TweenVars> = {
  up: { y: 40, opacity: 0 },
  fade: { opacity: 0 },
  scale: { scale: 0.94, opacity: 0 },
  blur: { opacity: 0, filter: "blur(14px)", y: 16 },
};

/** Fades a section into place once as it enters the viewport, then leaves it alone. */
export function Reveal({ children, variant = "up", delay = 0, as = "div", className }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const gsap = ensureGsap();
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(el, variantFrom[variant], {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    }, ref as React.RefObject<HTMLElement>);

    return () => ctx.revert();
  }, [variant, delay]);

  return createElement(as, { ref, className: cn(className) }, children);
}

export type { RevealVariant };
