"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives the whole site's scroll physics. Lenis intercepts native scroll and eases it;
 * its raf loop is piped through gsap.ticker so ScrollTrigger stays perfectly in sync
 * on every frame, which is what keeps the pinned video story frame-accurate.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const gsapInstance = ensureGsap();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.1 : 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      autoRaf: false,
    });

    const update = (time: number) => lenis.raf(time * 1000);
    gsapInstance.ticker.add(update);
    gsapInstance.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsapInstance.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
