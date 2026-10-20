import { content } from "@/content/index.ts";
import { Hero } from "@/components/hero/Hero.tsx";
import { About } from "@/components/sections/About.tsx";
import { Highlights } from "@/components/sections/Highlights.tsx";
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
      </main>
      <Footer profile={profile} updated={content.updated} />
    </>
  );
}
