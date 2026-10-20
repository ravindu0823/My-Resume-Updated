import { content } from "@/content/index.ts";
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

export default function Home() {
  const { profile } = content;
  return (
    <>
      <TopBar name="Ravindu Perera" />
      <main id="main" className="pt-14">
        <Hero profile={profile} />
        <Highlights items={profile.highlights} />
        <About content={content} />
        <SelectedWork items={content.featured} />
        <Experience jobs={content.experience} education={content.education} volunteering={content.volunteering} />
        <Stack groups={content.stack} />
        <MoreProjects projects={content.projects} />
        <OpenSource items={content.openSource} />
        <GithubActivity />
      </main>
      <Footer profile={profile} updated={content.updated} />
    </>
  );
}
