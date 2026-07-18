"use client";

import { useEffect, useState } from "react";
import { prefersLightweightVideo } from "@/lib/deviceCapability";

/** Reactively evaluates prefersLightweightVideo() on the client; returns `false` during SSR. */
export function useLightweightVideo(): boolean {
  const [lightweight, setLightweight] = useState(false);

  useEffect(() => {
    setLightweight(prefersLightweightVideo());
  }, []);

  return lightweight;
}
