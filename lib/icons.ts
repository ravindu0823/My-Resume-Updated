import type { StackGroup } from "../content/schema.ts";

export type Logo = { icon: string; mono?: true };

// Names in project stacks that mean the same thing as an entry in the Stack section.
const ALIASES: Record<string, string> = {
  "ASP.NET Core": ".NET",
  "ASP.NET": ".NET",
  "Spring Boot": "Spring",
  Tailwind: "Tailwind CSS",
};

/** The vendored devicon for a stack name ("ASP.NET Core 8" → dotnetcore), if the Stack section has one. */
export function iconFor(groups: StackGroup[], name: string): Logo | undefined {
  const bare = name.replace(/\s+\d+(\.\d+)*$/, "");
  const wanted = ALIASES[bare] ?? bare;
  for (const g of groups) {
    const item = g.items.find((i) => i.name === wanted && i.icon);
    if (item?.icon) return item.mono ? { icon: item.icon, mono: true } : { icon: item.icon };
  }
  return undefined;
}

/** Up to `max` distinct logos for a project's stack, in stack order. */
export function stackIcons(groups: StackGroup[], names: string[], max = 3): Logo[] {
  const out: Logo[] = [];
  for (const name of names) {
    const logo = iconFor(groups, name);
    if (logo && !out.some((l) => l.icon === logo.icon)) out.push(logo);
    if (out.length === max) break;
  }
  return out;
}
