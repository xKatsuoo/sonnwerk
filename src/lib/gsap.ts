import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins exactly once, safe to call from every client component that needs them. */
export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browsers fire a 'resize' event when the address bar shows/hides during
    // scroll, which would otherwise make ScrollTrigger re-measure pin distances
    // mid-scroll and jump the user forward. This flag ignores resizes caused purely
    // by that viewport-height wobble.
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };
