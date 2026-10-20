export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/** A stored choice wins; otherwise the system preference; otherwise dark (the brand default). */
export function resolveTheme(stored: unknown, prefersDark: boolean | null): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark === false ? "light" : "dark";
}

// Runs in <head> before first paint so the page never flashes the wrong theme. Storage and
// matchMedia can both throw (private mode, blocked site data), so each is guarded on its own.
// Kept in sync with resolveTheme() by lib/theme.test.ts.
export const THEME_INIT_SCRIPT = `(function(){var s=null,m=null;try{s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}try{m=matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}document.documentElement.dataset.theme=s==="light"||s==="dark"?s:m===false?"light":"dark"})();`;
