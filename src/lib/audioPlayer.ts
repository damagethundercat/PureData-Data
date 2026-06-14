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

declare global {
  interface Window {
    WebPdRuntime?: WebPdRuntime;
  }
}

const initializedContexts = new WeakSet<AudioContext>();
let runtimeLoadPromise: Promise<void> | null = null;

export class PatchAudioPlayer {
  private audioContext: AudioContext | null = null;
  private currentId: string | null = null;
  private webpdNode: AudioWorkletNode | null = null;
  private liveNodes: AudioNode[] = [];
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

    await this.startLivePatch(entry);
    this.currentId = entry.id;
    this.onChange(this.currentId);
  }

  stop(): void {
    if (this.webpdNode) {
      this.webpdNode.port.postMessage({ type: "destroy" });
    }

    for (const node of this.liveNodes) {
      node.disconnect();
    }

    this.webpdNode = null;
    this.liveNodes = [];
    this.currentId = null;
    this.onChange(this.currentId);
  }

  private async startLivePatch(entry: PatchEntry): Promise<void> {
    if (!entry.playback.compiledPath) return;

    const appPath = `${entry.playback.compiledPath.replace(/\/$/, "")}/app`;
    const runtimeUrl = assetUrl(`${appPath}/webpd-runtime.js`);
    const patchUrl = assetUrl(`${appPath}/patch.wasm`);
    const sourceUrl = assetUrl(entry.pdPath);

    const audioContext = this.audioContext ?? new AudioContext();
    this.audioContext = audioContext;

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
    let sawSoundFileRead = false;
    const settings = runtime.defaultSettingsForRun(patchUrl, () => undefined);
    const webpdNode = await runtime.run(audioContext, patch, {
      ...settings,
      messageHandler: (node: AudioWorkletNode, messageEvent: MessageEvent<WebPdWorkletMessage>) => {
        if (
          messageEvent.data.type === "fs" &&
          messageEvent.data.payload?.functionName === "onReadSoundFile"
        ) {
          sawSoundFileRead = true;
        }
        return settings.messageHandler(node, messageEvent);
      }
    });

    const splitter = audioContext.createChannelSplitter(2);
    const left = audioContext.createGain();
    const right = audioContext.createGain();
    const mono = audioContext.createGain();
    const boost = audioContext.createGain();

    left.gain.value = 0.5;
    right.gain.value = 0.5;
    boost.gain.value = 4.5;

    webpdNode.connect(splitter);
    splitter.connect(left, 0);
    splitter.connect(right, 1);
    left.connect(mono);
    right.connect(mono);
    mono.connect(boost);
    boost.connect(audioContext.destination);

    this.webpdNode = webpdNode;
    this.liveNodes = [webpdNode, splitter, left, right, mono, boost];

    await sendStartupMessages(webpdNode, startupMessageIds, () => sawSoundFileRead);
  }
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
  shouldSkip: () => boolean
): Promise<void> {
  if (nodeIds.length === 0) return;

  await new Promise((resolve) => window.setTimeout(resolve, 1200));
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
