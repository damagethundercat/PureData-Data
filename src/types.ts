export type PlaybackStatus = "playable" | "download-only";

export type PatchEntry = {
  id: string;
  participantName: string;
  title: string;
  description?: string;
  pdPath: string;
  downloadPath: string;
  playback: {
    status: PlaybackStatus;
    compiledPath?: string;
    startupMessages?: boolean;
    error?: string;
  };
};

export type PdNodeKind = "obj" | "msg" | "floatatom" | "text";

export type PdNode = {
  id: string;
  kind: PdNodeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  connectIndex?: number;
};

export type PdConnection = {
  sourceId: string;
  sourceOutlet: number;
  targetId: string;
  targetInlet: number;
};

export type PdPatchView = {
  canvas: {
    width: number;
    height: number;
  };
  nodes: PdNode[];
  connections: PdConnection[];
};
