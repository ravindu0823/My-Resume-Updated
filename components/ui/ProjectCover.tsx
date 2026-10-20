import type { Motif, Project, StackGroup } from "@/content/schema.ts";
import { stackIcons } from "@/lib/icons.ts";

// A generated cover for every project card, in the site's brand system: one size, theme-aware
// (all colours are CSS variables), no image request. The domain glyph says what the project is
// for; the logos say what it is built with. Decorative, so hidden from assistive technology: the
// card's heading and text carry the meaning.

// 24x24 line glyphs, drawn for this site.
const GLYPHS: Record<Motif, string> = {
  wallet: "M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5zM16 13.5h.01",
  card: "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM3 10h18M7 15h4",
  market: "M4 9.5 5.5 5h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12.5V19h13v-6.5M10 19v-3.5h4V19",
  game: "M7 9h3M8.5 7.5v3M15 9h.01M17 11h.01M6.5 5h11A4.5 4.5 0 0 1 22 9.5v3a3.5 3.5 0 0 1-6.3 2.1L14.5 13h-5l-1.2 1.6A3.5 3.5 0 0 1 2 12.5v-3A4.5 4.5 0 0 1 6.5 5z",
  heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  bolt: "M13 3 5 13.5h6L10 21l8-10.5h-6z",
  boxes: "M4 8.5 12 4l8 4.5v7L12 20l-8-4.5zM4 8.5l8 4.5 8-4.5M12 13v7M8 6.2l8 4.5",
  medical: "M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z",
  dining: "M6 3v7a2 2 0 0 0 4 0V3M8 10v11M17 21V3c-2 0-3.5 2.5-3.5 6S15 13 17 13",
  leaf: "M5 19C5 10 11 5 20 4c-.5 9-5 15-14 15zM5 19l7-7",
  bed: "M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7.5 11.5a1.5 1.5 0 1 0 0-.01",
  briefcase: "M4 8h16v11H4zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16M11 13v2h2v-2",
  recycle: "M7 19H4.5l3.5-6M17 19h2.5L16 13M12 4l2.5 4.5M12 4 9.5 8.5M9 19h6M7.5 9.5 6 12M16.5 9.5 18 12",
  book: "M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
  code: "M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
};

const GROUP = {
  client: { label: "client work", a: "var(--violet)", b: "var(--azure)" },
  public: { label: "open source", a: "var(--azure)", b: "var(--cyan)" },
  community: { label: "community", a: "var(--cyan)", b: "var(--violet)" },
} as const;

export function ProjectCover({ project, stack }: { project: Project; stack: StackGroup[] }) {
  const g = GROUP[project.group];
  const logos = stackIcons(stack, project.stack);
  const id = `cover-${project.slug}`;
  const label = g.label;

  return (
    <svg viewBox="0 0 480 270" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-glow-a`} cx="0.82" cy="0.18" r="0.7">
          <stop offset="0" stopColor={g.a} stopOpacity="0.38" />
          <stop offset="1" stopColor={g.a} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-glow-b`} cx="0.08" cy="1" r="0.6">
          <stop offset="0" stopColor={g.b} stopOpacity="0.28" />
          <stop offset="1" stopColor={g.b} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={g.a} />
          <stop offset="1" stopColor={g.b} />
        </linearGradient>
        <pattern id={`${id}-dots`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="var(--grid)" />
        </pattern>
      </defs>
      <rect width="480" height="270" fill="var(--tile)" />
      <rect width="480" height="270" fill={`url(#${id}-dots)`} opacity="0.55" />
      <rect width="480" height="270" fill={`url(#${id}-glow-a)`} />
      <rect width="480" height="270" fill={`url(#${id}-glow-b)`} />

      {/* Domain glyph, large and to the right, with a soft ring behind it. */}
      <circle cx="356" cy="128" r="78" fill="var(--surface)" opacity="0.55" />
      <circle cx="356" cy="128" r="78" fill="none" stroke={`url(#${id}-ink)`} strokeOpacity="0.5" strokeDasharray="3 7" />
      <g transform="translate(296 68) scale(5)">
        <path
          d={GLYPHS[project.motif]}
          fill="none"
          stroke={`url(#${id}-ink)`}
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 3.2 }}
        />
      </g>

      {/* Group label. */}
      <rect x="22" y="22" width={label.length * 10.6 + 40} height="38" rx="19" fill="var(--surface)" stroke="var(--border)" />
      <circle cx="42" cy="41" r="5.5" fill={g.a} />
      <text x="56" y="47" fontSize="17" fill="var(--text)" fillOpacity="0.8" fontFamily="var(--font-geist-mono), ui-monospace, monospace">
        {label}
      </text>

      {/* Stack logos, joined to the glyph like services on a bus. */}
      {logos.length > 0 && (
        <path
          d={`M${54 + (logos.length - 1) * 78} 210 C 225 210, 245 170, 282 150`}
          fill="none"
          stroke="var(--muted)"
          strokeOpacity="0.45"
          strokeDasharray="4 6"
        />
      )}
      {logos.map((logo, i) => (
        <g key={logo.icon} transform={`translate(${22 + i * 78} 178)`}>
          <rect width="64" height="64" rx="16" fill="var(--surface)" stroke="var(--border)" />
          <image
            href={`/icons/${logo.icon}.svg`}
            x="13"
            y="13"
            width="38"
            height="38"
            className={logo.mono ? "dark:brightness-0 dark:invert" : undefined}
          />
        </g>
      ))}
    </svg>
  );
}
