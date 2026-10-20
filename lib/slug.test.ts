import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "./slug.ts";

test("turns a title into an id-safe slug", () => {
  assert.equal(slugify("Data & messaging"), "data-messaging");
  assert.equal(slugify("Frontend, ML & observability"), "frontend-ml-observability");
  assert.equal(slugify("  .NET 10 API  "), "net-10-api");
});
