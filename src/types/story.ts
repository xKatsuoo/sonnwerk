/** A single beat of the scroll-driven installation story. */
export interface StoryPhase {
  id: string;
  kicker: string;
  title: string;
  description: string;
}

/** A story phase that maps to an exact frame range of the hero video. */
export interface VideoStoryPhase extends StoryPhase {
  startFrame: number;
  endFrame: number;
}

/** A story phase that maps to an exact frame range of the electrical-journey video. */
export type DiagramStoryPhase = VideoStoryPhase;
