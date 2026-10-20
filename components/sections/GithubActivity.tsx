import { Section } from "@/components/ui/Section.tsx";

// The profile repo (ravindu0823/ravindu0823) rebuilds these cards twice a day, counting private
// work, and publishes them to its `output` branch. Embedding them keeps the numbers current with no
// token in this build. Each card has fixed dimensions, so a 404 or an outage leaves a reserved box
// with alt text instead of collapsing the layout. Light/dark follow this site's own theme switch.
const RAW = "https://raw.githubusercontent.com/ravindu0823/ravindu0823/output";

function Themed({ name, alt, width, height, className }: { name: string; alt: string; width: number; height: number; className?: string }) {
  return (
    <>
      <img
        src={`${RAW}/${name}-light.svg`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`dark:hidden ${className ?? ""}`}
      />
      <img
        src={`${RAW}/${name}-dark.svg`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`hidden dark:block ${className ?? ""}`}
      />
    </>
  );
}

export function GithubActivity() {
  return (
    <Section id="activity" eyebrow="Activity" title="GitHub, including private work">
      <div className="grid gap-4 md:grid-cols-2">
        <Themed
          name="stats-activity"
          alt="GitHub activity over the last 12 months: contributions, commits, pull requests, reviews, repositories and streaks"
          width={415}
          height={280}
          className="h-auto w-full rounded-2xl"
        />
        <Themed
          name="stats-languages"
          alt="Languages over the last 12 months, weighted by commits"
          width={415}
          height={280}
          className="h-auto w-full rounded-2xl"
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface/60 p-3">
        <Themed name="snake" alt="Contribution graph being eaten by a snake" width={880} height={192} className="h-auto w-full" />
      </div>
    </Section>
  );
}
