"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { VideoScrollEngine } from "@/components/scroll-story/VideoScrollEngine";
import { EnergyFlowDiagram } from "@/components/scroll-story/EnergyFlowDiagram";
import { StoryProgressRail } from "@/components/scroll-story/StoryProgressRail";
import { videoStoryPhases, diagramStoryPhases } from "@/data/storyPhases";

const TOTAL_PHASES = videoStoryPhases.length + diagramStoryPhases.length;

/**
 * The full twelve-beat scroll narrative: house -> roof analysis -> planning -> install
 * (real drone footage, frame-scrubbed) continuing into the electrical story (schematic
 * diagram, scroll-scrubbed the same way). One continuous pinned experience.
 */
export function ScrollStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [railVisible, setRailVisible] = useState(false);

  const handleVideoPhase = useCallback((i: number) => setActivePhase(i), []);
  const handleDiagramPhase = useCallback((i: number) => setActivePhase(videoStoryPhases.length + i), []);

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
      <VideoScrollEngine onActivePhase={handleVideoPhase} />
      <EnergyFlowDiagram onActivePhase={handleDiagramPhase} />
      <StoryProgressRail total={TOTAL_PHASES} active={activePhase} visible={railVisible} />
    </div>
  );
}
