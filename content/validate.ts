import type { Content, Diagram } from "./schema.ts";

// Owner ruling 2026-10-21: client work (747 Live) is described neutrally, never in gambling
// terms. Checked here, in the build, so the wording cannot drift back in through an edit.
export const BANNED_WORDS = [
  "casino",
  "betting",
  "bet",
  "bets",
  "odds",
  "gambling",
  "gamble",
  "wager",
  "lottery",
  "jackpot",
] as const;

const BANNED = new RegExp(`\\b(${BANNED_WORDS.join("|")})\\b`, "i");
// The resume PDF is public, so no phone number may appear in any text (owner ruling).
const PHONE = /\+?\d[\d\s-]{8,}\d/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const URL_KEYS = new Set(["href", "repo"]);

type Options = { fileExists: (publicPath: string) => boolean };

export function validateContent(c: Content, opts: Options): string[] {
  const errors: string[] = [];
  walk(c, "", errors, opts);
  c.featured.forEach((f, i) => checkDiagram(f.diagram, `featured[${i}].diagram`, errors));
  c.stack.forEach((g, gi) =>
    g.items.forEach((item, ii) => {
      if (item.icon && !opts.fileExists(`/icons/${item.icon}.svg`)) {
        errors.push(`missing icon /icons/${item.icon}.svg (stack[${gi}].items[${ii}])`);
      }
    }),
  );
  if (!DAY.test(c.updated)) errors.push(`updated: expected YYYY-MM-DD, got "${c.updated}"`);
  return errors;
}

export function assertValidContent(c: Content, opts: Options): void {
  const errors = validateContent(c, opts);
  if (errors.length) throw new Error(`Invalid resume content (${errors.length}):\n- ${errors.join("\n- ")}`);
}

function walk(value: unknown, path: string, errors: string[], opts: Options): void {
  if (typeof value === "string") {
    checkText(value, path, errors);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, errors, opts));
    return;
  }
  if (!value || typeof value !== "object") return;

  const obj = value as Record<string, unknown>;
  if (isPeriod(obj)) checkPeriod(obj, path, errors);
  if (isImage(obj)) checkImage(obj.src, path, errors, opts);

  for (const [key, v] of Object.entries(obj)) {
    const at = path ? `${path}.${key}` : key;
    if (URL_KEYS.has(key) && typeof v === "string") {
      checkUrl(v, at, errors);
      continue;
    }
    walk(v, at, errors, opts);
  }
}

function checkText(s: string, path: string, errors: string[]): void {
  if (!s.trim()) {
    errors.push(`empty string at ${path}`);
    return;
  }
  const banned = BANNED.exec(s);
  if (banned) errors.push(`banned word "${banned[1]!.toLowerCase()}" at ${path}`);
  // ISO dates (2026-10-21) and month ranges are digit runs too; they are not phone numbers.
  if (PHONE.test(s.replace(/\b\d{4}-\d{2}(?:-\d{2})?\b/g, ""))) errors.push(`looks like a phone number at ${path}`);
}

function checkUrl(href: string, path: string, errors: string[]): void {
  if (!/^(https:\/\/|mailto:)/.test(href)) errors.push(`link must be https: or mailto: at ${path} ("${href}")`);
}

function isPeriod(o: Record<string, unknown>): o is { start: string; end: string } {
  return typeof o.start === "string" && typeof o.end === "string";
}

function checkPeriod(p: { start: string; end: string }, path: string, errors: string[]): void {
  const startOk = MONTH.test(p.start);
  const endOk = p.end === "present" || MONTH.test(p.end);
  if (!startOk) errors.push(`invalid month "${p.start}" at ${path}.start`);
  if (!endOk) errors.push(`invalid month "${p.end}" at ${path}.end`);
  if (startOk && endOk && p.end !== "present" && p.end < p.start) errors.push(`period at ${path} ends before it starts`);
}

function isImage(o: Record<string, unknown>): o is { src: string } {
  return typeof o.src === "string" && typeof o.width === "number" && typeof o.height === "number";
}

function checkImage(src: string, path: string, errors: string[], opts: Options): void {
  if (!src.startsWith("/img/") || /\.\w+$/.test(src)) {
    errors.push(`image src must be a base path like /img/name at ${path} ("${src}")`);
    return;
  }
  for (const variant of ["@1x.avif", "@1x.webp", "@2x.avif", "@2x.webp"]) {
    if (!opts.fileExists(`${src}${variant}`)) errors.push(`missing image ${src}${variant} (${path})`);
  }
}

function checkDiagram(d: Diagram, path: string, errors: string[]): void {
  const ids = new Set<string>();
  const cells = new Set<string>();
  for (const n of d.nodes) {
    if (ids.has(n.id)) errors.push(`duplicate node id "${n.id}" in ${path}`);
    ids.add(n.id);
    const cell = `${n.col},${n.row}`;
    if (cells.has(cell)) errors.push(`cell (${cell}) used twice in ${path}`);
    cells.add(cell);
  }
  for (const e of d.edges) {
    for (const end of [e.from, e.to]) if (!ids.has(end)) errors.push(`edge references unknown node "${end}" in ${path}`);
    if (e.from === e.to) errors.push(`self edge on "${e.from}" in ${path}`);
  }
}
