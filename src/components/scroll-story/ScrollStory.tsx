"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { InstallationStory } from "@/components/scroll-story/InstallationStory";
import { StoryProgressRail } from "@/components/scroll-story/StoryProgressRail";
import { combinedStoryPhases } from "@/data/storyPhases";

const TOTAL_PHASES = combinedStoryPhases.length;

/**
 * The full twelve-beat scroll narrative: house -> roof analysis -> planning -> install
 * (real drone footage, frame-scrubbed) continuing into the electrical story (also real
 * footage, frame-scrubbed the same way). One continuous pinned experience.
 */
export function ScrollStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [railVisible, setRailVisible] = useState(false);

  const handleActivePhase = useCallback((i: number) => setActivePhase(i), []);

  useEffect(() => {
    ensureGsap();
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      onToggle: (self) => setRailVisible(self.isActive),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapperRef}>
      <InstallationStory onActivePhase={handleActivePhase} />
      <StoryProgressRail total={TOTAL_PHASES} active={activePhase} visible={railVisible} />
    </div>
  );
}
