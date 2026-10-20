import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { content } from "./index.ts";
import { validateContent } from "./validate.ts";

const publicFile = (p: string) => existsSync(join(import.meta.dirname, "..", "public", p));

test("the shipped content is valid, ignoring images", () => {
  const errors = validateContent(content, { fileExists: () => true });
  assert.deepEqual(errors, []);
});

test("the shipped content is valid, including images", { todo: "images land in Task 3" }, () => {
  assert.deepEqual(validateContent(content, { fileExists: publicFile }), []);
});

test("experience follows the CV", () => {
  assert.deepEqual(
    content.experience.map((j) => j.company),
    ["Techwire Lanka (Pvt) Ltd", "EXE.lk"],
  );
  const techwire = content.experience[0]!;
  assert.deepEqual(
    techwire.roles.map((r) => [r.title, r.period.start, r.period.end]),
    [
      ["Software Engineer", "2024-08", "present"],
      ["Associate Software Engineer", "2023-12", "2024-08"],
    ],
  );
  assert.match(techwire.note ?? "", /747 Live/);
});

test("primary links are email, LinkedIn and GitHub", () => {
  assert.deepEqual(
    content.profile.links.filter((l) => l.primary).map((l) => l.kind),
    ["email", "linkedin", "github"],
  );
  assert.equal(content.profile.links.find((l) => l.kind === "email")?.href, "mailto:dhanushka114@outlook.com");
});
