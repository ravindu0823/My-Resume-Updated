import { existsSync } from "node:fs";
import { join } from "node:path";
import { content } from "@/content/index.ts";
import { assertValidContent } from "@/content/validate.ts";
import { Hero } from "@/components/hero/Hero.tsx";
import { About } from "@/components/sections/About.tsx";
import { Experience } from "@/components/sections/Experience.tsx";
import { GithubActivity } from "@/components/sections/GithubActivity.tsx";
import { Highlights } from "@/components/sections/Highlights.tsx";
import { MoreProjects } from "@/components/sections/MoreProjects.tsx";
import { OpenSource } from "@/components/sections/OpenSource.tsx";
import { SelectedWork } from "@/components/sections/SelectedWork.tsx";
import { Stack } from "@/components/sections/Stack.tsx";
import { Footer } from "@/components/site/Footer.tsx";
import { TopBar } from "@/components/site/TopBar.tsx";

// Runs while the page is prerendered, so invalid content (a banned word, a phone number, a missing
// image) fails `next build` itself. Vercel deploys main without waiting for CI; this cannot be skipped.
assertValidContent(content, { fileExists: (p) => existsSync(join(process.cwd(), "public", p)) });

// Structured data for search engines: who this is, where they work and studied, and their profiles.
function personJsonLd() {
  const { profile, education } = content;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Software Engineer",
    url: "https://ravinduperera.vercel.app/",
    image: `https://ravinduperera.vercel.app${profile.photo.src}@2x.webp`,
    address: { "@type": "PostalAddress", addressLocality: "Piliyandala", addressCountry: "LK" },
    worksFor: { "@type": "Organization", name: "Techwire Lanka" },
    alumniOf: { "@type": "CollegeOrUniversity", name: education[0]!.school.replace(/, UK$/, "") },
    sameAs: profile.links.filter((l) => l.kind !== "email" && l.kind !== "portfolio").map((l) => l.href),
  };
}

export default function Home() {
  const { profile } = content;
  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so content can never close the script element early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }}
      />
      <TopBar name="Ravindu Perera" />
      <main id="main" className="pt-14">
        <Hero profile={profile} />
        <Highlights items={profile.highlights} />
        <About content={content} />
        <SelectedWork items={content.featured} />
        <Experience jobs={content.experience} education={content.education} volunteering={content.volunteering} />
        <Stack groups={content.stack} />
        <MoreProjects projects={content.projects} stack={content.stack} />
        <OpenSource items={content.openSource} />
        <GithubActivity />
      </main>
      <Footer profile={profile} updated={content.updated} />
    </>
  );
}
