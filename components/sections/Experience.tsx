import type { ReactNode } from "react";
import type { Education, Job, Volunteering } from "@/content/schema.ts";
import { formatPeriod } from "@/lib/format.ts";
import { Chip } from "@/components/ui/Chip.tsx";
import { Section } from "@/components/ui/Section.tsx";

function Timeline({ children }: { children: ReactNode }) {
  return <ol className="relative space-y-8 border-l border-line pl-6">{children}</ol>;
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="absolute -left-[7px] mt-1.5 size-3 rounded-full bg-gradient-to-br from-violet to-azure ring-4 ring-bg"
    />
  );
}

export function Experience({ jobs, education, volunteering }: { jobs: Job[]; education: Education[]; volunteering: Volunteering[] }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <Timeline>
        {jobs.map((job) => (
          <li key={job.company} className="relative">
            <Dot />
            <h3 className="text-lg font-semibold">{job.company}</h3>
            {(job.location || job.note) && (
              <p className="mt-0.5 text-sm text-muted">{[job.location, job.note].filter(Boolean).join(" · ")}</p>
            )}
            <div className="mt-4 space-y-6">
              {job.roles.map((role) => (
                <div key={role.title}>
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-medium">{role.title}</span>
                    <span className="font-mono text-xs text-cyan">{formatPeriod(role.period)}</span>
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink/85 marker:text-violet">
                    {role.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Stack">
                    {role.stack.map((s) => (
                      <li key={s}>
                        <Chip>{s}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
      </Timeline>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs tracking-[0.18em] text-cyan uppercase">Education</h3>
          <div className="mt-5">
            <Timeline>
              {education.map((e) => (
                <li key={e.school} className="relative">
                  <Dot />
                  <p className="font-medium">{e.qualification}</p>
                  <p className="text-sm text-muted">
                    {e.school} · {e.detail}
                  </p>
                  <p className="mt-1 font-mono text-xs text-cyan">{formatPeriod(e.period)}</p>
                </li>
              ))}
            </Timeline>
          </div>
        </div>
        <div>
          <h3 className="font-mono text-xs tracking-[0.18em] text-cyan uppercase">Volunteering</h3>
          <div className="mt-5">
            <Timeline>
              {volunteering.map((v) => (
                <li key={v.org} className="relative">
                  <Dot />
                  <p className="font-medium">{v.role}</p>
                  <p className="text-sm text-muted">{v.org}</p>
                  <p className="mt-1 font-mono text-xs text-cyan">{formatPeriod(v.period)}</p>
                  <p className="mt-2 text-sm text-ink/85">{v.summary}</p>
                </li>
              ))}
            </Timeline>
          </div>
        </div>
      </div>
    </Section>
  );
}
