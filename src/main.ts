import "./styles.css";
import patchesData from "./content/patches.json";
import type { PatchEntry } from "./types";
import { assetUrl } from "./lib/assets";
import { PatchAudioPlayer } from "./lib/audioPlayer";
import { parsePdPatch } from "./lib/pdParser";
import { renderPdSvg } from "./lib/pdRenderer";

const patches = patchesData as PatchEntry[];
const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root.");
}

const playButtons = new Map<string, HTMLButtonElement>();
const player = new PatchAudioPlayer((activeId) => {
  for (const [entryId, button] of playButtons) {
    const isActive = activeId === entryId;
    button.textContent = isActive ? "Stop" : "Play";
    button.setAttribute("aria-pressed", `${isActive}`);
  }
});

app.append(createPage());

function createPage(): HTMLElement {
  const page = document.createElement("section");
  page.className = "archive";

  const header = document.createElement("header");
  header.className = "archive-header";
  header.innerHTML = `
    <p class="eyebrow">Iyohouse</p>
    <h1>PureData⇋Data</h1>
    <p class="intro">워크숍에서 만들어진 작은 회로와 소리의 기록.</p>
  `;
  header.querySelector(".intro")?.remove();

  const grid = document.createElement("div");
  grid.className = "patch-grid";

  for (const entry of patches) {
    grid.append(createPatchCard(entry));
  }

  page.append(header, grid);
  return page;
}

function createPatchCard(entry: PatchEntry): HTMLElement {
  const card = document.createElement("article");
  card.className = `patch-card ${entry.playback.status === "playable" ? "is-playable" : "is-download-only"}`;

  const header = document.createElement("div");
  header.className = "patch-card-header";

  const meta = document.createElement("div");
  meta.className = "patch-meta";
  meta.innerHTML = `
    <p class="participant">${escapeHtml(entry.participantName)}</p>
    <h2>${escapeHtml(entry.title)}</h2>
  `;

  header.append(meta);

  const preview = document.createElement("div");
  preview.className = "patch-preview";
  preview.textContent = "loading patch";
  renderPreview(entry, preview);

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = entry.description ?? "No description.";

  const actions = document.createElement("div");
  actions.className = "patch-actions";

  const download = document.createElement("a");
  download.className = "button";
  download.href = assetUrl(entry.downloadPath);
  download.download = downloadFileName(entry);
  download.textContent = entry.downloadPath.endsWith(".zip") ? "Download package" : "Download";
  actions.append(download);

  if (entry.playback.status === "playable") {
    const play = document.createElement("button");
    play.className = "button button-primary";
    play.type = "button";
    play.textContent = "Play";
    play.setAttribute("aria-pressed", "false");
    play.addEventListener("click", async () => {
      play.disabled = true;
      try {
        await player.toggle(entry);
      } catch {
        showToast(card, "Audio preview could not be started.");
      } finally {
        play.disabled = false;
      }
    });
    playButtons.set(entry.id, play);
    actions.append(play);
  }

  if (entry.playback.status === "download-only" && entry.playback.error) {
    const fallback = document.createElement("p");
    fallback.className = "fallback-note";
    fallback.textContent = entry.playback.error;
    card.append(header, preview, description, actions, fallback);
    return card;
  }

  card.append(header, preview, description, actions);
  return card;
}

async function renderPreview(entry: PatchEntry, container: HTMLElement): Promise<void> {
  try {
    const response = await fetch(assetUrl(entry.pdPath));
    if (!response.ok) {
      throw new Error(`Failed to fetch ${entry.pdPath}`);
    }
    const source = await response.text();
    const view = parsePdPatch(source);
    container.replaceChildren(renderPdSvg(view));
  } catch {
    container.textContent = "patch preview unavailable";
    container.classList.add("is-error");
  }
}

function showToast(card: HTMLElement, message: string): void {
  const toast = document.createElement("p");
  toast.className = "toast";
  toast.textContent = message;
  card.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadFileName(entry: PatchEntry): string {
  const fileName = entry.downloadPath.split("/").pop();
  return fileName || `${entry.id}.pd`;
}
