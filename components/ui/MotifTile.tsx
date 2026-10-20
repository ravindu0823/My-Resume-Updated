import type { Project } from "@/content/schema.ts";
import { GLYPHS, GROUP_STYLE } from "@/lib/glyphs.ts";

/** The project's domain glyph in a small gradient tile: the phone-sized stand-in for its cover. */
export function MotifTile({ project, className = "size-14" }: { project: Project; className?: string }) {
  const g = GROUP_STYLE[project.group];
  const id = `tile-${project.slug}`;
  return (
    <svg viewBox="0 0 56 56" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={g.a} />
          <stop offset="1" stopColor={g.b} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.8" cy="0.15" r="0.9">
          <stop offset="0" stopColor={g.a} stopOpacity="0.35" />
          <stop offset="1" stopColor={g.a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0.75" y="0.75" width="54.5" height="54.5" rx="15" fill="var(--tile)" stroke={`url(#${id}-ink)`} strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="0.75" y="0.75" width="54.5" height="54.5" rx="15" fill={`url(#${id}-glow)`} />
      <g transform="translate(9 9) scale(1.5833)">
        <path d={GLYPHS[project.motif]} fill="none" stroke={`url(#${id}-ink)`} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
