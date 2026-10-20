// Renders the 1200x630 social card to app/opengraph-image.png (Next serves it as og:image and
// twitter:image). Same brand as the hero and the GitHub README banner. Run after changing the name
// or role:   node scripts/og.mjs
import { join } from "node:path";
import { screenshot } from "./cdp.mjs";

const NODES = [
  ["api-gateway", 140, 120],
  ["identity", 420, 120],
  ["service-bus", 280, 250, true],
  ["realtime", 140, 380],
  ["ledger", 420, 380],
];
const EDGES = [
  [0, 2],
  [2, 1],
  [2, 4],
  [2, 3],
];

const mesh = `<svg viewBox="0 0 560 500" width="560" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="hub" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#38bdf8"/></linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#a78bfa" stop-opacity=".4"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></radialGradient></defs>
  <circle cx="280" cy="250" r="170" fill="url(#glow)"/>
  ${EDGES.map(([a, b]) => `<line x1="${NODES[a][1]}" y1="${NODES[a][2]}" x2="${NODES[b][1]}" y2="${NODES[b][2]}" stroke="#8b98b8" stroke-opacity=".55" stroke-width="2" stroke-dasharray="6 8"/>
  <circle cx="${(NODES[a][1] + NODES[b][1]) / 2}" cy="${(NODES[a][2] + NODES[b][2]) / 2}" r="6" fill="#22d3ee"/>`).join("")}
  ${NODES.map(([label, x, y, hub]) => {
    const w = label.length * 13 + 40;
    return `<rect x="${x - w / 2}" y="${y - 26}" width="${w}" height="52" rx="14" fill="#0f1629" stroke="${hub ? "url(#hub)" : "#25314f"}" stroke-width="${hub ? 3 : 2}"/>
    <text x="${x}" y="${y + 8}" text-anchor="middle" font-family="Cascadia Code, Consolas, monospace" font-size="22" fill="${hub ? "#e6edf3" : "#8b98b8"}">${label}</text>`;
  }).join("")}
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;width:1200px;height:630px;overflow:hidden}
  body{background:radial-gradient(circle at 1px 1px,#2a365799 1px,transparent 0) 0 0/24px 24px,linear-gradient(135deg,#0d1117,#111a33);
    color:#e6edf3;font-family:"Segoe UI",system-ui,sans-serif;display:flex;align-items:center;justify-content:space-between;padding:0 56px 0 72px;box-sizing:border-box}
  .k{font:28px "Cascadia Code",Consolas,monospace;color:#22d3ee}
  h1{margin:22px 0 0;font-size:84px;line-height:1.02;font-weight:800;letter-spacing:-2px}
  h1 span{background:linear-gradient(90deg,#a78bfa,#38bdf8,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent}
  .r{margin-top:26px;font-size:32px;color:#c9d3e6}
  .u{margin-top:38px;font:24px "Cascadia Code",Consolas,monospace;color:#8b98b8}
</style></head><body>
  <div><div class="k">$ dotnet run --project ravindu</div>
  <h1>Ravindu Dhanushka<br><span>Perera</span></h1>
  <div class="r">Software Engineer · .NET &amp; Azure</div>
  <div class="u">ravinduperera.vercel.app</div></div>
  ${mesh}
</body></html>`;

const out = join(import.meta.dirname, "..", "app", "opengraph-image.png");
await screenshot(`data:text/html;base64,${Buffer.from(html).toString("base64")}`, out, { width: 1200, height: 630 });
console.log(`wrote ${out}`);
