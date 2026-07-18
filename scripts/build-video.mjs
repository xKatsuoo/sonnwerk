/**
 * Builds the scroll-scrubbed hero video from the three raw drone clips.
 * Run with: npm run build:video
 */
import { join } from "node:path";
import { buildScrollVideo } from "./lib/build-scroll-video.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, "$1");

buildScrollVideo({
  srcDir: join(ROOT, "source-videos"),
  outVideoDir: join(ROOT, "public", "videos"),
  outImageDir: join(ROOT, "public", "images"),
  outBaseName: "pv-story",
  fps: 24,
  width: 1920,
  height: 1080,
  mobileWidth: 854,
  mobileHeight: 480,
  // Keyframe interval: short enough that any seek only needs to decode a few delta
  // frames, but not so short that rapid scrubbing has to keep decoding a fresh full
  // frame every quarter-second. At 1080p a keyframe is ~4x the pixel data of 720p, so
  // GOP=6 (which was fine at 720p) made every fast scroll re-decode a very heavy frame
  // too often and froze the page. 12 (0.5s) keeps seeks cheap without that overload.
  gop: 12,
  segments: [
    {
      file: "House1.mp4",
      frames: 240,
      phases: [
        { id: "haus", label: "Ihr Zuhause", startFrame: 0, endFrame: 119 },
        { id: "dachanalyse", label: "Dachanalyse", startFrame: 120, endFrame: 239 },
      ],
    },
    {
      file: "House2.mp4",
      frames: 240,
      phases: [{ id: "pv-planung", label: "PV-Planung", startFrame: 240, endFrame: 479 }],
    },
    {
      file: "House3.mp4",
      frames: 240,
      phases: [
        { id: "montage", label: "Montage", startFrame: 480, endFrame: 599 },
        { id: "fertige-anlage", label: "Fertige Anlage", startFrame: 600, endFrame: 719 },
      ],
    },
  ],
});
