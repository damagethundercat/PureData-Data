import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const manifestPath = join(root, "src", "content", "patches.json");
const publicDir = join(root, "public");
const compiledDir = join(publicDir, "compiled");
const webpdCliPath = join(root, "node_modules", "webpd", "bin", "cli.mjs");

const entries = JSON.parse(readFileSync(manifestPath, "utf8"));
mkdirSync(compiledDir, { recursive: true });

const updatedEntries = entries.map((entry) => {
  const playbackSourcePath = entry.playback?.sourcePath ?? entry.pdPath;
  const patchPath = join(publicDir, playbackSourcePath);
  const outDir = join(compiledDir, entry.id);
  const appDir = join(outDir, "app");
  const previewPath = join(outDir, "preview.wav");

  if (entry.playback?.compile === false) {
    rmSync(outDir, { recursive: true, force: true });
    return markDownloadOnly(entry, entry.playback.error || "WebPd playback disabled for this patch.");
  }

  if (!existsSync(patchPath)) {
    return markDownloadOnly(entry, `Patch file not found: ${playbackSourcePath}`);
  }

  rmSync(outDir, { recursive: true, force: true });

  const supportResult = runWebPd(["-i", patchPath, "--check-support"]);
  const supportOutput = cleanOutput(supportResult);
  if (supportResult.status !== 0 || supportOutput.some((line) => line.includes("(not supported)"))) {
    return markDownloadOnly(entry, summarizeSupportFailure(supportOutput, supportResult));
  }

  mkdirSync(appDir, { recursive: true });

  const appResult = runWebPd(["-i", patchPath, "-o", appDir, "-f", "app"]);
  if (appResult.status !== 0) {
    return markDownloadOnly(entry, summarizeFailure(appResult));
  }

  copyPackageAssets(dirname(patchPath), appDir);

  const wavResult = runWebPd([
    "-i",
    patchPath,
    "-o",
    previewPath,
    "-f",
    "wav",
    "--audio-duration",
    "24"
  ]);
  if (wavResult.status !== 0) {
    return markDownloadOnly(entry, summarizeFailure(wavResult));
  }

  return {
    ...entry,
    playback: {
      ...entry.playback,
      status: "playable",
      compiledPath: `compiled/${entry.id}`,
      error: undefined
    }
  };
});

writeFileSync(manifestPath, `${JSON.stringify(updatedEntries, null, 2)}\n`);
console.log(`Updated ${updatedEntries.length} patch entries.`);

function runWebPd(args) {
  return spawnSync(process.execPath, [webpdCliPath, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function markDownloadOnly(entry, error) {
  return {
    ...entry,
    playback: {
      ...entry.playback,
      status: "download-only",
      compiledPath: undefined,
      error
    }
  };
}

function summarizeFailure(result) {
  const output = cleanOutput(result);

  if (result.error) {
    return result.error.message;
  }

  return output.find((line) => line.startsWith("error:")) || output.at(-1) || "WebPd compilation failed.";
}

function summarizeSupportFailure(output, result) {
  if (result.error) {
    return result.error.message;
  }

  return (
    output.find((line) => line.includes("not implemented")) ||
    output.find((line) => line.includes("(not supported)")) ||
    "Patch uses WebPd-unsupported objects."
  );
}

function cleanOutput(result) {
  return `${result.stderr || ""}\n${result.stdout || ""}`
    .split(/\r?\n/)
    .map((line) => line.replace(/\u001b\[[0-9;]*m/g, "").trim())
    .filter(Boolean);
}

function copyPackageAssets(patchDir, appDir) {
  for (const item of readdirSync(patchDir)) {
    if (item === "main.pd") continue;

    const source = join(patchDir, item);
    const destination = join(appDir, item);
    const stats = statSync(source);
    if (stats.isDirectory()) {
      cpSync(source, destination, { recursive: true });
    } else if (!item.endsWith(".pd")) {
      cpSync(source, destination);
    }
  }
}
