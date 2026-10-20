// Measures the built site in a real browser instead of trusting the code (mobile-first rule):
// widths 320/390/1280 x dark/light, plus a reduced-motion pass and a static-HTML pass.
//   pnpm build && node scripts/verify.mjs [baseUrl]
// Without baseUrl it serves out/. Prints a JSON report; exits 1 if any check fails.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { withPage } from "./cdp.mjs";
import { serveStatic } from "./serve.mjs";

const root = join(import.meta.dirname, "..");
const SECTIONS = ["top", "about", "work", "experience", "stack", "projects", "open-source", "activity", "contact"];
const TOP_BAR_MAX = 56;
// Requests that only exist on Vercel (analytics, speed insights) 404 on a local server.
const IGNORED_ERRORS = [/\/_vercel\//];

// Runs inside the page. Returns layout facts; every list should be empty.
const MEASURE = `(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 400));
  const vw = document.documentElement.clientWidth;
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[aria-hidden=true]"); };
  const inScroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll") return true; } return false; };
  const name = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : "") + " \\"" + (el.textContent || "").trim().slice(0, 40) + "\\"";
  const all = [...document.querySelectorAll("body *")].filter((el) => el instanceof HTMLElement && visible(el));
  const clipped = all.filter((el) => { const cs = getComputedStyle(el); return cs.overflowX !== "visible" && cs.overflowX !== "auto" && cs.overflowX !== "scroll" && el.scrollWidth > el.clientWidth + 1 && !["PRE", "CODE"].includes(el.tagName); });
  const beyond = all.filter((el) => !inScroller(el) && el.getBoundingClientRect().right > vw + 1);
  const targets = [...document.querySelectorAll("a, button, summary, [role=button]")].filter((el) => visible(el) && getComputedStyle(el).display !== "inline" && !inScroller(el))
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; });
  const h1 = document.querySelector("h1");
  return {
    docScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    topBarHeight: Math.round(document.querySelector("header")?.getBoundingClientRect().height ?? 0),
    firstContentTop: Math.round(h1 ? h1.getBoundingClientRect().top + scrollY : -1),
    clipped: clipped.map(name).slice(0, 10),
    beyondViewport: beyond.map(name).slice(0, 10),
    smallTargets: targets.map(name).slice(0, 10),
    missingSections: ${JSON.stringify(SECTIONS)}.filter((id) => !document.getElementById(id)),
    brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && visible(i)).map((i) => i.src),
  };
})()`;

const REDUCED = `(() => [...document.querySelectorAll(".packet")].filter((el) => getComputedStyle(el).display !== "none").length
  + [...document.querySelectorAll(".mesh-flow, .kicker")].filter((el) => getComputedStyle(el).animationName !== "none").length)()`;

async function inspect(url, { width, scheme, reducedMotion = false }) {
  return withPage(async ({ send, goto, on }) => {
    const errors = [];
    await send("Runtime.enable");
    await send("Log.enable");
    on("Runtime.exceptionThrown", (p) => errors.push(p.exceptionDetails.exception?.description ?? p.exceptionDetails.text));
    on("Runtime.consoleAPICalled", (p) => p.type === "error" && errors.push(p.args.map((a) => a.value ?? a.description).join(" ")));
    on("Log.entryAdded", (p) => p.entry.level === "error" && errors.push(`${p.entry.text} ${p.entry.url ?? ""}`));
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-color-scheme", value: scheme },
        { name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" },
      ],
    });
    // Pin the theme the way a returning visitor would have it stored.
    await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem("theme","${scheme}")}catch(e){}` });
    await goto(url);
    const expr = reducedMotion ? REDUCED : MEASURE;
    const { result } = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
    return { value: result.value, consoleErrors: errors.filter((e) => !IGNORED_ERRORS.some((re) => re.test(e))) };
  });
}

const arg = process.argv[2];
const served = arg ? null : await serveStatic(join(root, "out"));
const base = arg ?? served.url;
const report = { base, runs: [], failures: [] };

try {
  for (const path of ["/", "/resume"]) {
    for (const width of [320, 390, 1280]) {
      for (const scheme of ["dark", "light"]) {
        if (path === "/resume" && scheme === "light") continue; // the resume page has fixed colours
        const { value: m, consoleErrors } = await inspect(`${base}${path}`, { width, scheme });
        const run = { path, width, scheme, ...m, consoleErrors };
        report.runs.push(run);
        const fail = (what) => report.failures.push(`${path} ${width}px ${scheme}: ${what}`);
        if (m.docScroll) fail("page scrolls horizontally");
        if (m.clipped.length) fail(`clipped text: ${m.clipped.join("; ")}`);
        if (m.beyondViewport.length) fail(`beyond viewport: ${m.beyondViewport.join("; ")}`);
        if (m.smallTargets.length) fail(`touch targets under 44px: ${m.smallTargets.join("; ")}`);
        if (m.brokenImages.length) fail(`broken images: ${m.brokenImages.join(", ")}`);
        if (consoleErrors.length) fail(`console errors: ${consoleErrors.join(" | ")}`);
        if (path === "/") {
          if (m.topBarHeight > TOP_BAR_MAX) fail(`top bar ${m.topBarHeight}px > ${TOP_BAR_MAX}px`);
          if (m.missingSections.length) fail(`missing sections: ${m.missingSections.join(", ")}`);
          if (width < 600 && m.firstContentTop > 200) fail(`hero starts at ${m.firstContentTop}px`);
        }
      }
    }
  }

  const { value: animating } = await inspect(`${base}/`, { width: 390, scheme: "dark", reducedMotion: true });
  report.reducedMotionAnimating = animating;
  if (animating !== 0) report.failures.push(`reduced motion: ${animating} elements still animate`);

  // Review Focus 1: everything must be present in the static HTML, before any JavaScript runs.
  if (!arg) {
    const html = await readFile(join(root, "out", "index.html"), "utf8");
    const missing = SECTIONS.filter((id) => !html.includes(`id="${id}"`));
    if (missing.length) report.failures.push(`static HTML lacks sections: ${missing.join(", ")}`);
    if (!html.includes('href="/Ravindu-Perera-Resume.pdf"')) report.failures.push("static HTML lacks the CV link");
    if (!html.includes("Ravindu Dhanushka")) report.failures.push("static HTML lacks the hero name");
  }
} finally {
  served?.server.close();
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.failures.length ? 1 : 0);
