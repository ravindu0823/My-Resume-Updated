import type { OpenSource as Item } from "@/content/schema.ts";
import { Section } from "@/components/ui/Section.tsx";

export function OpenSource({ items }: { items: Item[] }) {
  return (
    <Section id="open-source" eyebrow="Open source" title="Contributions upstream">
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((o) => (
          <li key={o.name} className="rounded-2xl border border-line bg-surface/70 p-5">
            <a href={o.href} className="inline-flex min-h-11 items-center text-lg font-semibold underline-offset-4 hover:underline">
              {o.name}
            </a>
            <p className="mt-1 text-sm text-ink/85">{o.summary}</p>
            {o.proof && (
              <a
                href={o.proof.href}
                className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-line px-3 font-mono text-xs text-cyan hover:border-cyan"
              >
                {o.proof.label} →
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
