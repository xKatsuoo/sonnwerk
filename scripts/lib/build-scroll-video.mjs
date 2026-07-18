/**
 * Shared pipeline for building a scroll-scrubbed video: trim each source clip to
 * an exact frame count -> concat (stream copy, since all segments share identical
 * encode params) -> derive a lighter mobile variant -> extract the frame-0 poster
 * -> write frame-boundary metadata that the client video engine and section copy
 * both read from.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ffmpegPath from "ffmpeg-static";

function run(args) {
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}

/**
 * @param {object} config
 * @param {string} config.srcDir - directory containing the raw source clips
 * @param {string} config.outVideoDir - output directory for the finished mp4s
 * @param {string} config.outImageDir - output directory for the poster jpg
 * @param {string} config.outBaseName - e.g. "pv-story" -> pv-story.mp4, pv-story-mobile.mp4, pv-story-poster.jpg, pv-story-meta.json
 * @param {number} config.fps
 * @param {number} config.width
 * @param {number} config.height
 * @param {number} config.mobileWidth
 * @param {number} config.mobileHeight
 * @param {number} config.gop - keyframe interval in frames
 * @param {Array<{file: string, frames?: number, phases: Array<{id: string, label: string, startFrame: number, endFrame: number}>}>} config.segments
 *   `frames` trims the source clip to that many frames (omit to use the clip's full length).
 */
export function buildScrollVideo(config) {
  const { srcDir, outVideoDir, outImageDir, outBaseName, fps, width, height, mobileWidth, mobileHeight, gop, segments } =
    config;

  for (const seg of segments) {
    const path = join(srcDir, seg.file);
    if (!existsSync(path)) {
      throw new Error(`Missing source clip: ${path}`);
    }
  }

  mkdirSync(outVideoDir, { recursive: true });
  mkdirSync(outImageDir, { recursive: true });

  const tmp = mkdtempSync(join(tmpdir(), `${outBaseName}-`));
  const segmentFiles = [];

  console.log(`[1/5] Trimming and normalizing source clips for ${outBaseName}...`);
  segments.forEach((seg, i) => {
    const inPath = join(srcDir, seg.file);
    const outPath = join(tmp, `seg-${i}.mp4`);
    const args = [
      "-y",
      "-i",
      inPath,
      ...(seg.frames ? ["-frames:v", String(seg.frames)] : []),
      "-an",
      "-vf",
      `scale=${width}:${height}:flags=lanczos,fps=${fps}`,
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-pix_fmt",
      "yuv420p",
      "-g",
      String(gop),
      "-keyint_min",
      String(gop),
      "-sc_threshold",
      "0",
      "-crf",
      "23",
      "-preset",
      "slow",
      "-movflags",
      "+faststart",
      outPath,
    ];
    run(args);
    segmentFiles.push(outPath);
  });

  console.log("[2/5] Concatenating segments...");
  const listPath = join(tmp, "concat.txt");
  writeFileSync(listPath, segmentFiles.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"));
  const finalVideo = join(outVideoDir, `${outBaseName}.mp4`);
  run(["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", finalVideo]);

  console.log("[3/5] Encoding mobile variant...");
  const mobileVideo = join(outVideoDir, `${outBaseName}-mobile.mp4`);
  run([
    "-y",
    "-i",
    finalVideo,
    "-an",
    "-vf",
    `scale=${mobileWidth}:${mobileHeight}:flags=lanczos`,
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-pix_fmt",
    "yuv420p",
    "-g",
    String(gop),
    "-keyint_min",
    String(gop),
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
  const poster = join(outImageDir, `${outBaseName}-poster.jpg`);
  run(["-y", "-i", finalVideo, "-frames:v", "1", "-update", "1", "-q:v", "2", poster]);

  console.log("[5/5] Writing frame metadata...");
  const lastPhase = segments[segments.length - 1].phases.slice(-1)[0];
  const totalFrames = lastPhase.endFrame + 1;
  const phases = segments.flatMap((s) => s.phases);
  const meta = {
    fps,
    totalFrames,
    duration: totalFrames / fps,
    width,
    height,
    phases,
  };
  writeFileSync(join(outVideoDir, `${outBaseName}-meta.json`), JSON.stringify(meta, null, 2));

  rmSync(tmp, { recursive: true, force: true });
  console.log(
    `Done. Wrote ${outBaseName}.mp4, ${outBaseName}-mobile.mp4, ${outBaseName}-poster.jpg, ${outBaseName}-meta.json`,
  );
}
