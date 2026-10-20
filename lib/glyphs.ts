import type { Motif, Project } from "../content/schema.ts";

// 24x24 line glyphs, drawn for this site.
export const GLYPHS: Record<Motif, string> = {
  wallet: "M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5zM16 13.5h.01",
  card: "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM3 10h18M7 15h4",
  market: "M4 9.5 5.5 5h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12.5V19h13v-6.5M10 19v-3.5h4V19",
  game: "M7 9h3M8.5 7.5v3M15 9h.01M17 11h.01M6.5 5h11A4.5 4.5 0 0 1 22 9.5v3a3.5 3.5 0 0 1-6.3 2.1L14.5 13h-5l-1.2 1.6A3.5 3.5 0 0 1 2 12.5v-3A4.5 4.5 0 0 1 6.5 5z",
  heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  bolt: "M13 3 5 13.5h6L10 21l8-10.5h-6z",
  boxes: "M4 8.5 12 4l8 4.5v7L12 20l-8-4.5zM4 8.5l8 4.5 8-4.5M12 13v7M8 6.2l8 4.5",
  medical: "M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z",
  dining: "M6 3v7a2 2 0 0 0 4 0V3M8 10v11M17 21V3c-2 0-3.5 2.5-3.5 6S15 13 17 13",
  leaf: "M5 19C5 10 11 5 20 4c-.5 9-5 15-14 15zM5 19l7-7",
  bed: "M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7.5 11.5a1.5 1.5 0 1 0 0-.01",
  briefcase: "M4 8h16v11H4zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16M11 13v2h2v-2",
  recycle: "M7 19H4.5l3.5-6M17 19h2.5L16 13M12 4l2.5 4.5M12 4 9.5 8.5M9 19h6M7.5 9.5 6 12M16.5 9.5 18 12",
  book: "M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6",
  film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
  code: "M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
};

/** Label and gradient per project group, shared by the cover (sm+) and the compact tile (phones). */
export const GROUP_STYLE: Record<Project["group"], { label: string; a: string; b: string }> = {
  client: { label: "client work", a: "var(--violet)", b: "var(--azure)" },
  public: { label: "open source", a: "var(--azure)", b: "var(--cyan)" },
  community: { label: "community", a: "var(--cyan)", b: "var(--violet)" },
};
