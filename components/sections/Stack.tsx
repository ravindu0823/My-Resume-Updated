import type { StackGroup } from "@/content/schema.ts";
import { Section } from "@/components/ui/Section.tsx";

export function Stack({ groups }: { groups: StackGroup[] }) {
  return (
    <Section id="stack" eyebrow="Stack" title="Tools I reach for">
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g.title} aria-labelledby={`stack-${g.title}`} className="rounded-2xl border border-line bg-surface/70 p-5">
            <header className="flex items-baseline justify-between gap-3">
              <h3 id={`stack-${g.title}`} className="font-semibold">
                {g.title}
              </h3>
              <p className="text-xs text-muted">{g.caption}</p>
            </header>
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {g.items.map((item) => (
                <li
                  key={item.name}
                  className="flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-line/70 bg-tile/60 px-1 py-2 text-center"
                >
                  {item.icon ? (
                    // Decorative: the name is printed below. mono logos are re-tinted light on dark.
                    <img
                      src={`/icons/${item.icon}.svg`}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className={`size-7 ${item.mono ? "dark:brightness-0 dark:invert" : ""}`}
                    />
                  ) : (
                    <span aria-hidden="true" className="font-mono text-base font-semibold text-azure">
                      {item.name.slice(0, 2)}
                    </span>
                  )}
                  <span className="text-xs leading-tight break-words text-ink/85">{item.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
