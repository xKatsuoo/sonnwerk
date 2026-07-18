/**
 * Builds the scroll-scrubbed hero video from the three raw drone clips.
 *
 * Pipeline: trim each clip to an exact frame count -> concat (stream copy,
 * since all segments share identical encode params) -> derive a lighter
 * mobile variant -> extract the frame-0 poster -> write frame-boundary
 * metadata that the client video engine and section copy both read from.
 *
 * Run with: npm run build:video
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ffmpegPath from "ffmpeg-static";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, "$1");
const SRC_DIR = join(ROOT, "source-videos");
const OUT_VIDEO_DIR = join(ROOT, "public", "videos");
const OUT_IMAGE_DIR = join(ROOT, "public", "images");

const FPS = 24;
const FRAMES_PER_CLIP = 240; // 10s @ 24fps, matches raw clip length exactly
const WIDTH = 1280;
const HEIGHT = 720;
const MOBILE_WIDTH = 854;
const MOBILE_HEIGHT = 480;
const GOP = 6; // short keyframe interval so random-access scrubbing stays smooth

/** Story phases the finished, concatenated video is divided into. */
const SEGMENTS = [
  {
    file: "House1.mp4",
    phases: [
      { id: "haus", label: "Ihr Zuhause", startFrame: 0, endFrame: 119 },
      { id: "dachanalyse", label: "Dachanalyse", startFrame: 120, endFrame: 239 },
    ],
  },
  {
    file: "House2.mp4",
    phases: [{ id: "pv-planung", label: "PV-Planung", startFrame: 240, endFrame: 479 }],
  },
  {
    file: "House3.mp4",
    phases: [
      { id: "montage", label: "Montage", startFrame: 480, endFrame: 599 },
      { id: "fertige-anlage", label: "Fertige Anlage", startFrame: 600, endFrame: 719 },
    ],
  },
];

function run(args) {
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}

function main() {
  for (const seg of SEGMENTS) {
    const path = join(SRC_DIR, seg.file);
    if (!existsSync(path)) {
      throw new Error(`Missing source clip: ${path}`);
    }
  }

  mkdirSync(OUT_VIDEO_DIR, { recursive: true });
  mkdirSync(OUT_IMAGE_DIR, { recursive: true });

  const tmp = mkdtempSync(join(tmpdir(), "pv-story-"));
  const segmentFiles = [];

  console.log("[1/5] Trimming and normalizing source clips...");
  SEGMENTS.forEach((seg, i) => {
    const inPath = join(SRC_DIR, seg.file);
    const outPath = join(tmp, `seg-${i}.mp4`);
    run([
      "-y",
      "-i",
      inPath,
      "-frames:v",
      String(FRAMES_PER_CLIP),
      "-an",
      "-vf",
      `scale=${WIDTH}:${HEIGHT}:flags=lanczos,fps=${FPS}`,
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-pix_fmt",
      "yuv420p",
      "-g",
      String(GOP),
      "-keyint_min",
      String(GOP),
      "-sc_threshold",
      "0",
      "-crf",
      "23",
      "-preset",
      "slow",
      "-movflags",
      "+faststart",
      outPath,
    ]);
    segmentFiles.push(outPath);
  });

  console.log("[2/5] Concatenating segments...");
  const listPath = join(tmp, "concat.txt");
  writeFileSync(listPath, segmentFiles.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"));
  const finalVideo = join(OUT_VIDEO_DIR, "pv-story.mp4");
  run(["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", finalVideo]);

  console.log("[3/5] Encoding mobile variant...");
  const mobileVideo = join(OUT_VIDEO_DIR, "pv-story-mobile.mp4");
  run([
    "-y",
    "-i",
    finalVideo,
    "-an",
    "-vf",
    `scale=${MOBILE_WIDTH}:${MOBILE_HEIGHT}:flags=lanczos`,
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-pix_fmt",
    "yuv420p",
    "-g",
    String(GOP),
    "-keyint_min",
    String(GOP),
    "-sc_threshold",
    "0",
    "-crf",
    "26",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    mobileVideo,
  ]);

  console.log("[4/5] Extracting poster frame...");
  const poster = join(OUT_IMAGE_DIR, "pv-story-poster.jpg");
  run(["-y", "-i", finalVideo, "-frames:v", "1", "-update", "1", "-q:v", "2", poster]);

  console.log("[5/5] Writing frame metadata...");
  const totalFrames = SEGMENTS.length * FRAMES_PER_CLIP;
  const phases = SEGMENTS.flatMap((s) => s.phases);
  const meta = {
    fps: FPS,
    totalFrames,
    duration: totalFrames / FPS,
    width: WIDTH,
    height: HEIGHT,
    phases,
  };
  writeFileSync(join(OUT_VIDEO_DIR, "pv-story-meta.json"), JSON.stringify(meta, null, 2));

  rmSync(tmp, { recursive: true, force: true });
  console.log("Done. Wrote pv-story.mp4, pv-story-mobile.mp4, pv-story-poster.jpg, pv-story-meta.json");
}

main();
