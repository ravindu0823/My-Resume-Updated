/** Section anchors, in page order. `primary` ones show in the desktop top bar. */
export const SECTION_LINKS: { id: string; label: string; primary?: true }[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work", primary: true },
  { id: "experience", label: "Experience", primary: true },
  { id: "stack", label: "Stack", primary: true },
  { id: "projects", label: "Projects", primary: true },
  { id: "open-source", label: "Open source" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact", primary: true },
];

export const RESUME_PDF = "/Ravindu-Perera-Resume.pdf";
