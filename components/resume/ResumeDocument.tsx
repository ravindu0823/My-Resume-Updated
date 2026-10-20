import type { Content } from "@/content/schema.ts";
import { formatPeriod } from "@/lib/format.ts";

// The printable resume, rendered from the same content as the site and printed to
// public/Ravindu-Perera-Resume.pdf by scripts/pdf.mjs. One text column, real text (no images of
// text), standard headings: applicant-tracking systems parse it. Colours are fixed so the PDF never
// inherits the site's dark theme. No phone number: the PDF is public (owner ruling 2026-10-21).
// Editing this file changes the content hash, so `pnpm pdf` must be re-run before `pnpm build`.

const display = (href: string) => href.replace(/^mailto:/, "").replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");

function H2({ children }: { children: string }) {
  return <h2 className="resume-h2">{children}</h2>;
}

export function ResumeDocument({ content }: { content: Content }) {
  const { profile } = content;
  const contact = profile.links.filter((l) => ["email", "linkedin", "github", "portfolio"].includes(l.kind));
  const clientProjects = content.projects.filter((p) => p.group === "client");

  return (
    <article className="resume">
      <header>
        <h1 className="resume-name">{profile.name}</h1>
        <p className="resume-role">
          {profile.role} · {profile.location}
        </p>
        <p className="resume-contact">
          {contact.map((l, i) => (
            <span key={l.kind}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <a href={l.href}>{display(l.href)}</a>
            </span>
          ))}
        </p>
      </header>

      <section>
        <H2>Profile</H2>
        <p>{profile.summary}</p>
      </section>

      <section>
        <H2>Skills</H2>
        <dl className="resume-skills">
          {content.cvExtras.skills.map((s) => (
            <div key={s.label}>
              <dt>{s.label}:</dt> <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <H2>Experience</H2>
        {content.experience.map((job) =>
          job.roles.map((role) => (
            <div key={role.title} className="resume-entry">
              <p className="resume-entry-head">
                <strong>
                  {role.title} · {job.company}
                </strong>
                <span>{formatPeriod(role.period)}</span>
              </p>
              {job.note && role === job.roles[0] && <p className="resume-note">{job.note}</p>}
              <ul>
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )),
        )}
      </section>

      <section>
        <H2>Selected projects</H2>
        {content.featured.map((f) => (
          <div key={f.slug} className="resume-entry">
            <p className="resume-entry-head">
              <strong>{f.title}</strong>
              <span>{f.role}</span>
            </p>
            <p>
              {f.summary} <span className="resume-stack">{f.stack.join(", ")}</span>
            </p>
          </div>
        ))}
      </section>

      <section>
        <H2>Additional projects</H2>
        <ul>
          {clientProjects.map((p) => (
            <li key={p.slug}>
              <strong>{p.title}</strong> <span className="resume-stack">({p.stack.join(", ")})</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <H2>Open source & volunteering</H2>
        <ul>
          {content.openSource.map((o) => (
            <li key={o.name}>
              <strong>{o.name}</strong>
              {o.proof ? ` (${o.proof.label})` : ""}: {o.summary}
            </li>
          ))}
          {content.volunteering.map((v) => (
            <li key={v.org}>
              <strong>
                {v.role}, {v.org}
              </strong>{" "}
              ({formatPeriod(v.period)}): {v.summary}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <H2>Education</H2>
        {content.education.map((e) => (
          <div key={e.school} className="resume-entry">
            <p className="resume-entry-head">
              <strong>{e.qualification}</strong>
              <span>{formatPeriod(e.period)}</span>
            </p>
            <p>
              {e.school} · {e.detail}
            </p>
          </div>
        ))}
      </section>
    </article>
  );
}
