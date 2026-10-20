import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content/index.ts";
import { ResumeDocument } from "@/components/resume/ResumeDocument.tsx";
import { RESUME_PDF } from "@/components/site/nav.ts";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${content.profile.name}, ${content.profile.role}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main id="main" className="resume-page">
      <nav className="resume-toolbar" aria-label="Resume">
        <Link href="/" className="back">
          ← Back to site
        </Link>
        <a href={RESUME_PDF} className="download">
          Download PDF
        </a>
      </nav>
      <ResumeDocument content={content} />
    </main>
  );
}
