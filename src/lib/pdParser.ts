import type { PdConnection, PdNode, PdPatchView } from "../types";

const DEFAULT_CANVAS = { width: 640, height: 420 };
const CONNECTABLE_KINDS = new Set(["obj", "msg", "floatatom"]);

export function parsePdPatch(source: string): PdPatchView {
  const statements = collectStatements(source);
  const nodes: PdNode[] = [];
  const connectableIds = new Map<number, string>();
  const pendingConnections: Array<{
    sourceIndex: number;
    sourceOutlet: number;
    targetIndex: number;
    targetInlet: number;
  }> = [];
  let canvas = { ...DEFAULT_CANVAS };
  let sawRootCanvas = false;
  let nestedCanvasDepth = 0;
  let pdNodeIndex = 0;

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#N canvas")) {
      if (!sawRootCanvas) {
        canvas = parseCanvas(trimmed);
        sawRootCanvas = true;
      } else {
        nestedCanvasDepth += 1;
      }
      continue;
    }

    if (nestedCanvasDepth > 0) {
      if (trimmed.startsWith("#X restore")) {
        nestedCanvasDepth -= 1;
      }
      continue;
    }

    if (trimmed.startsWith("#X connect")) {
      const connection = parseConnection(trimmed);
      if (connection) pendingConnections.push(connection);
      continue;
    }

    const node = parseNode(trimmed, nodes.length, pdNodeIndex);
    if (!node) continue;

    if (typeof node.connectIndex === "number") {
      connectableIds.set(node.connectIndex, node.id);
    }
    pdNodeIndex += 1;
    nodes.push(node);
  }

  const connections: PdConnection[] = pendingConnections.flatMap((connection) => {
    const sourceId = connectableIds.get(connection.sourceIndex);
    const targetId = connectableIds.get(connection.targetIndex);
    if (!sourceId || !targetId) return [];
    return [
      {
        sourceId,
        sourceOutlet: connection.sourceOutlet,
        targetId,
        targetInlet: connection.targetInlet
      }
    ];
  });

  return { canvas: fitCanvas(canvas, nodes), nodes, connections };
}

export function findLoadbangMessageReceiverIds(source: string): string[] {
  const statements = collectStatements(source);
  const loadbangIndexes = new Set<number>();
  const messageIndexes = new Set<number>();
  const connections: Array<{ sourceIndex: number; targetIndex: number }> = [];
  let nestedCanvasDepth = 0;
  let pdNodeIndex = 0;

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#N canvas")) {
      if (pdNodeIndex > 0 || nestedCanvasDepth > 0) {
        nestedCanvasDepth += 1;
      }
      continue;
    }

    if (nestedCanvasDepth > 0) {
      if (trimmed.startsWith("#X restore")) {
        nestedCanvasDepth -= 1;
      }
      continue;
    }

    if (trimmed.startsWith("#X connect")) {
      const connection = parseConnection(trimmed);
      if (connection) {
        connections.push({
          sourceIndex: connection.sourceIndex,
          targetIndex: connection.targetIndex
        });
      }
      continue;
    }

    const parsed = parseNodeKindAndLabel(trimmed);
    if (!parsed) continue;

    if (parsed.kind === "obj" && parsed.label.split(/\s+/)[0] === "loadbang") {
      loadbangIndexes.add(pdNodeIndex);
    }

    if (parsed.kind === "msg") {
      messageIndexes.add(pdNodeIndex);
    }

    pdNodeIndex += 1;
  }

  return connections
    .filter((connection) => loadbangIndexes.has(connection.sourceIndex))
    .filter((connection) => messageIndexes.has(connection.targetIndex))
    .map((connection) => `n_0_${connection.targetIndex}`);
}

function collectStatements(source: string): string[] {
  const statements: string[] = [];
  let current = "";

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    current = current ? `${current} ${line}` : line;
    if (line.endsWith(";")) {
      statements.push(current.slice(0, -1));
      current = "";
    }
  }

  if (current) statements.push(current);
  return statements;
}

function parseCanvas(statement: string): PdPatchView["canvas"] {
  const parts = statement.split(/\s+/);
  const width = Number(parts[4]);
  const height = Number(parts[5]);
  return {
    width: Number.isFinite(width) && width > 0 ? width : DEFAULT_CANVAS.width,
    height: Number.isFinite(height) && height > 0 ? height : DEFAULT_CANVAS.height
  };
}

function parseNode(statement: string, nodeIndex: number, connectableIndex: number): PdNode | null {
  const parsed = parseNodeKindAndLabel(statement);
  if (!parsed) return null;

  const { kind, xValue, yValue, label } = parsed;
  const width = measureNodeWidth(kind, label);
  const height = kind === "text" ? 24 : 28;
  const node: PdNode = {
    id: `node-${nodeIndex}`,
    kind: kind as PdNode["kind"],
    x: Number(xValue),
    y: Number(yValue),
    width,
    height,
    label
  };

  if (CONNECTABLE_KINDS.has(kind)) {
    node.connectIndex = connectableIndex;
  }

  return node;
}

function parseNodeKindAndLabel(statement: string) {
  const match = statement.match(/^#X\s+(obj|msg|floatatom|text)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) return null;

  const [, kind, xValue, yValue, rawLabel] = match;
  return {
    kind: kind as PdNode["kind"],
    xValue,
    yValue,
    label: formatLabel(kind, rawLabel)
  };
}

function parseConnection(statement: string) {
  const parts = statement.split(/\s+/);
  const sourceIndex = Number(parts[2]);
  const sourceOutlet = Number(parts[3]);
  const targetIndex = Number(parts[4]);
  const targetInlet = Number(parts[5]);
  if ([sourceIndex, sourceOutlet, targetIndex, targetInlet].some((part) => !Number.isInteger(part))) {
    return null;
  }
  return { sourceIndex, sourceOutlet, targetIndex, targetInlet };
}

function formatLabel(kind: string, rawLabel: string): string {
  const label = rawLabel
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\$/g, "$")
    .trim();

  if (kind === "floatatom") {
    return "float";
  }

  return label || kind;
}

function measureNodeWidth(kind: string, label: string): number {
  if (kind === "text") {
    return Math.min(Math.max(label.length * 7.2, 88), 260);
  }
  return Math.min(Math.max(label.length * 8.4 + 24, 58), 240);
}

function fitCanvas(canvas: PdPatchView["canvas"], nodes: PdNode[]): PdPatchView["canvas"] {
  if (nodes.length === 0) return canvas;

  const right = Math.max(...nodes.map((node) => node.x + node.width));
  const bottom = Math.max(...nodes.map((node) => node.y + node.height));
  return {
    width: Math.max(canvas.width, right + 48),
    height: Math.max(canvas.height, bottom + 48)
  };
}
