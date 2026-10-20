"use client";

import { useRef } from "react";
import { RESUME_PDF, SECTION_LINKS } from "./nav.ts";

// A <details> disclosure so the menu opens even without JavaScript. With JS, choosing a link or
// pressing Escape closes it.
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");

  return (
    <details ref={ref} className="group relative md:hidden" onKeyDown={(e) => e.key === "Escape" && close()}>
      <summary
        aria-label="Menu"
        className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-ink hover:bg-tile [&::-webkit-details-marker]:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-6 group-open:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 24 24" className="hidden size-6 group-open:block" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </summary>
      <nav
        aria-label="Sections"
        className="absolute top-[calc(100%+0.5rem)] right-0 w-64 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/30"
      >
        <ul>
          {SECTION_LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={close} className="flex min-h-12 items-center rounded-xl px-3 text-base hover:bg-tile">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={RESUME_PDF}
          onClick={close}
          className="mt-1 flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-cta-from to-cta-to font-medium text-white"
        >
          Download CV (PDF)
        </a>
      </nav>
    </details>
  );
}
