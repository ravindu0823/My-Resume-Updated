import type { StackGroup } from "@/content/schema.ts";
import { Chip } from "@/components/ui/Chip.tsx";
import { Section } from "@/components/ui/Section.tsx";
import { slugify } from "@/lib/slug.ts";

export function Stack({ groups }: { groups: StackGroup[] }) {
  return (
    <Section id="stack" eyebrow="Stack" title="Tools I reach for">
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((g) => {
          const id = `stack-${slugify(g.title)}`;
          const withLogo = g.items.filter((i) => i.icon);
          const textOnly = g.items.filter((i) => !i.icon);
          return (
            <section key={g.title} aria-labelledby={id} className="min-w-0 rounded-2xl border border-line bg-surface/70 p-5">
              <header className="flex items-baseline justify-between gap-3">
                <h3 id={id} className="font-semibold">
                  {g.title}
                </h3>
                <p className="text-xs text-muted">{g.caption}</p>
              </header>
              <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {withLogo.map((item) => (
                  <li
                    key={item.name}
                    className="flex min-h-[4.5rem] min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-line/70 bg-tile/60 px-1 py-2 text-center"
                  >
                    {/* Decorative: the name is printed below. mono logos are re-tinted light on dark. */}
                    <img
                      src={`/icons/${item.icon}.svg`}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className={`size-7 ${item.mono ? "dark:brightness-0 dark:invert" : ""}`}
                    />
                    {/* overflow-wrap is the backstop for long names (OpenTelemetry) in a 77px tile at 320px. */}
                    <span className="max-w-full text-[11px] leading-tight [overflow-wrap:anywhere] text-ink/85">{item.name}</span>
                  </li>
                ))}
              </ul>
              {textOnly.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label={`More ${g.title.toLowerCase()}`}>
                  {textOnly.map((item) => (
                    <li key={item.name}>
                      <Chip>{item.name}</Chip>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </Section>
  );
}
