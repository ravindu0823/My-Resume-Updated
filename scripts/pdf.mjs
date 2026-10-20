// Regenerates the resume PDF from the current content:
//   1. next build (static export to out/), skipping the stale-PDF guard this script satisfies
//   2. serve out/ locally, print /resume with headless Chromium
//   3. write public/Ravindu-Perera-Resume.pdf + public/resume.pdf.json (content hash)
// Run after any edit under content/ or components/resume/, then commit both files.
import { spawnSync } from "node:child_process";
import { copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { contentHash } from "../lib/content-hash.mjs";
import { printPdf } from "./cdp.mjs";
import { PDF_FILE, PDF_META } from "./check-pdf.mjs";
import { serveStatic } from "./serve.mjs";

const MAX_PAGES = 2;
const root = join(import.meta.dirname, "..");

// Run Next through node itself: no shell, so nothing is concatenated into a command line.
const build = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build"], { cwd: root, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const { server, url } = await serveStatic(join(root, "out"));
try {
  const tmp = join(root, "out", `${PDF_FILE}.tmp`);
  const { pages, bytes } = await printPdf(`${url}/resume`, tmp);
  if (pages > MAX_PAGES) {
    console.error(`Resume is ${pages} pages; the limit is ${MAX_PAGES}. Tighten the content or the print styles.`);
    process.exit(1);
  }
  await copyFile(tmp, join(root, "public", PDF_FILE));
  const meta = { contentHash: contentHash(root), generatedAt: new Date().toISOString(), pages };
  await writeFile(join(root, "public", PDF_META), JSON.stringify(meta, null, 2) + "\n");
  console.log(`wrote public/${PDF_FILE} (${pages} pages, ${bytes} bytes) and public/${PDF_META}`);
} finally {
  server.close();
}
