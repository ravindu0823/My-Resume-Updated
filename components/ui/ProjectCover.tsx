import type { Project, StackGroup } from "@/content/schema.ts";
import { GLYPHS, GROUP_STYLE } from "@/lib/glyphs.ts";
import { stackIcons } from "@/lib/icons.ts";

// A generated cover for every project card, in the site's brand system: one size, theme-aware
// (all colours are CSS variables), no image request. The domain glyph says what the project is
// for; the logos say what it is built with. Decorative, so hidden from assistive technology: the
// card's heading and text carry the meaning.


export function ProjectCover({ project, stack }: { project: Project; stack: StackGroup[] }) {
  const g = GROUP_STYLE[project.group];
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
