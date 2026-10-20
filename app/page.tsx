import { content } from "@/content/index.ts";
import { Footer } from "@/components/site/Footer.tsx";
import { TopBar } from "@/components/site/TopBar.tsx";

export default function Home() {
  const { profile } = content;
  return (
    <>
      <TopBar name="Ravindu Perera" />
      <main id="main" className="pt-14">
        <div id="top" />
      </main>
      <Footer profile={profile} updated={content.updated} />
    </>
  );
}
