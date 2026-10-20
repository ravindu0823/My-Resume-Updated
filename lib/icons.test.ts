import assert from "node:assert/strict";
import { test } from "node:test";
import { stack } from "../content/stack.ts";
import { iconFor, stackIcons } from "./icons.ts";

test("finds a logo for a stack name, ignoring version numbers", () => {
  assert.deepEqual(iconFor(stack, ".NET 9"), { icon: "dotnetcore" });
  assert.deepEqual(iconFor(stack, "ASP.NET Core 8"), { icon: "dotnetcore" });
  assert.deepEqual(iconFor(stack, "Next.js 16"), { icon: "nextjs", mono: true });
  assert.deepEqual(iconFor(stack, "Spring Boot"), { icon: "spring" });
});

test("returns nothing for names without a vendored logo", () => {
  assert.equal(iconFor(stack, "Stripe"), undefined);
  assert.equal(iconFor(stack, "AES-256-GCM"), undefined);
});

test("stackIcons keeps the first three distinct logos in order", () => {
  assert.deepEqual(
    stackIcons(stack, ["ASP.NET Core", ".NET 10", "React", "Stripe", "SQL Server", "MySQL"]).map((i) => i.icon),
    ["dotnetcore", "react", "microsoftsqlserver"],
  );
});
