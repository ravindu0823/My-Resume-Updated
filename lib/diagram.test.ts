import assert from "node:assert/strict";
import { test } from "node:test";
import type { Diagram } from "../content/schema.ts";
import { featured } from "../content/work.ts";
import { describeFlow, EDGE_LABEL_CHAR, layoutDiagram } from "./diagram.ts";

const two = (b: { col: 0 | 1 | 2 | 3; row: 0 | 1 | 2 }): Diagram => ({
  nodes: [
    { id: "a", label: "A", kind: "service", col: 0, row: 0 },
    { id: "b", label: "B", kind: "store", ...b },
  ],
  edges: [{ from: "a", to: "b", label: "x" }],
});

test("places nodes on the grid", () => {
  const out = layoutDiagram(two({ col: 2, row: 1 }));
  const b = out.nodes.find((n) => n.id === "b")!;
  assert.deepEqual({ x: b.x, y: b.y, w: b.w, h: b.h }, { x: 436, y: 126, w: 128, h: 48 });
});

test("sizes the canvas to the used grid", () => {
  const out = layoutDiagram(two({ col: 3, row: 2 }));
  assert.deepEqual({ width: out.width, height: out.height }, { width: 800, height: 300 });
});

test("connects right side to left side for a left-to-right edge", () => {
  const out = layoutDiagram(two({ col: 1, row: 0 }));
  assert.equal(out.edges[0]!.path, "M164 50 L236 50");
  assert.deepEqual(out.edges[0]!.mid, { x: 200, y: 50 });
});

test("connects bottom to top for a vertical edge", () => {
  assert.equal(layoutDiagram(two({ col: 0, row: 1 })).edges[0]!.path, "M100 74 L100 126");
});

test("connects left side to right side for a right-to-left edge", () => {
  const d = two({ col: 1, row: 0 });
  d.edges = [{ from: "b", to: "a" }];
  assert.equal(layoutDiagram(d).edges[0]!.path, "M236 50 L164 50");
});

test("every shipped diagram lays out without a zero-length edge", () => {
  for (const f of featured) {
    const out = layoutDiagram(f.diagram);
    assert.equal(out.edges.length, f.diagram.edges.length, f.slug);
    for (const e of out.edges) {
      const [, x1, y1, x2, y2] = /^M(-?[\d.]+) (-?[\d.]+) L(-?[\d.]+) (-?[\d.]+)$/.exec(e.path)!.map(Number);
      assert.ok(x1 !== x2 || y1 !== y2, `${f.slug}: ${e.from}->${e.to} has zero length`);
    }
  }
});

test("shipped diagrams only use straight horizontal or vertical edges", () => {
  for (const f of featured) {
    const at = (id: string) => f.diagram.nodes.find((n) => n.id === id)!;
    for (const e of f.diagram.edges) {
      const a = at(e.from);
      const b = at(e.to);
      assert.ok(a.col === b.col || a.row === b.row, `${f.slug}: ${e.from}->${e.to} is diagonal`);
    }
  }
});

test("labels on horizontal edges fit the gap between columns", () => {
  const gap = 200 - 128;
  for (const f of featured) {
    for (const e of layoutDiagram(f.diagram).edges) {
      const [, , y1, , y2] = /^M(-?[\d.]+) (-?[\d.]+) L(-?[\d.]+) (-?[\d.]+)$/.exec(e.path)!.map(Number);
      if (y1 !== y2 || !e.label) continue;
      assert.ok(e.label.length * EDGE_LABEL_CHAR + 12 <= gap, `${f.slug}: label "${e.label}" is too wide for the gap`);
    }
  }
});

test("describes the flow in words for screen readers", () => {
  const d = two({ col: 1, row: 0 });
  d.edges = [{ from: "a", to: "b", label: "writes" }, { from: "b", to: "a", async: true }];
  assert.equal(describeFlow(d), "A to B (writes); B asynchronously to A.");
});
