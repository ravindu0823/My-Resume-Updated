import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDay, formatPeriod } from "./format.ts";

test("formats an ISO day the way the footer prints it", () => {
  assert.equal(formatDay("2026-10-21"), "21 Oct 2026");
  assert.equal(formatDay("2026-01-05"), "5 Jan 2026");
});

test("formats a period that is still running", () => {
  assert.equal(formatPeriod({ start: "2024-08", end: "present" }), "Aug 2024 – Present");
});

test("formats a closed period", () => {
  assert.equal(formatPeriod({ start: "2023-12", end: "2024-08" }), "Dec 2023 – Aug 2024");
  assert.equal(formatPeriod({ start: "2022-11", end: "2023-05" }), "Nov 2022 – May 2023");
});
