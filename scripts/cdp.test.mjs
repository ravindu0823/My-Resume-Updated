import assert from "node:assert/strict";
import { test } from "node:test";
import { countPdfPages } from "./cdp.mjs";

test("reads the page count from the page tree", () => {
  const pdf = Buffer.from("1 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj 3 0 obj << /Type /Page >> endobj", "latin1");
  assert.equal(countPdfPages(pdf), 2);
});

test("falls back to counting page objects, not the Pages node", () => {
  const pdf = Buffer.from("<< /Type /Page >> << /Type /Page >> << /Type /Page >> << /Type /Pages /Kids [] >>", "latin1");
  assert.equal(countPdfPages(pdf), 3);
});
