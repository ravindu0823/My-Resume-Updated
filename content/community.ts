import type { OpenSource, Volunteering } from "./schema.ts";

// GitHub facts verified through the API on 2026-10-21. Dokploy PRs were submitted; none merged.
export const openSource: OpenSource[] = [
  {
    name: "frag-arena",
    href: "https://github.com/DFanso/frag-arena",
    summary:
      "Browser-based 3D multiplayer FPS. My merged PRs added server-side lag compensation, session-token reconnection, server-verified headshots, per-IP WebSocket rate limiting and spatial audio.",
    proof: { label: "14 merged PRs", href: "https://github.com/DFanso/frag-arena/pulls?q=is%3Apr+author%3Aravindu0823+is%3Amerged" },
  },
  {
    name: "Dokploy",
    href: "https://github.com/Dokploy/dokploy",
    summary: "Fixes submitted upstream for database backups, Traefik certificates and session expiry.",
    proof: { label: "PRs submitted", href: "https://github.com/Dokploy/dokploy/pulls?q=is%3Apr+author%3Aravindu0823" },
  },
];

// Source: CV "Volunteer Experience".
export const volunteering: Volunteering[] = [
  {
    org: "FOSS Community, NSBM Green University",
    role: "Council Member & Technical Team Lead",
    period: { start: "2022-03", end: "2024-02" },
    summary:
      "Led the technical team on open-source projects and event websites with React, Node.js, Next.js, TypeScript, Python, MongoDB and DigitalOcean.",
  },
];
