import type { Profile } from "@/content/schema.ts";
import { formatDay } from "@/lib/format.ts";
import { SocialIcon } from "@/components/ui/SocialIcon.tsx";
import { CopyEmail } from "./CopyEmail.tsx";
import { RESUME_PDF } from "./nav.ts";

export function Footer({ profile, updated }: { profile: Profile; updated: string }) {
  const email = profile.links.find((l) => l.kind === "email")!;
  const address = email.href.replace("mailto:", "");
  // The portfolio link is this site; it belongs in the PDF, not in its own footer.
  const others = profile.links.filter((l) => l.kind !== "email" && l.kind !== "portfolio");

  return (
    <footer id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line bg-surface/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-mono text-xs tracking-[0.18em] text-cyan uppercase">Contact</p>
        <h2 id="contact-title" className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Let&apos;s build something reliable.
        </h2>
        <p className="mt-3 max-w-prose text-muted">
          The quickest way to reach me is email or LinkedIn. My CV is a PDF generated from this page, so it is always current.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={email.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-4 font-medium text-white"
          >
            <SocialIcon kind="email" className="size-5" />
            {address}
          </a>
          <CopyEmail email={address} />
          <a href={RESUME_PDF} className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm hover:border-cyan">
            Download CV (PDF)
          </a>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {others.map((l) => (
            <li key={l.kind}>
              <a
                href={l.href}
                rel="me noopener"
                className="flex min-h-11 items-center gap-2.5 rounded-xl border border-line/70 px-3 text-sm text-muted transition-colors hover:border-cyan hover:text-ink"
              >
                <SocialIcon kind={l.kind} className="size-4 shrink-0" />
                <span className="truncate">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-xs text-muted">
          © {updated.slice(0, 4)} {profile.name} · Updated {formatDay(updated)} · Built as a static site.
        </p>
      </div>
    </footer>
  );
}
