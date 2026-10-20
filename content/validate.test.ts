import assert from "node:assert/strict";
import { test } from "node:test";
import type { Content } from "./schema.ts";
import { assertValidContent, validateContent } from "./validate.ts";

const allFiles = { fileExists: () => true };

function fixture(): Content {
  return {
    profile: {
      name: "Ada Example",
      shortName: "Ada",
      role: "Software Engineer",
      location: "Colombo, Sri Lanka",
      summary: "Builds event-driven systems.",
      photo: { src: "/img/photo", width: 400, height: 400, alt: "Portrait" },
      links: [{ kind: "email", label: "Email", href: "mailto:ada@example.com", primary: true }],
      highlights: [{ value: "3+", label: "years" }],
    },
    experience: [
      {
        company: "Example Ltd",
        roles: [{ title: "Engineer", period: { start: "2023-12", end: "present" }, bullets: ["Built things."], stack: ["C#"] }],
      },
    ],
    featured: [
      {
        slug: "platform",
        title: "Platform",
        role: "Lead",
        summary: "A platform.",
        bullets: ["Did work."],
        stack: [".NET"],
        diagram: {
          nodes: [
            { id: "a", label: "API", kind: "service", col: 0, row: 0 },
            { id: "b", label: "DB", kind: "store", col: 1, row: 0 },
          ],
          edges: [{ from: "a", to: "b" }],
        },
      },
    ],
    projects: [{ slug: "tool", title: "Tool", summary: "A tool.", stack: ["Go"], group: "public", href: "https://github.com/x/tool" }],
    stack: [{ title: "Backend", caption: "core", items: [{ name: "C#", icon: "csharp" }] }],
    openSource: [{ name: "Thing", href: "https://github.com/x/thing", summary: "Fixes." }],
    volunteering: [{ org: "FOSS", role: "Lead", period: { start: "2022-03", end: "2024-02" }, summary: "Led." }],
    education: [{ school: "Uni", detail: "Campus", qualification: "BSc", period: { start: "2021-06", end: "2024-06" } }],
    cvExtras: { skills: [{ label: "Languages", value: "C#" }] },
    updated: "2026-10-21",
  };
}

const errorsFor = (mutate: (c: Content) => void, opts = allFiles) => {
  const c = fixture();
  mutate(c);
  return validateContent(c, opts).join("\n");
};

test("the fixture itself is valid", () => {
  assert.deepEqual(validateContent(fixture(), allFiles), []);
});

test("bans gambling vocabulary as whole words", () => {
  assert.match(errorsFor((c) => (c.featured[0]!.summary = "Live odds feed.")), /banned word "odds"/);
  assert.match(errorsFor((c) => (c.projects[0]!.summary = "Place a Bet now")), /banned word "bet"/);
  assert.match(errorsFor((c) => (c.profile.summary = "Casino platform")), /banned word "casino"/);
  assert.equal(errorsFor((c) => (c.projects[0]!.summary = "alphabet soup, bettering things")), "");
});

test("rejects non-https links", () => {
  assert.match(errorsFor((c) => (c.projects[0]!.href = "http://example.com")), /link must be https: or mailto:/);
  assert.match(errorsFor((c) => (c.profile.links[0]!.href = "javascript:alert(1)")), /link must be https: or mailto:/);
});

test("rejects a period that ends before it starts", () => {
  assert.match(
    errorsFor((c) => (c.experience[0]!.roles[0]!.period = { start: "2024-08", end: "2023-12" })),
    /ends before it starts/,
  );
});

test("rejects malformed months", () => {
  assert.match(errorsFor((c) => (c.education[0]!.period.start = "2024-13")), /invalid month "2024-13"/);
  assert.match(errorsFor((c) => (c.education[0]!.period.end = "June 2024")), /invalid month "June 2024"/);
});

test("rejects a missing image", () => {
  assert.match(errorsFor(() => {}, { fileExists: () => false }), /missing image \/img\/photo@1x\.avif/);
});

test("rejects a stack icon with no vendored file", () => {
  assert.match(
    errorsFor(() => {}, { fileExists: (p: string) => !p.startsWith("/icons/") }),
    /missing icon \/icons\/csharp\.svg/,
  );
});

test("rejects diagram edges to unknown nodes", () => {
  assert.match(errorsFor((c) => c.featured[0]!.diagram.edges.push({ from: "a", to: "zz" })), /unknown node "zz"/);
});

test("rejects two diagram nodes in one cell", () => {
  assert.match(
    errorsFor((c) => c.featured[0]!.diagram.nodes.push({ id: "c", label: "Cache", kind: "store", col: 1, row: 0 })),
    /cell \(1,0\) used twice/,
  );
});

test("rejects phone-number-looking text anywhere", () => {
  assert.match(errorsFor((c) => (c.profile.location = "Call +00 000 000 0000")), /looks like a phone number/);
  assert.equal(errorsFor((c) => (c.projects[0]!.summary = "Handled 480+ commits in 2024-2025")), "");
});

test("rejects empty strings anywhere", () => {
  assert.match(errorsFor((c) => (c.featured[0]!.summary = "  ")), /empty string at featured\[0\]\.summary/);
});

test("assertValidContent throws with every error listed", () => {
  assert.throws(
    () => assertValidContent({ ...fixture(), updated: "" }, allFiles),
    (e: unknown) => e instanceof Error && /Invalid resume content/.test(e.message) && /empty string at updated/.test(e.message),
  );
});
