import "./styles.css";
import patchesData from "./content/patches.json";
import type { PatchEntry } from "./types";
import { assetUrl } from "./lib/assets";
import { PatchAudioPlayer } from "./lib/audioPlayer";
import { parsePdPatch } from "./lib/pdParser";
import { renderPdSvg } from "./lib/pdRenderer";

const isRedirectingToHttps = redirectToHttpsIfNeeded();
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
const videoModal = createVideoModal();

if (!isRedirectingToHttps) {
  document.body.append(videoModal.element);
  app.append(createPage());
}

function redirectToHttpsIfNeeded(): boolean {
  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (window.location.protocol !== "http:" || isLocalhost) return false;

  window.location.replace(`https:${window.location.href.slice(window.location.protocol.length)}`);
  return true;
}

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
  card.dataset.entryId = entry.id;

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
  download.textContent = downloadLabel(entry);
  actions.append(download);

  if (entry.videoPath) {
    const video = document.createElement("button");
    video.className = "button";
    video.type = "button";
    video.textContent = "Video";
    video.setAttribute("aria-label", `Open video for ${entry.title}`);
    video.addEventListener("click", () => videoModal.open(entry));
    actions.append(video);
  }

  if (entry.playback.status === "playable") {
    const play = document.createElement("button");
    play.className = "button button-primary";
    play.type = "button";
    play.dataset.playEntryId = entry.id;
    play.textContent = "Play";
    play.setAttribute("aria-pressed", "false");
    play.addEventListener("click", async () => {
      play.disabled = true;
      try {
        await player.toggle(entry);
      } catch (error) {
        console.error("Playback could not be started.", error);
        showToast(card, playbackErrorMessage(error));
      } finally {
        play.disabled = false;
      }
    });
    playButtons.set(entry.id, play);
    actions.append(play);
  }

  card.append(header, preview, description, actions);
  return card;
}

function createVideoModal(): { element: HTMLDialogElement; open: (entry: PatchEntry) => void } {
  const dialog = document.createElement("dialog");
  dialog.className = "video-dialog";

  const header = document.createElement("div");
  header.className = "video-dialog-header";

  const meta = document.createElement("div");
  meta.className = "video-dialog-meta";

  const participant = document.createElement("p");
  participant.className = "participant";

  const title = document.createElement("h2");

  const close = document.createElement("button");
  close.className = "button video-dialog-close";
  close.type = "button";
  close.textContent = "x";
  close.setAttribute("aria-label", "Close video");

  const video = document.createElement("video");
  video.controls = true;
  video.preload = "metadata";
  video.playsInline = true;

  meta.append(participant, title);
  header.append(meta, close);
  dialog.append(header, video);

  function closeDialog(): void {
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("poster");
    video.load();

    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
      return;
    }

    dialog.removeAttribute("open");
  }

  close.addEventListener("click", closeDialog);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  return {
    element: dialog,
    open(entry: PatchEntry): void {
      if (!entry.videoPath) return;

      participant.textContent = entry.participantName;
      title.textContent = entry.title;
      video.src = assetUrl(entry.videoPath);

      if (entry.videoPosterPath) {
        video.poster = assetUrl(entry.videoPosterPath);
      } else {
        video.removeAttribute("poster");
      }

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
        return;
      }

      dialog.setAttribute("open", "");
    }
  };
}

async function renderPreview(entry: PatchEntry, container: HTMLElement): Promise<void> {
  try {
    const response = await fetch(assetUrl(entry.pdPath));
    if (!response.ok) {
      throw new Error(`Failed to fetch ${entry.pdPath}`);
    }
    const source = await response.text();
    const view = parsePdPatch(source);
    container.replaceChildren(createPatchViewport(renderPdSvg(view), view.canvas));
  } catch {
    container.textContent = "patch preview unavailable";
    container.classList.add("is-error");
  }
}

function createPatchViewport(
  svg: SVGSVGElement,
  canvas: { width: number; height: number }
): HTMLElement {
  const shell = document.createElement("div");
  shell.className = "patch-viewport-shell";

  const viewport = document.createElement("div");
  viewport.className = "patch-viewport";
  viewport.tabIndex = 0;
  viewport.setAttribute("aria-label", "Pure Data patch preview");

  const stage = document.createElement("div");
  stage.className = "patch-viewport-stage";
  stage.append(svg);

  const controls = document.createElement("div");
  controls.className = "patch-viewport-controls";

  const zoomOut = createViewportButton("-", "Zoom out");
  const fit = createViewportButton("Fit", "Fit patch");
  const zoomIn = createViewportButton("+", "Zoom in");
  controls.append(zoomOut, fit, zoomIn);

  viewport.append(stage);
  shell.append(viewport, controls);

  const minZoom = 0.08;
  const maxZoom = 2.5;
  let zoom = 1;

  function fitZoom(): number {
    const availableWidth = Math.max(viewport.clientWidth - 2, 1);
    return clamp(availableWidth / canvas.width, minZoom, 1);
  }

  function setZoom(nextZoom: number, anchorX = viewport.clientWidth / 2, anchorY = viewport.clientHeight / 2): void {
    const previousZoom = zoom;
    const boundedZoom = clamp(nextZoom, minZoom, maxZoom);
    if (boundedZoom === previousZoom) return;

    const contentX = (viewport.scrollLeft + anchorX) / previousZoom;
    const contentY = (viewport.scrollTop + anchorY) / previousZoom;
    zoom = boundedZoom;

    const scaledWidth = Math.max(canvas.width * zoom, viewport.clientWidth);
    const scaledHeight = Math.max(canvas.height * zoom, viewport.clientHeight);
    stage.style.width = `${scaledWidth}px`;
    stage.style.height = `${scaledHeight}px`;
    svg.style.width = `${canvas.width * zoom}px`;
    svg.style.height = `${canvas.height * zoom}px`;

    window.requestAnimationFrame(() => {
      viewport.scrollLeft = contentX * zoom - anchorX;
      viewport.scrollTop = contentY * zoom - anchorY;
    });
  }

  zoomOut.addEventListener("click", () => setZoom(zoom / 1.22));
  zoomIn.addEventListener("click", () => setZoom(zoom * 1.22));
  fit.addEventListener("click", () => {
    setZoom(fitZoom(), 0, 0);
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
  });

  viewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const nextZoom = zoom * (event.deltaY > 0 ? 0.9 : 1.1);
      setZoom(nextZoom, event.clientX - rect.left, event.clientY - rect.top);
    },
    { passive: false }
  );

  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = viewport.scrollLeft;
    startScrollTop = viewport.scrollTop;
    viewport.classList.add("is-panning");
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isPanning) return;
    viewport.scrollLeft = startScrollLeft - (event.clientX - startX);
    viewport.scrollTop = startScrollTop - (event.clientY - startY);
  });

  viewport.addEventListener("pointerup", (event) => {
    isPanning = false;
    viewport.classList.remove("is-panning");
    viewport.releasePointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointercancel", () => {
    isPanning = false;
    viewport.classList.remove("is-panning");
  });

  window.requestAnimationFrame(() => {
    setZoom(fitZoom(), 0, 0);
  });

  return shell;
}

function createViewportButton(label: string, title: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "patch-viewport-button";
  button.type = "button";
  button.textContent = label;
  button.title = title;
  button.setAttribute("aria-label", title);
  return button;
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

function downloadLabel(entry: PatchEntry): string {
  if (entry.downloadPath.endsWith(".zip")) return "Download package";
  if (entry.downloadPath.endsWith(".pd")) return "Download PD";
  return "Download";
}

function playbackErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.includes("WEBPD_REQUIRES_HTTPS")) {
    return "Playback requires HTTPS. Reloading may be needed.";
  }

  return "Playback could not be started.";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
