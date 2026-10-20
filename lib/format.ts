import type { Period } from "../content/schema.ts";

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-10-21" → "21 Oct 2026". UTC so the build machine's timezone never shifts the day. */
export function formatDay(iso: string): string {
  return DAY.format(new Date(`${iso}T00:00:00Z`));
}

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const month = (ym: string) => MONTH.format(new Date(`${ym}-01T00:00:00Z`));

/** {start:"2024-08", end:"present"} → "Aug 2024 – Present" (en dash with spaces). */
export function formatPeriod(p: Period): string {
  return `${month(p.start)} – ${p.end === "present" ? "Present" : month(p.end)}`;
}
