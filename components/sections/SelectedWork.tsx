import type { Featured } from "@/content/schema.ts";
import { Chip } from "@/components/ui/Chip.tsx";
import { Section } from "@/components/ui/Section.tsx";
import { ArchitectureDiagram } from "./ArchitectureDiagram.tsx";

export function SelectedWork({ items }: { items: Featured[] }) {
  return (
    <Section id="work" eyebrow="Selected work" title="Systems I've built and shipped">
      <p className="-mt-4 mb-8 max-w-prose text-muted">
        Most of this is client work in private repositories, so each project shows its architecture instead of a screenshot.
      </p>
      <div className="grid gap-5">
        {items.map((f) => (
          <article key={f.slug} aria-labelledby={`work-${f.slug}`} className="rounded-2xl border border-line bg-surface/70 p-5 sm:p-7">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h3 id={`work-${f.slug}`} className="text-lg font-semibold tracking-tight sm:text-xl">
                {f.title}
              </h3>
              <p className="font-mono text-xs text-cyan">{f.role}</p>
            </header>
            <p className="mt-3 max-w-prose text-ink/85">{f.summary}</p>
            <ArchitectureDiagram diagram={f.diagram} slug={f.slug} title={f.title} />
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Stack">
              {f.stack.map((s) => (
                <li key={s}>
                  <Chip>{s}</Chip>
                </li>
              ))}
            </ul>
            <details className="group mt-4">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium text-azure [&::-webkit-details-marker]:hidden">
                <span className="transition-transform group-open:rotate-90" aria-hidden="true">
                  ▸
                </span>
                Highlights
              </summary>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink/85 marker:text-violet">
                {f.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </details>
            {f.repo && (
              <a href={f.repo} className="mt-2 inline-flex min-h-11 items-center text-sm text-azure underline-offset-4 hover:underline">
                Source on GitHub →
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
