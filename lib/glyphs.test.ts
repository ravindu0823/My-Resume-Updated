import assert from "node:assert/strict";
import { test } from "node:test";
import { projects } from "../content/work.ts";
import { GLYPHS } from "./glyphs.ts";

test("every project's motif has a drawn glyph", () => {
  for (const p of projects) assert.ok(GLYPHS[p.motif]?.startsWith("M"), `${p.slug}: no glyph for "${p.motif}"`);
});
