// Prebuild guard (`pnpm build` runs this before `next build`). Fails the build when the committed
// resume PDF was generated from different content, so the PDF and the site can never disagree.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { contentHash } from "../lib/content-hash.mjs";

export const PDF_FILE = "Ravindu-Perera-Resume.pdf";
export const PDF_META = "resume.pdf.json";

/** @returns {{ ok: true } | { ok: false, reason: string }} */
export function checkPdf(root) {
  const metaPath = join(root, "public", PDF_META);
  if (!existsSync(metaPath)) return { ok: false, reason: `public/${PDF_META} is missing; run pnpm pdf` };
  let meta;
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch {
    return { ok: false, reason: `public/${PDF_META} is not valid JSON; run pnpm pdf` };
  }
  if (meta.contentHash !== contentHash(root)) return { ok: false, reason: "content changed; run pnpm pdf" };
  if (!existsSync(join(root, "public", PDF_FILE))) return { ok: false, reason: `public/${PDF_FILE} is missing; run pnpm pdf` };
  return { ok: true };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkPdf(join(import.meta.dirname, ".."));
  if (!result.ok) {
    console.error(`Resume PDF check failed: ${result.reason}`);
    process.exit(1);
  }
  console.log("Resume PDF matches the content.");
}
