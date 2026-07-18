import type { DiagramStoryPhase, VideoStoryPhase } from "@/types/story";

export const VIDEO_FPS = 24;
export const VIDEO_TOTAL_FRAMES = 720;
export const VIDEO_DURATION = VIDEO_TOTAL_FRAMES / VIDEO_FPS;
export const VIDEO_SRC = "/videos/pv-story.mp4";
export const VIDEO_SRC_MOBILE = "/videos/pv-story-mobile.mp4";
export const VIDEO_POSTER = "/images/pv-story-poster.jpg";
/** Scroll distance dedicated to the video story, in viewport-heights. Shared with
 * EnergyFlowDiagram so it can position its own pin exactly where the video's ends. */
export const VIDEO_SCROLL_VH = 5;

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

/** The seven diagram-driven beats: the electrical story that follows the physical build. */
export const diagramStoryPhases: DiagramStoryPhase[] = [
  {
    id: "stromfluss",
    kicker: "Stromfluss",
    title: "Der Strom nimmt seinen Weg",
    description: "Sonnenlicht trifft auf die Zellen – Gleichstrom entsteht in Echtzeit.",
    start: 0,
    end: 0.12,
  },
  {
    id: "wechselrichter",
    kicker: "Wechselrichter",
    title: "Aus Gleichstrom wird Haushaltsstrom",
    description: "Der Wechselrichter wandelt DC in nutzbaren Wechselstrom um – nahezu verlustfrei.",
    start: 0.12,
    end: 0.29,
  },
  {
    id: "batteriespeicher",
    kicker: "Batteriespeicher",
    title: "Sonne, die auch nachts wirkt",
    description: "Überschüssige Energie wird gespeichert, statt ungenutzt ins Netz zu fließen.",
    start: 0.29,
    end: 0.48,
  },
  {
    id: "hausversorgung",
    kicker: "Hausversorgung",
    title: "Ihr Zuhause läuft mit der Sonne",
    description: "Haushaltsgeräte, Heizung und Licht – versorgt aus eigener Erzeugung.",
    start: 0.48,
    end: 0.62,
  },
  {
    id: "wallbox",
    kicker: "Wallbox",
    title: "Tanken, während Sie schlafen",
    description: "Ihr Elektroauto lädt über Nacht mit selbst erzeugtem Strom.",
    start: 0.62,
    end: 0.76,
  },
  {
    id: "smart-home",
    kicker: "Smart Home",
    title: "Energie, die mitdenkt",
    description: "Verbrauch, Speicher und Einspeisung – automatisch optimiert in einer App.",
    start: 0.76,
    end: 0.89,
  },
  {
    id: "abschluss",
    kicker: "Ergebnis",
    title: "Unabhängigkeit ist jetzt Serienausstattung",
    description: "Von der Dachanalyse bis zur Wallbox – eine Anlage, ein Ansprechpartner.",
    start: 0.89,
    end: 1,
  },
];
