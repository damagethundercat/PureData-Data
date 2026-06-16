import type { PatchEntry } from "../types";
import { assetUrl } from "./assets";
import { findLoadbangMessageReceiverIds } from "./pdParser";

type PlaybackChange = (entryId: string | null) => void;

type WebPdRuntime = {
  initialize: (audioContext: AudioContext) => Promise<void>;
  readMetadata: (compiledPatch: ArrayBuffer) => Promise<WebPdMetadata>;
  run: (
    audioContext: AudioContext,
    compiledPatch: ArrayBuffer,
    settings: unknown
  ) => Promise<AudioWorkletNode>;
  defaultSettingsForRun: (
    patchUrl: string,
    messageSender?: (nodeId: string, portletId: string, message: Array<string | number>) => void
  ) => WebPdRunSettings;
};

type WebPdRunSettings = {
  messageHandler: (node: AudioWorkletNode, messageEvent: MessageEvent<WebPdWorkletMessage>) => unknown;
};

type WebPdWorkletMessage = {
  type: string;
  payload?: {
    functionName?: string;
  };
};

type WebPdMetadata = {
  settings?: {
    io?: {
      messageReceivers?: Record<string, string[]>;
    };
  };
};

type AudioWarmup = {
  stop: () => void;
  stopAfter: (delay: number) => void;
};

declare global {
  interface Window {
    WebPdRuntime?: WebPdRuntime;
  }
}

const initializedContexts = new WeakSet<AudioContext>();
let runtimeLoadPromise: Promise<void> | null = null;
const DEFAULT_STARTUP_MESSAGE_DELAYS = [3000, 3500, 3500];

export class PatchAudioPlayer {
  private audioContext: AudioContext | null = null;
  private currentId: string | null = null;
  private playbackSerial = 0;
  private webpdNode: AudioWorkletNode | null = null;
  private liveNodes: AudioNode[] = [];
  private audioWarmup: AudioWarmup | null = null;
  private readonly onChange: PlaybackChange;

  constructor(onChange: PlaybackChange) {
    this.onChange = onChange;
  }

  get activeId(): string | null {
    return this.currentId;
  }

  async toggle(entry: PatchEntry): Promise<void> {
    if (this.currentId === entry.id) {
      this.stop();
      return;
    }

    this.stop();

    if (entry.playback.status !== "playable" || !entry.playback.compiledPath) {
      return;
    }

    const playbackToken = ++this.playbackSerial;
    await this.startLivePatch(entry, playbackToken);
    if (this.playbackSerial !== playbackToken) return;

    this.currentId = entry.id;
    this.onChange(this.currentId);
  }

  stop(): void {
    this.playbackSerial += 1;

    if (this.webpdNode) {
      this.webpdNode.port.postMessage({ type: "destroy" });
    }

    for (const node of this.liveNodes) {
      node.disconnect();
    }

    this.audioWarmup?.stop();
    this.audioWarmup = null;
    this.webpdNode = null;
    this.liveNodes = [];
    this.currentId = null;
    this.onChange(this.currentId);
  }

  private async startLivePatch(entry: PatchEntry, playbackToken: number): Promise<void> {
    if (!entry.playback.compiledPath) return;

    const appPath = `${entry.playback.compiledPath.replace(/\/$/, "")}/app`;
    const runtimeUrl = assetUrl(`${appPath}/webpd-runtime.js`);
    const patchUrl = assetUrl(`${appPath}/patch.wasm`);
    const sourceUrl = assetUrl(entry.playback.sourcePath ?? entry.pdPath);

    const audioContext = this.audioContext ?? new AudioContext();
    this.audioContext = audioContext;

    if (!window.isSecureContext) {
      throw new Error("WEBPD_REQUIRES_HTTPS");
    }

    if (!audioContext.audioWorklet) {
      throw new Error("WEBPD_REQUIRES_AUDIOWORKLET");
    }

    const warmup = startAudioWarmup(audioContext);
    this.audioWarmup = warmup;

    try {
      await resumeAudioContext(audioContext);
      await loadWebPdRuntime(runtimeUrl);

      const runtime = window.WebPdRuntime;
      if (!runtime) {
        throw new Error("WebPd runtime did not initialize.");
      }

      if (!initializedContexts.has(audioContext)) {
        await runtime.initialize(audioContext);
        initializedContexts.add(audioContext);
      }

      const [patchResponse, pdSource] = await Promise.all([
        fetch(patchUrl),
        fetch(sourceUrl).then((response) => (response.ok ? response.text() : "")).catch(() => "")
      ]);
      if (!patchResponse.ok) {
        throw new Error(`Could not load ${patchUrl}`);
      }

      const patch = await patchResponse.arrayBuffer();
      const startupMessageIds =
        entry.playback.startupMessages === false ? [] : await getStartupMessageIds(runtime, patch, pdSource);
      let sawFileActivity = false;
      const settings = runtime.defaultSettingsForRun(patchUrl, () => undefined);
      const webpdNode = await runtime.run(audioContext, patch, {
        ...settings,
        messageHandler: (node: AudioWorkletNode, messageEvent: MessageEvent<WebPdWorkletMessage>) => {
          const functionName = messageEvent.data.payload?.functionName;
          if (
            messageEvent.data.type === "fs" &&
            (functionName === "onReadSoundFile" || functionName === "onOpenSoundReadStream")
          ) {
            sawFileActivity = true;
          }
          return settings.messageHandler(node, messageEvent);
        }
      });

      const splitter = audioContext.createChannelSplitter(2);
      const left = audioContext.createGain();
      const right = audioContext.createGain();
      const mono = audioContext.createGain();
      const boost = audioContext.createGain();
      const outputGain = sanitizeGain(entry.playback.outputGain ?? 4.5);

      left.gain.value = 0.5;
      right.gain.value = 0.5;
      boost.gain.value = outputGain;

      webpdNode.connect(splitter);
      splitter.connect(left, 0);
      splitter.connect(right, 1);
      left.connect(mono);
      right.connect(mono);
      mono.connect(boost);
      boost.connect(audioContext.destination);
      await resumeAudioContext(audioContext);

      if (this.playbackSerial !== playbackToken) {
        webpdNode.port.postMessage({ type: "destroy" });
        webpdNode.disconnect();
        splitter.disconnect();
        left.disconnect();
        right.disconnect();
        mono.disconnect();
        boost.disconnect();
        warmup.stop();
        if (this.audioWarmup === warmup) {
          this.audioWarmup = null;
        }
        return;
      }

      this.webpdNode = webpdNode;
      this.liveNodes = [webpdNode, splitter, left, right, mono, boost];
      warmup.stopAfter(needsPersistentAudioWarmup() ? 1800 : 300);

      void sendStartupMessages(
        webpdNode,
        startupMessageIds,
        entry.playback.startupMessageDelays ?? DEFAULT_STARTUP_MESSAGE_DELAYS,
        () => this.playbackSerial !== playbackToken || sawFileActivity
      ).catch((error: unknown) => {
        console.warn("Could not send WebPd startup messages.", error);
      });
    } catch (error) {
      warmup.stop();
      if (this.audioWarmup === warmup) {
        this.audioWarmup = null;
      }
      throw error;
    }
  }
}

function sanitizeGain(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(0, Math.min(value, 8));
}

function startAudioWarmup(audioContext: AudioContext): AudioWarmup {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  let stopTimer = 0;
  let fadeTimer = 0;
  let isStopped = false;

  oscillator.type = "sine";
  oscillator.frequency.value = 440;

  gain.gain.value = needsPersistentAudioWarmup() ? 0.00001 : 0;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();

  const stop = () => {
    if (isStopped) return;
    isStopped = true;
    window.clearTimeout(stopTimer);
    window.clearTimeout(fadeTimer);

    try {
      oscillator.stop();
    } catch {
      // Oscillator may already be stopped on some WebKit builds.
    }

    oscillator.disconnect();
    gain.disconnect();
  };

  return {
    stop,
    stopAfter(delay: number): void {
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        const now = audioContext.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0, now, 0.03);
        fadeTimer = window.setTimeout(stop, 120);
      }, delay);
    }
  };
}

function needsPersistentAudioWarmup(): boolean {
  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(navigator.userAgent);
}

function loadWebPdRuntime(runtimeUrl: string): Promise<void> {
  if (window.WebPdRuntime) {
    return Promise.resolve();
  }

  runtimeLoadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = runtimeUrl;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${runtimeUrl}`)), {
      once: true
    });
    document.head.append(script);
  });

  return runtimeLoadPromise;
}

async function resumeAudioContext(audioContext: AudioContext): Promise<void> {
  if (audioContext.state !== "suspended") return;

  await Promise.race([
    audioContext.resume(),
    new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error("Audio context could not be resumed.")), 3000);
    })
  ]);
}

async function getStartupMessageIds(
  runtime: WebPdRuntime,
  patch: ArrayBuffer,
  pdSource: string
): Promise<string[]> {
  const ids = findLoadbangMessageReceiverIds(pdSource);
  if (ids.length === 0) return [];

  const metadata = await runtime.readMetadata(patch);
  const receivers = metadata.settings?.io?.messageReceivers ?? {};
  return ids.filter((id) => receivers[id]?.includes("0"));
}

async function sendStartupMessages(
  webpdNode: AudioWorkletNode,
  nodeIds: string[],
  delays: number[],
  shouldSkip: () => boolean
): Promise<void> {
  if (nodeIds.length === 0) return;

  for (const delay of delays) {
    await new Promise((resolve) => window.setTimeout(resolve, delay));
    if (shouldSkip()) return;

    for (const nodeId of nodeIds) {
      webpdNode.port.postMessage({
        type: "io:messageReceiver",
        payload: {
          nodeId,
          portletId: "0",
          message: ["bang"]
        }
      });
    }
  }
}
