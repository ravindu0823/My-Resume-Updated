import type { Project, StackGroup } from "@/content/schema.ts";
import { Chip } from "@/components/ui/Chip.tsx";
import { ProjectCover } from "@/components/ui/ProjectCover.tsx";
import { Section } from "@/components/ui/Section.tsx";

const GROUPS: { group: Project["group"]; title: string }[] = [
  { group: "client", title: "Client & team work" },
  { group: "public", title: "Public repositories" },
  { group: "community", title: "Community" },
];

function Card({ p, stack }: { p: Project; stack: StackGroup[] }) {
  return (
    <li className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 sm:w-auto">
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
          return (
            <div key={group}>
              <h3 className="flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-cyan uppercase">
                {title}
                <span className="text-muted normal-case tracking-normal sm:hidden">{items.length} · swipe</span>
              </h3>
              {/* Phones swipe through a group (the page itself never scrolls sideways); sm+ is a grid. */}
              <ul
                aria-label={title}
                className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
              >
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
