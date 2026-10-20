import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { contentHash } from "./content-hash.mjs";

function tree(files) {
  const root = mkdtempSync(join(tmpdir(), "hash-"));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
}

const base = {
  "content/profile.ts": "export const a = 1;\n",
  "content/work.ts": "export const b = 2;\n",
  "components/resume/ResumeDocument.tsx": "export default 1;\n",
};

test("is stable for identical trees", () => {
  assert.equal(contentHash(tree(base)), contentHash(tree(base)));
  assert.match(contentHash(tree(base)), /^[0-9a-f]{64}$/);
});

test("changes when a content file changes", () => {
  assert.notEqual(contentHash(tree(base)), contentHash(tree({ ...base, "content/work.ts": "export const b = 3;\n" })));
});

test("changes when the resume template changes", () => {
  assert.notEqual(
    contentHash(tree(base)),
    contentHash(tree({ ...base, "components/resume/ResumeDocument.tsx": "export default 2;\n" })),
  );
});

test("ignores CRLF vs LF", () => {
  const crlf = Object.fromEntries(Object.entries(base).map(([k, v]) => [k, v.replace(/\n/g, "\r\n")]));
  assert.equal(contentHash(tree(base)), contentHash(tree(crlf)));
});

test("ignores test files and files outside the hashed folders", () => {
  const noisy = { ...base, "content/x.test.ts": "anything", "app/page.tsx": "anything", "content/_sources/a.json": "{}" };
  assert.equal(contentHash(tree(base)), contentHash(tree(noisy)));
});

test("changes when the resume page, its print CSS or the date formatter changes", () => {
  const withAll = {
    ...base,
    "app/resume/page.tsx": "page 1",
    "app/resume/resume.css": "css 1",
    "lib/format.ts": "format 1",
  };
  const h = contentHash(tree(withAll));
  for (const file of ["app/resume/page.tsx", "app/resume/resume.css", "lib/format.ts"]) {
    assert.notEqual(contentHash(tree({ ...withAll, [file]: "changed" })), h, file);
  }
});
