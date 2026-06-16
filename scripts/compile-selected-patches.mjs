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
const selectedIds = new Set(process.argv.slice(2));

if (selectedIds.size === 0) {
  console.error("Usage: node scripts/compile-selected-patches.mjs <patch-id> [patch-id...]");
  process.exit(1);
}

const entries = JSON.parse(readFileSync(manifestPath, "utf8"));
mkdirSync(compiledDir, { recursive: true });

let hadFailure = false;
const updatedEntries = entries.map((entry) => {
  if (!selectedIds.has(entry.id)) return entry;

  console.log(`\n==> ${entry.id}`);
  const playbackSourcePath = entry.playback?.sourcePath ?? entry.pdPath;
  const patchPath = join(publicDir, playbackSourcePath);
  const outDir = join(compiledDir, entry.id);
  const appDir = join(outDir, "app");

  if (!existsSync(patchPath)) {
    hadFailure = true;
    return markDownloadOnly(entry, `Patch file not found: ${playbackSourcePath}`);
  }

  rmSync(outDir, { recursive: true, force: true });

  const supportResult = runWebPd(["-i", patchPath, "--check-support"]);
  if (supportResult.status !== 0) {
    hadFailure = true;
    return markDownloadOnly(entry, "WebPd support check failed.");
  }

  mkdirSync(appDir, { recursive: true });

  const appResult = runWebPd(["-i", patchPath, "-o", appDir, "-f", "app", "--engine", "javascript"]);
  if (appResult.status !== 0) {
    hadFailure = true;
    return markDownloadOnly(entry, "WebPd app compilation failed.");
  }

  copyPackageAssets(dirname(patchPath), appDir);

  return {
    ...entry,
    playback: {
      ...entry.playback,
      status: "playable",
      compiledPath: `compiled/${entry.id}`,
      compile: undefined,
      error: undefined
    }
  };
});

writeFileSync(manifestPath, `${JSON.stringify(updatedEntries, null, 2)}\n`);
console.log(`\nUpdated ${selectedIds.size} selected patch entries.`);
process.exit(hadFailure ? 1 : 0);

function runWebPd(args) {
  return spawnSync(process.execPath, [webpdCliPath, ...args], {
    cwd: root,
    stdio: "inherit"
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
