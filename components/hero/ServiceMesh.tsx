// The hero motif from the GitHub README banner: a gateway publishes onto a service bus that fans
// out to identity, ledger and realtime services. Pure SVG; packets move with SMIL and are hidden
// under prefers-reduced-motion (the .packet rule in globals.css). Decoration only, so aria-hidden.

const NODES = [
  { id: "gateway", x: 100, y: 62, label: "api-gateway" },
  { id: "identity", x: 322, y: 62, label: "identity" },
  { id: "bus", x: 211, y: 150, label: "service-bus", hub: true },
  { id: "realtime", x: 100, y: 238, label: "realtime" },
  { id: "ledger", x: 322, y: 238, label: "ledger" },
] as const;

const EDGES: [from: string, to: string, delay: number][] = [
  ["gateway", "bus", 0],
  ["bus", "identity", 0.65],
  ["bus", "ledger", 1.3],
  ["bus", "realtime", 1.95],
];

const at = (id: string) => NODES.find((n) => n.id === id)!;
const width = (label: string) => label.length * 7.4 + 26;

export function ServiceMesh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 422 300" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="mesh-glow">
          <stop offset="0" stopColor="var(--violet)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--violet)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mesh-hub" x1="0" x2="1">
          <stop offset="0" stopColor="var(--violet)" />
          <stop offset="1" stopColor="var(--azure)" />
        </linearGradient>
      </defs>
      <circle cx="211" cy="150" r="96" fill="url(#mesh-glow)" className="mesh-pulse" />
      {EDGES.map(([from, to, delay]) => {
        const a = at(from);
        const b = at(to);
        const d = `M${a.x} ${a.y} L${b.x} ${b.y}`;
        return (
          <g key={`${from}-${to}`}>
            <path d={d} stroke="var(--muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 6" fill="none" className="mesh-flow" />
            <circle r="3.6" fill="var(--cyan)" className="packet" opacity="0">
              <animateMotion dur="2.6s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
              <animate attributeName="opacity" dur="2.6s" begin={`${delay}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.15;0.8;1" />
            </circle>
          </g>
        );
      })}
      {NODES.map((n) => {
        const w = width(n.label);
        const hub = "hub" in n && n.hub;
        return (
          <g key={n.id}>
            <rect
              x={n.x - w / 2}
              y={n.y - 16}
              width={w}
              height="32"
              rx="9"
              fill="var(--surface)"
              stroke={hub ? "url(#mesh-hub)" : "var(--border)"}
              strokeWidth={hub ? 1.8 : 1}
            />
            <text
              x={n.x}
              y={n.y + 4.5}
              textAnchor="middle"
              fontSize="13"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fill={hub ? "var(--text)" : "var(--muted)"}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
