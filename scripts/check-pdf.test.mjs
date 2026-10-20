import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { contentHash } from "../lib/content-hash.mjs";
import { checkPdf, PDF_FILE, PDF_META } from "./check-pdf.mjs";

function site({ meta, pdf = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "pdf-"));
  mkdirSync(join(root, "content"), { recursive: true });
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(join(root, "content/profile.ts"), "export const a = 1;\n");
  if (pdf) writeFileSync(join(root, "public", PDF_FILE), "%PDF-1.7");
  if (meta) writeFileSync(join(root, "public", PDF_META), JSON.stringify(meta(root)));
  return root;
}

test("fails when resume.pdf.json is missing", () => {
  const r = checkPdf(site());
  assert.equal(r.ok, false);
  assert.match(r.reason, /run pnpm pdf/);
});

test("fails when the hash differs", () => {
  const r = checkPdf(site({ meta: () => ({ contentHash: "0".repeat(64) }) }));
  assert.deepEqual(r, { ok: false, reason: "content changed; run pnpm pdf" });
});

test("fails when the PDF itself is missing", () => {
  const r = checkPdf(site({ pdf: false, meta: (root) => ({ contentHash: contentHash(root) }) }));
  assert.equal(r.ok, false);
  assert.match(r.reason, /Ravindu-Perera-Resume\.pdf is missing; run pnpm pdf/);
});

test("passes when the hash matches and the PDF exists", () => {
  assert.deepEqual(checkPdf(site({ meta: (root) => ({ contentHash: contentHash(root) }) })), { ok: true });
});
