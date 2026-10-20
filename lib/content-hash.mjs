// Fingerprint of everything the resume PDF is rendered from: the content modules and the resume
// template. scripts/pdf.mjs stores it next to the PDF; scripts/check-pdf.mjs compares it at build
// time, so a deploy can never ship a PDF that disagrees with the site.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SOURCES = [
  { dir: "content", match: (f) => f.endsWith(".ts") && !f.endsWith(".test.ts") },
  { dir: "components/resume", match: (f) => f.endsWith(".tsx") },
];

/** Hex SHA-256 over `path\0text\0` for each source file, sorted, with CRLF normalized to LF. */
export function contentHash(root) {
  const files = SOURCES.flatMap(({ dir, match }) => {
    const abs = join(root, dir);
    if (!existsSync(abs)) return [];
    return readdirSync(abs, { withFileTypes: true })
      .filter((e) => e.isFile() && match(e.name))
      .map((e) => `${dir}/${e.name}`);
  }).sort();

  const hash = createHash("sha256");
  for (const rel of files) {
    const text = readFileSync(join(root, rel), "utf8").replace(/\r\n/g, "\n");
    hash.update(`${rel}\0${text}\0`);
  }
  return hash.digest("hex");
}
