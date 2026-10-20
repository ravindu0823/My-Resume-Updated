import { cvExtras } from "./cv-extras.ts";
import { education } from "./education.ts";
import { experience } from "./experience.ts";
import { openSource, volunteering } from "./community.ts";
import { profile } from "./profile.ts";
import type { Content } from "./schema.ts";
import { stack } from "./stack.ts";
import { featured, projects } from "./work.ts";

export const content: Content = {
  profile,
  experience,
  featured,
  projects,
  stack,
  openSource,
  volunteering,
  education,
  cvExtras,
  updated: "2026-10-21",
};
