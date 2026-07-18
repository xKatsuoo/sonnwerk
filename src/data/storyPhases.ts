import type { DiagramStoryPhase, VideoStoryPhase } from "@/types/story";

export const VIDEO_FPS = 24;
export const VIDEO_TOTAL_FRAMES = 720;
export const VIDEO_DURATION = VIDEO_TOTAL_FRAMES / VIDEO_FPS;
export const VIDEO_SRC = "/videos/pv-story.mp4";
export const VIDEO_SRC_MOBILE = "/videos/pv-story-mobile.mp4";
/** 720p rendition for devices too slow to scrub the full 1080p video smoothly. */
export const VIDEO_SRC_REDUCED = "/videos/pv-story-reduced.mp4";
export const VIDEO_POSTER = "/images/pv-story-poster.jpg";
/** Scroll distance dedicated to the hero video, in viewport-heights. */
export const VIDEO_SCROLL_VH = 5;

export const DIAGRAM_FPS = 24;
export const DIAGRAM_TOTAL_FRAMES = 954;
export const DIAGRAM_DURATION = DIAGRAM_TOTAL_FRAMES / DIAGRAM_FPS;
export const DIAGRAM_SRC = "/videos/pv-diagram.mp4";
export const DIAGRAM_SRC_MOBILE = "/videos/pv-diagram-mobile.mp4";
/** 720p rendition for devices too slow to scrub the full 1080p video smoothly. */
export const DIAGRAM_SRC_REDUCED = "/videos/pv-diagram-reduced.mp4";
export const DIAGRAM_POSTER = "/images/pv-diagram-poster.jpg";
export const DIAGRAM_SCROLL_VH = 9;

/** The five video-driven beats: everything the drone footage actually shows. */
export const videoStoryPhases: VideoStoryPhase[] = [
  {
    id: "haus",
    kicker: "Ihr Zuhause",
    title: "Jedes Dach erzählt eine Geschichte",
    description: "Wir beginnen dort, wo Ihre Energiewende beginnt: auf Ihrem Dach.",
    startFrame: 0,
    endFrame: 119,
  },
  {
    id: "dachanalyse",
    kicker: "Analyse",
    title: "Bis auf den Ziegel genau vermessen",
    description: "Ausrichtung, Neigung und Verschattung – digital erfasst, bevor ein Modul montiert wird.",
    startFrame: 120,
    endFrame: 239,
  },
  {
    id: "pv-planung",
    kicker: "Planung",
    title: "Ihre Anlage entsteht digital",
    description: "Ertragssimulation, Modulanzahl und Verkabelung – geplant für maximale Ausbeute.",
    startFrame: 240,
    endFrame: 479,
  },
  {
    id: "montage",
    kicker: "Montage",
    title: "Handwerk, das sitzt",
    description: "Zertifizierte Fachbetriebe montieren Ihre Anlage – sauber, sicher, in wenigen Tagen.",
    startFrame: 480,
    endFrame: 599,
  },
  {
    id: "fertige-anlage",
    kicker: "Fertige Anlage",
    title: "Saubere Energie ab dem ersten Sonnenstrahl",
    description: "Ihr Dach ist jetzt ein Kraftwerk – bereit für Inbetriebnahme.",
    startFrame: 600,
    endFrame: 719,
  },
];

/**
 * The seven diagram-driven beats: the electrical story that follows the physical build.
 * Frame ranges must stay in sync with scripts/build-diagram-video.mjs.
 */
export const diagramStoryPhases: DiagramStoryPhase[] = [
  {
    id: "stromfluss",
    kicker: "Stromfluss",
    title: "Der Strom nimmt seinen Weg",
    description: "Sonnenlicht trifft auf die Zellen – Gleichstrom entsteht in Echtzeit.",
    startFrame: 0,
    endFrame: 79,
  },
  {
    id: "wechselrichter",
    kicker: "Wechselrichter",
    title: "Aus Gleichstrom wird Haushaltsstrom",
    description: "Der Wechselrichter wandelt DC in nutzbaren Wechselstrom um – nahezu verlustfrei.",
    startFrame: 80,
    endFrame: 159,
  },
  {
    id: "batteriespeicher",
    kicker: "Batteriespeicher",
    title: "Sonne, die auch nachts wirkt",
    description: "Überschüssige Energie wird gespeichert, statt ungenutzt ins Netz zu fließen.",
    startFrame: 160,
    endFrame: 239,
  },
  {
    id: "hausversorgung",
    kicker: "Hausversorgung",
    title: "Ihr Zuhause läuft mit der Sonne",
    description: "Haushaltsgeräte, Heizung und Licht – versorgt aus eigener Erzeugung.",
    startFrame: 240,
    endFrame: 473,
  },
  {
    id: "wallbox",
    kicker: "Wallbox",
    title: "Tanken, während Sie schlafen",
    description: "Ihr Elektroauto lädt über Nacht mit selbst erzeugtem Strom.",
    startFrame: 474,
    endFrame: 713,
  },
  {
    id: "smart-home",
    kicker: "Smart Home",
    title: "Energie, die mitdenkt",
    description: "Verbrauch, Speicher und Einspeisung – automatisch optimiert in einer App.",
    startFrame: 714,
    endFrame: 833,
  },
  {
    id: "abschluss",
    kicker: "Ergebnis",
    title: "Unabhängigkeit ist jetzt Serienausstattung",
    description: "Von der Dachanalyse bis zur Wallbox – eine Anlage, ein Ansprechpartner.",
    startFrame: 834,
    endFrame: 953,
  },
];

/** Combined scroll distance for the single unbroken pin spanning both videos. */
export const TOTAL_SCROLL_VH = VIDEO_SCROLL_VH + DIAGRAM_SCROLL_VH;
/** Combined frame count: the hero video's frames, then the diagram video's. */
export const TOTAL_STORY_FRAMES = VIDEO_TOTAL_FRAMES + DIAGRAM_TOTAL_FRAMES;

/**
 * All twelve beats on one continuous frame timeline (0 to TOTAL_STORY_FRAMES - 1), for
 * driving captions across a single pin that never releases between the two videos. The
 * diagram phases' frames get shifted by VIDEO_TOTAL_FRAMES here; subtract that back off
 * to get the diagram video's own local frame number for seeking it.
 */
export const combinedStoryPhases: VideoStoryPhase[] = [
  ...videoStoryPhases,
  ...diagramStoryPhases.map((phase) => ({
    ...phase,
    startFrame: phase.startFrame + VIDEO_TOTAL_FRAMES,
    endFrame: phase.endFrame + VIDEO_TOTAL_FRAMES,
  })),
];
