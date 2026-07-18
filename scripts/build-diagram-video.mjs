/**
 * Builds the scroll-scrubbed video for the electrical-journey section (the part that
 * used to be an animated SVG schematic, before real footage existed for it).
 *
 * Segment two is trimmed to 234 of its 240 frames: the source clip ends with a four-way
 * split-screen recap in its last ~6 frames that doesn't fit this scroll-scrubbed format.
 *
 * Run with: npm run build:diagram-video
 */
import { join } from "node:path";
import { buildScrollVideo } from "./lib/build-scroll-video.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, "$1");

buildScrollVideo({
  srcDir: join(ROOT, "source-videos"),
  outVideoDir: join(ROOT, "public", "videos"),
  outImageDir: join(ROOT, "public", "images"),
  outBaseName: "pv-diagram",
  fps: 24,
  width: 1920,
  height: 1080,
  mobileWidth: 854,
  mobileHeight: 480,
  reducedWidth: 1280,
  reducedHeight: 720,
  gop: 12,
  segments: [
    {
      file: "solar-zum-speicher.mp4",
      frames: 240,
      phases: [
        { id: "stromfluss", label: "Stromfluss", startFrame: 0, endFrame: 79 },
        { id: "wechselrichter", label: "Wechselrichter", startFrame: 80, endFrame: 159 },
        { id: "batteriespeicher", label: "Batteriespeicher", startFrame: 160, endFrame: 239 },
      ],
    },
    {
      file: "speicher-zum-haus.mp4",
      frames: 234,
      phases: [
        // No dedicated wallbox footage exists yet — its caption still fades in at the
        // right scroll position, just layered over this clip's continuing footage. Once
        // a wallbox clip exists, splice it in here as its own segment.
        { id: "hausversorgung", label: "Hausversorgung", startFrame: 240, endFrame: 297 },
        { id: "wallbox", label: "Wallbox", startFrame: 298, endFrame: 355 },
        { id: "smart-home", label: "Smart Home", startFrame: 356, endFrame: 414 },
        { id: "abschluss", label: "Ergebnis", startFrame: 415, endFrame: 473 },
      ],
    },
  ],
});
