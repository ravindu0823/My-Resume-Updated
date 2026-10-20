// Minimal static server for the exported site (out/), used by pdf.mjs, og.mjs and verify.mjs.
//   node scripts/serve.mjs [port]      serve out/ until Ctrl+C
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
};

/** Serves `dir` like a static host: /resume → resume.html, unknown paths → 404.html. */
export function serveStatic(dir, port = 0) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const safe = normalize(path).replace(/^[\\/]+/, "");
    if (safe.startsWith("..")) {
      res.writeHead(400).end();
      return;
    }
    const candidates = [safe, `${safe}.html`, join(safe, "index.html")];
    for (const c of candidates) {
      const file = join(dir, c);
      try {
        if ((await stat(file)).isFile()) {
          res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
          res.end(await readFile(file));
          return;
        }
      } catch {
        // try the next candidate
      }
    }
    res.writeHead(404, { "content-type": TYPES[".html"] });
    res.end(await readFile(join(dir, "404.html")).catch(() => "not found"));
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { url } = await serveStatic(join(import.meta.dirname, "..", "out"), Number(process.argv[2] ?? 4173));
  console.log(`serving out/ at ${url}`);
}
