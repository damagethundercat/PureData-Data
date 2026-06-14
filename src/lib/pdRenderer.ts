import type { PdPatchView } from "../types";

export function renderPdSvg(view: PdPatchView): SVGSVGElement {
  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${view.canvas.width} ${view.canvas.height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Pure Data patch preview");
  svg.classList.add("pd-canvas");
  if (isDensePatch(view)) {
    svg.classList.add("is-dense");
  }

  const connectionLayer = createSvgElement("g");
  connectionLayer.classList.add("pd-connections");
  const nodeLayer = createSvgElement("g");
  nodeLayer.classList.add("pd-nodes");

  const nodeMap = new Map(view.nodes.map((node) => [node.id, node]));

  for (const connection of view.connections) {
    const source = nodeMap.get(connection.sourceId);
    const target = nodeMap.get(connection.targetId);
    if (!source || !target) continue;

    const line = createSvgElement("line");
    line.setAttribute("x1", `${source.x + source.width / 2}`);
    line.setAttribute("y1", `${source.y + source.height}`);
    line.setAttribute("x2", `${target.x + target.width / 2}`);
    line.setAttribute("y2", `${target.y}`);
    connectionLayer.append(line);
  }

  for (const node of view.nodes) {
    const group = createSvgElement("g");
    group.classList.add("pd-node", `pd-node-${node.kind}`);

    if (node.kind !== "text") {
      const rect = createSvgElement("rect");
      rect.setAttribute("x", `${node.x}`);
      rect.setAttribute("y", `${node.y}`);
      rect.setAttribute("width", `${node.width}`);
      rect.setAttribute("height", `${node.height}`);
      group.append(rect);
    }

    const text = createSvgElement("text");
    text.setAttribute("x", `${node.x + 10}`);
    text.setAttribute("y", `${node.y + (node.kind === "text" ? 17 : 18)}`);
    text.textContent = node.label;
    group.append(text);
    nodeLayer.append(group);
  }

  svg.append(connectionLayer, nodeLayer);
  return svg;
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K] {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function isDensePatch(view: PdPatchView): boolean {
  return view.nodes.length > 120 || view.connections.length > 160;
}
