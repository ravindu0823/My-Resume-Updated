import type { ReactNode } from "react";

/** A page section: anchor target, eyebrow, h2 and body. scroll-mt clears the 56px top bar. */
export function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <p className="font-mono text-xs tracking-[0.18em] text-cyan uppercase">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
