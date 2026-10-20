const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-10-21" → "21 Oct 2026". UTC so the build machine's timezone never shifts the day. */
export function formatDay(iso: string): string {
  return DAY.format(new Date(`${iso}T00:00:00Z`));
}
