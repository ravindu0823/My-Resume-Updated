// Drives a headless Chromium-family browser over the DevTools protocol with Node built-ins only.
// Used to print the resume PDF and to render the social card. BROWSER overrides detection.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

export function findBrowser() {
  if (process.env.BROWSER) return process.env.BROWSER;
  const found = CANDIDATES.find((p) => existsSync(p));
  if (found) return found;
  for (const name of ["google-chrome", "chromium", "chromium-browser", "msedge"]) {
    const r = spawnSync(process.platform === "win32" ? "where" : "which", [name], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim().split(/\r?\n/)[0];
  }
  throw new Error("No Chromium-family browser found; set BROWSER to its executable path");
}

/** Opens one headless page and hands `fn` the protocol helpers: send, goto, on(method, listener). */
export async function withPage(fn) {
  const profile = mkdtempSync(join(tmpdir(), "cdp-"));
  // Port 0: the browser picks a free port and prints the endpoint, so parallel runs never collide.
  const proc = spawn(
    findBrowser(),
    ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "about:blank"],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  try {
    const wsBrowser = await new Promise((resolve, reject) => {
      let err = "";
      const timer = setTimeout(() => reject(new Error(`browser did not start: ${err.slice(-400)}`)), 20000);
      proc.stderr.on("data", (d) => {
        err += d;
        const m = /DevTools listening on (ws:\/\/\S+)/.exec(err);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      proc.on("exit", (code) => reject(new Error(`browser exited with ${code}: ${err.slice(-400)}`)));
    });
    const httpBase = wsBrowser.replace(/^ws:/, "http:").replace(/\/devtools\/browser\/.*$/, "");
    const page = (await (await fetch(`${httpBase}/json`)).json()).find((t) => t.type === "page");
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    let id = 0;
    const pending = new Map();
    const listeners = new Set();
    ws.addEventListener("message", (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) {
        const { resolve, reject } = pending.get(m.id);
        pending.delete(m.id);
        if (m.error) reject(new Error(`${m.error.message} (${m.error.code})`));
        else resolve(m.result);
      } else if (m.method) {
        for (const l of listeners) l(m);
      }
    });
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const i = ++id;
        pending.set(i, { resolve, reject });
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    const once = (method) =>
      new Promise((resolve) => {
        const l = (m) => {
          if (m.method === method) {
            listeners.delete(l);
            resolve(m.params);
          }
        };
        listeners.add(l);
      });
    const goto = async (url) => {
      await send("Page.enable");
      const loaded = once("Page.loadEventFired");
      await send("Page.navigate", { url });
      await loaded;
      await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
    };
    const on = (method, listener) => listeners.add((m) => m.method === method && listener(m.params));
    const result = await fn({ send, goto, on });
    ws.close();
    return result;
  } finally {
    proc.kill();
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch {
      // The browser may still hold the profile on Windows for a moment; it is a temp dir.
    }
  }
}

/** Counts pages from the page-tree /Count, falling back to /Type /Page objects. */
export function countPdfPages(buf) {
  const text = buf.toString("latin1");
  const counts = [...text.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  if (counts.length) return Math.max(...counts);
  return (text.match(/\/Type\s*\/Page(?!s)\b/g) ?? []).length;
}

export async function printPdf(url, out) {
  return withPage(async ({ send, goto }) => {
    await goto(url);
    const { data } = await send("Page.printToPDF", { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
    const buf = Buffer.from(data, "base64");
    await writeFile(out, buf);
    return { pages: countPdfPages(buf), bytes: buf.length };
  });
}

export async function screenshot(url, out, { width, height }) {
  return withPage(async ({ send, goto }) => {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    await goto(url);
    const { data } = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width, height, scale: 1 } });
    await writeFile(out, Buffer.from(data, "base64"));
  });
}
