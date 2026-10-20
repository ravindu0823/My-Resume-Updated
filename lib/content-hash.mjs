// Fingerprint of every file the resume PDF is rendered from (SOURCES below). scripts/pdf.mjs stores
// it next to the PDF; scripts/check-pdf.mjs compares it at build time, so a deploy can never ship
// a PDF that disagrees with the site.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Everything that changes what the PDF says or how it lays out: the content, the resume template,
// the resume route and its print CSS, and the date formatter it prints periods with.
const SOURCES = [
  { dir: "content", match: (f) => f.endsWith(".ts") && !f.endsWith(".test.ts") },
  { dir: "components/resume", match: (f) => f.endsWith(".tsx") },
  { dir: "app/resume", match: (f) => f === "page.tsx" || f === "resume.css" },
  { dir: "lib", match: (f) => f === "format.ts" },
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
