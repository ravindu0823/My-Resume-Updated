import type { Profile } from "@/content/schema.ts";
import { RESUME_PDF } from "@/components/site/nav.ts";
import { SocialIcon } from "@/components/ui/SocialIcon.tsx";
import { ServiceMesh } from "./ServiceMesh.tsx";

const KICKER = "$ dotnet run --project ravindu";

// The hero's text is plain server-rendered HTML: it is the LCP element and needs no JavaScript.
export function Hero({ profile }: { profile: Profile }) {
  const [first, ...rest] = profile.name.split(" ");
  const surname = rest.pop();
  const middle = [first, ...rest].join(" ");
  const link = (kind: string) => profile.links.find((l) => l.kind === kind)!;
  const icons = [link("email"), link("linkedin"), link("github")];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      {/* Decoration lives in its own clipped layer, so the section never clips real content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute -top-40 -left-32 size-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div className="absolute -right-40 -bottom-48 size-[30rem] rounded-full bg-azure/15 blur-3xl" />
      </div>
      <div className="relative mx-auto grid w-full max-w-5xl gap-10 px-4 pt-10 pb-14 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24 lg:pb-20">
        <div>
          <p className="font-mono text-sm text-cyan">
            <span className="kicker inline-block">{KICKER}</span>
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-cyan" />
          </p>
          <h1 id="hero-title" className="mt-4 text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
            {middle}{" "}
            <span className="bg-gradient-to-r from-violet via-azure to-cyan bg-clip-text text-transparent">{surname}</span>
          </h1>
          <p className="mt-4 text-lg text-ink/90 sm:text-xl">{profile.role}</p>
          <p className="mt-1 text-muted">{profile.location}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={RESUME_PDF}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-5 font-semibold text-white shadow-lg shadow-violet/20"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download CV
            </a>
            {icons.map((l) => (
              <a
                key={l.kind}
                href={l.href}
                aria-label={l.kind === "email" ? `Email ${l.label}` : l.label}
                rel={l.kind === "email" ? undefined : "me noopener"}
                className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-surface/70 text-ink transition-colors hover:border-cyan"
              >
                <SocialIcon kind={l.kind} className="size-5" />
              </a>
            ))}
          </div>
        </div>
        <ServiceMesh className="mx-auto w-full max-w-md lg:max-w-none" />
      </div>
    </section>
  );
}
