import type { Diagram, DiagramNode } from "@/content/schema.ts";
import { EDGE_LABEL_CHAR, layoutDiagram } from "@/lib/diagram.ts";

const KIND: Record<DiagramNode["kind"], { stroke: string; dash?: string; label: string }> = {
  client: { stroke: "var(--muted)", label: "client" },
  service: { stroke: "var(--azure)", label: "service" },
  store: { stroke: "var(--violet)", label: "data store" },
  queue: { stroke: "var(--cyan)", label: "queue / bus" },
  external: { stroke: "var(--muted)", dash: "4 4", label: "external" },
};

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const fit = (line: string, box: number) => Math.min(13, (box - 14) / (line.length * 0.6));

/** One line when it fits at 11px or more; otherwise split on " · " into two lines. */
function labelLines(label: string, box: number): { lines: string[]; size: number } {
  const one = fit(label, box);
  const parts = label.split(" · ");
  if (one >= 11 || parts.length < 2) return { lines: [label], size: one };
  return { lines: parts, size: Math.min(...parts.map((p) => fit(p, box))) };
}

/**
 * The project's architecture, drawn from its diagram spec. Below `md` it is a readable flow list:
 * an 800-unit SVG scaled into a phone-width card would set labels around 6px.
 */
export function ArchitectureDiagram({ diagram, slug, title }: { diagram: Diagram; slug: string; title: string }) {
  const layout = layoutDiagram(diagram);
  const label = (id: string) => diagram.nodes.find((n) => n.id === id)!.label;
  const arrow = `arrow-${slug}`;
  const arrowAsync = `arrow-async-${slug}`;

  return (
    <figure className="mt-5">
      <ol className="space-y-2 md:hidden" aria-label={`${title} architecture`}>
        {diagram.edges.map((e) => (
          <li key={`${e.from}-${e.to}`} className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line/70 bg-tile/50 px-3 py-2 text-sm">
            <span>{label(e.from)}</span>
            <span aria-hidden="true" className={e.async ? "text-cyan" : "text-muted"}>
              {e.async ? "⇢" : "→"}
            </span>
            <span className="sr-only">{e.async ? "asynchronously to" : "to"}</span>
            <span>{label(e.to)}</span>
            {e.label && <span className="font-mono text-xs text-muted">({e.label})</span>}
          </li>
        ))}
      </ol>

      <svg
        viewBox={`-8 -8 ${layout.width + 16} ${layout.height + 16}`}
        className="mx-auto hidden h-auto w-full md:block"
        style={{ maxWidth: layout.width + 16 }}
        role="img"
        aria-label={`${title} architecture: ${diagram.nodes.map((n) => n.label).join(", ")}`}
      >
        <defs>
          <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
          </marker>
          <marker id={arrowAsync} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--cyan)" />
          </marker>
        </defs>
        {layout.edges.map((e) => (
          <g key={`${e.from}-${e.to}`}>
            <path
              d={e.path}
              fill="none"
              stroke={e.async ? "var(--cyan)" : "var(--muted)"}
              strokeOpacity={e.async ? 0.9 : 0.55}
              strokeWidth="1.5"
              strokeDasharray={e.async ? "5 5" : undefined}
              className={e.async ? "mesh-flow" : undefined}
              markerEnd={`url(#${e.async ? arrowAsync : arrow})`}
            />
            {e.async && (
              <circle r="3.2" fill="var(--cyan)" className="packet" opacity="0">
                <animateMotion dur="2.4s" repeatCount="indefinite" path={e.path} />
                <animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.15;0.8;1" />
              </circle>
            )}
            {e.label && (
              <g>
                <rect
                  x={e.mid.x - (e.label.length * EDGE_LABEL_CHAR + 12) / 2}
                  y={e.mid.y - 10}
                  width={e.label.length * EDGE_LABEL_CHAR + 12}
                  height="20"
                  rx="6"
                  fill="var(--bg)"
                  stroke="var(--border)"
                />
                <text x={e.mid.x} y={e.mid.y + 4} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily={MONO}>
                  {e.label}
                </text>
              </g>
            )}
          </g>
        ))}
        {layout.nodes.map((n) => {
          const k = KIND[n.kind];
          const { lines, size } = labelLines(n.label, n.w);
          const top = n.y + n.h / 2 - ((lines.length - 1) * (size + 2)) / 2 + size * 0.36;
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill="var(--surface)" stroke={k.stroke} strokeWidth="1.4" strokeDasharray={k.dash} />
              <text textAnchor="middle" fontSize={size} fill="var(--text)" fontFamily={MONO}>
                {lines.map((line, i) => (
                  <tspan key={line} x={n.x + n.w / 2} y={top + i * (size + 2)}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 hidden flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted md:flex">
        {(["service", "store", "queue", "external"] as const)
          .filter((kind) => diagram.nodes.some((n) => n.kind === kind))
          .map((kind) => (
            <span key={kind} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block size-2.5 rounded-sm border-[1.5px]" style={{ borderColor: KIND[kind].stroke }} />
              {KIND[kind].label}
            </span>
          ))}
        {diagram.edges.some((e) => e.async) && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-0 w-4 border-t-[1.5px] border-dashed border-cyan" />
            async
          </span>
        )}
      </figcaption>
    </figure>
  );
}
