import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDay } from "./format.ts";

test("formats an ISO day the way the footer prints it", () => {
  assert.equal(formatDay("2026-10-21"), "21 Oct 2026");
  assert.equal(formatDay("2026-01-05"), "5 Jan 2026");
});
