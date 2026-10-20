import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveTheme, THEME_INIT_SCRIPT } from "./theme.ts";

test("a stored choice wins over the system preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("junk in storage falls back to the system preference", () => {
  assert.equal(resolveTheme("purple", false), "light");
  assert.equal(resolveTheme({}, true), "dark");
});

test("no storage and no preference means dark", () => {
  assert.equal(resolveTheme(null, null), "dark");
});

test("the inline script survives blocked storage and still sets a theme", () => {
  const root = { dataset: {} as Record<string, string> };
  const run = new Function("document", "localStorage", "matchMedia", THEME_INIT_SCRIPT);
  const blocked = {
    getItem() {
      throw new Error("SecurityError");
    },
  };
  run({ documentElement: root }, blocked, () => ({ matches: false }));
  assert.equal(root.dataset.theme, "light");
});
