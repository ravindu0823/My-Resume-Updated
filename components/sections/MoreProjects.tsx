import type { Project, StackGroup } from "@/content/schema.ts";
import { Chip } from "@/components/ui/Chip.tsx";
import { MotifTile } from "@/components/ui/MotifTile.tsx";
import { ProjectCover } from "@/components/ui/ProjectCover.tsx";
import { Section } from "@/components/ui/Section.tsx";

const GROUPS: { group: Project["group"]; title: string }[] = [
  { group: "client", title: "Client & team work" },
  { group: "public", title: "Public repositories" },
  { group: "community", title: "Community" },
];

// Phones see this many rows per group; the rest sit behind "Show N more" (a <details>, so it works
// without JavaScript). Larger screens show every card.
const FIRST_ON_PHONE = 3;

/** Phone layout: a compact row. With a link, the whole row is the touch target (stretched link). */
function Row({ p }: { p: Project }) {
  return (
    <li className="relative rounded-2xl border border-line bg-surface/70 p-4">
      <div className="flex items-center gap-3">
        <MotifTile project={p} className="size-11" />
        <div className="min-w-0">
          <h4 className="leading-snug font-semibold">
            {p.href ? (
              <a href={p.href} className="after:absolute after:inset-0 after:rounded-2xl">
                {p.title}
              </a>
            ) : (
              p.title
            )}
          </h4>
          <p className="mt-0.5 font-mono text-[11px] leading-snug text-muted">{p.stack.join(" · ")}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink/85">{p.summary}</p>
      {p.href && (
        <p aria-hidden="true" className="mt-2 text-sm font-medium text-azure">
          View on GitHub →
        </p>
      )}
    </li>
  );
}

/** sm+ layout: a card with the generated cover. */
function Card({ p, stack }: { p: Project; stack: StackGroup[] }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/70">
      <div className="overflow-hidden border-b border-line">
        <ProjectCover project={p} stack={stack} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-semibold tracking-tight">{p.title}</h4>
        <p className="mt-2 text-sm text-ink/85">{p.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
          {p.stack.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>
        {p.href && (
          <a href={p.href} className="mt-auto inline-flex min-h-11 items-center pt-3 text-sm text-azure underline-offset-4 hover:underline">
            View on GitHub →
          </a>
        )}
      </div>
    </li>
  );
}

export function MoreProjects({ projects, stack }: { projects: Project[]; stack: StackGroup[] }) {
  return (
    <Section id="projects" eyebrow="Projects" title="More things I've built">
      <div className="space-y-12">
        {GROUPS.map(({ group, title }) => {
          const items = projects.filter((p) => p.group === group);
          if (!items.length) return null;
          const first = items.slice(0, FIRST_ON_PHONE);
          const rest = items.slice(FIRST_ON_PHONE);
          return (
            <div key={group}>
              <h3 className="font-mono text-xs tracking-[0.18em] text-cyan uppercase">
                {title} <span className="tracking-normal text-muted normal-case">· {items.length}</span>
              </h3>

              <div className="mt-5 sm:hidden">
                <ul className="space-y-3">
                  {first.map((p) => (
                    <Row key={p.slug} p={p} />
                  ))}
                </ul>
                {rest.length > 0 && (
                  <details className="group mt-3">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-sm font-medium text-azure [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">Show {rest.length} more</span>
                      <span className="hidden group-open:inline">Show fewer</span>
                    </summary>
                    <ul className="mt-3 space-y-3">
                      {rest.map((p) => (
                        <Row key={p.slug} p={p} />
                      ))}
                    </ul>
                  </details>
                )}
              </div>

              <ul aria-label={title} className="mt-5 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <Card key={p.slug} p={p} stack={stack} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
