"use client";
import { useEffect, useState } from "react";
import { data } from "@/types/main";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
import Socials from "@/components/Socials";
import Experiences from "@/components/experiences/Experiences";
import Contact from "@/components/Contact";
import CallToAction from "@/components/CallToAction";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "@/components/Loader"; // Import the Loader component
import { useTheme } from "next-themes";

interface Props {
  data: data;
}

const HomePage = ({ data }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);

    // Simulate loading time (for example, if you fetch data here)
    setTimeout(() => {
      setLoading(false); // Simulate data load completion
    }, 2000); // Adjust this to the real data loading time
  }, []);

  // Prevent rendering until the theme is fully loaded or data is loading
  if (!mounted || loading) {
    return <Loader />; // Render the Tailwind CSS loader while loading
  }

  return (
    <>
      <Header logo={data.main.name} />
      <Hero mainData={data.main} />
      <Socials socials={data.socials} />
      <About aboutData={data.about} name={data.main.name} />
      <Skills skillData={data.skills} />
      <Projects projectsData={data.projects} />
      <Experiences
        experienceData={data.experiences}
        educationData={data.educations}
      />
      <Contact />
      {/* <CallToAction /> */}
      <Footer socials={data.socials} name={data.main.name} />
    </>
  );
};

export default HomePage;
