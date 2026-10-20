// Types for every piece of resume content. The site and the PDF both render from these.
// Deliberately no phone field: the PDF is public (owner ruling 2026-10-21).

export type LinkKind =
  | "email"
  | "linkedin"
  | "github"
  | "portfolio"
  | "x"
  | "devto"
  | "stackoverflow"
  | "tryhackme"
  | "instagram"
  | "facebook"
  | "discord";

export type Link = { kind: LinkKind; label: string; href: string; primary?: true };

/** Months as YYYY-MM. */
export type Period = { start: string; end: string | "present" };

/** `src` is a base path such as "/img/photo"; renderers add @1x/@2x and .avif/.webp. */
export type Image = { src: string; width: number; height: number; alt: string };

export type Role = { title: string; period: Period; bullets: string[]; stack: string[] };

export type Job = { company: string; location?: string; note?: string; roles: Role[] };

export type DiagramNode = {
  id: string;
  label: string;
  kind: "client" | "service" | "store" | "queue" | "external";
  col: 0 | 1 | 2 | 3;
  row: 0 | 1 | 2;
};

export type DiagramEdge = { from: string; to: string; label?: string; async?: true };

export type Diagram = { nodes: DiagramNode[]; edges: DiagramEdge[] };

export type Featured = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  bullets: string[];
  stack: string[];
  repo?: string;
  diagram: Diagram;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  href?: string;
  image?: Image;
  group: "client" | "public" | "community";
};

export type StackGroup = { title: string; caption: string; items: { name: string; icon?: string; mono?: true }[] };

export type Education = { school: string; detail: string; qualification: string; period: Period };

export type Volunteering = { org: string; role: string; period: Period; summary: string };

export type OpenSource = { name: string; href: string; summary: string; proof?: { label: string; href: string } };

export type Highlight = { value: string; label: string };

export type Profile = {
  name: string;
  shortName: string;
  role: string;
  location: string;
  summary: string;
  photo: Image;
  links: Link[];
  highlights: Highlight[];
};

export type CvExtras = { skills: { label: string; value: string }[] };

export type Content = {
  profile: Profile;
  experience: Job[];
  featured: Featured[];
  projects: Project[];
  stack: StackGroup[];
  openSource: OpenSource[];
  volunteering: Volunteering[];
  education: Education[];
  cvExtras: CvExtras;
  /** YYYY-MM-DD, shown as "last updated". */
  updated: string;
};
