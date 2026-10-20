import type { Content } from "@/content/schema.ts";
import { Picture } from "@/components/ui/Picture.tsx";
import { Section } from "@/components/ui/Section.tsx";

export function About({ content }: { content: Content }) {
  const { profile } = content;
  const job = content.experience[0]!;
  const degree = content.education[0]!;
  const facts = [
    ["Now", `${job.roles[0]!.title}, ${job.company}`],
    ["Clients", job.note?.replace(/^Platforms for clients including /, "").replace(/\.$/, "") ?? ""],
    ["Education", `${degree.qualification}, ${degree.school}`],
    ["Based in", profile.location],
  ].filter(([, v]) => v);

  return (
    <Section id="about" eyebrow="About" title="Backend-leaning, full-stack, cloud-native.">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start">
        <div>
          <p className="max-w-prose text-lg leading-relaxed text-ink/90">{profile.summary}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-surface/60 p-4">
                <dt className="font-mono text-xs tracking-wider text-muted uppercase">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mx-auto w-48 md:w-full">
          <div className="rounded-3xl bg-gradient-to-br from-violet via-azure to-cyan p-[2px]">
            <Picture image={profile.photo} className="block h-auto w-full rounded-[22px] bg-tile" />
          </div>
        </div>
      </div>
    </Section>
  );
}
