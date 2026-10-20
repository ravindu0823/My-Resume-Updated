import type { Diagram, DiagramEdge, DiagramNode } from "../content/schema.ts";

export type PlacedNode = DiagramNode & { x: number; y: number; w: number; h: number };
export type PlacedEdge = DiagramEdge & { path: string; mid: { x: number; y: number } };
export type Layout = { width: number; height: number; nodes: PlacedNode[]; edges: PlacedEdge[] };

type Options = { cellW?: number; cellH?: number; nodeW?: number; nodeH?: number };

/** Advance width of one character of an edge label (11px Geist Mono), used to size label pills. */
export const EDGE_LABEL_CHAR = 6.6;

/**
 * Places nodes on a fixed grid (cols 0-3, rows 0-2) and routes each edge as a straight segment
 * between the facing sides of its two nodes: left/right when the horizontal gap dominates or
 * ties, top/bottom when the vertical gap dominates. Deterministic, so the SVG is stable in tests.
 */
export function layoutDiagram(d: Diagram, opts: Options = {}): Layout {
  const { cellW = 200, cellH = 100, nodeW = 128, nodeH = 48 } = opts;
  const nodes: PlacedNode[] = d.nodes.map((n) => ({
    ...n,
    x: n.col * cellW + (cellW - nodeW) / 2,
    y: n.row * cellH + (cellH - nodeH) / 2,
    w: nodeW,
    h: nodeH,
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const edges: PlacedEdge[] = d.edges.map((e) => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) throw new Error(`edge ${e.from} -> ${e.to} references a missing node`);
    const dx = b.col - a.col;
    const dy = b.row - a.row;
    let start: [number, number];
    let end: [number, number];
    if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
      start = [dx > 0 ? a.x + a.w : a.x, a.y + a.h / 2];
      end = [dx > 0 ? b.x : b.x + b.w, b.y + b.h / 2];
    } else {
      start = [a.x + a.w / 2, dy > 0 ? a.y + a.h : a.y];
      end = [b.x + b.w / 2, dy > 0 ? b.y : b.y + b.h];
    }
    return {
      ...e,
      path: `M${start[0]} ${start[1]} L${end[0]} ${end[1]}`,
      mid: { x: (start[0] + end[0]) / 2, y: (start[1] + end[1]) / 2 },
    };
  });

  const maxCol = Math.max(...d.nodes.map((n) => n.col));
  const maxRow = Math.max(...d.nodes.map((n) => n.row));
  return { width: (maxCol + 1) * cellW, height: (maxRow + 1) * cellH, nodes, edges };
}
