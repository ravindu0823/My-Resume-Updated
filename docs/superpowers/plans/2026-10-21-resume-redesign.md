# Resume Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Firebase-backed template site with a static, typed, GitHub-branded resume site and a PDF generated from the same content.

**Architecture:**
- **Content.** Typed TS modules in `content/` are the single source of truth. A validator runs in tests and during the build.
- **Rendering.** Next 16 App Router renders every page to static HTML (`output: "export"`). Server components by default; three small client islands (theme toggle, mobile menu, copy email).
- **Assets.** Images are pre-optimized by a sharp script. Devicon SVGs are vendored.
- **PDF.** The resume PDF is printed from `/resume` through headless Edge/Chrome over CDP.
- **Stale-PDF guard.** A content hash blocks deploys whose PDF doesn't match the current content.

**Tech Stack:** Next 16.4.2, React 19.3.1, Tailwind CSS 4.3.3, TypeScript 5.9.3, pnpm 11, sharp 0.35.5 (dev), `node:test` with native type stripping (Node ≥ 22.18), ESLint 10 + eslint-config-next 16.4.2.

**Spec:** `docs/superpowers/specs/2026-10-21-resume-redesign-design.md`

## Global Constraints

- **Dependencies.**
  - Runtime: exactly `next@16.4.2`, `react@19.3.1`, `react-dom@19.3.1`, `@vercel/analytics@2.0.1`, `@vercel/speed-insights@2.0.0`.
  - Dev: `typescript@5.9.3`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, `sharp@0.35.5`, `eslint@10.13.0`, `eslint-config-next@16.4.2`, `@types/react@19.3.0`, `@types/react-dom@19.3.0`, `@types/node@22`.
  - Nothing else without stating its name, publisher, licence and need first.
- **Banned in content** (case-insensitive, whole words): casino, betting, bet, bets, odds, gambling, gamble, wager, lottery, jackpot.
- **Content facts** come only from the CV, `content/_sources/live-site-2026-10-21.json`, or the GitHub facts listed in the spec. No phone field anywhere.
- **Links** use only `https:` or `mailto:`. Email is `dhanushka114@outlook.com`.
- **Brand tokens**, the same as `ravindu0823/scripts/theme.mjs`:
  - dark: bg `#0d1117`, surface `#0f1629`, tile `#161f36`, border `#25314f`, text `#e6edf3`, muted `#8b98b8`, violet `#a78bfa`, azure `#38bdf8`, cyan `#22d3ee`;
  - light: bg `#f7f9ff`, surface `#ffffff`, tile `#f2f5fb`, border `#d8dee9`, text `#0f172a`, muted `#57606a`, violet `#6d28d9`, azure `#0078d4`, cyan `#0891b2`.
- **Mobile first.**
  - The base styles are the 390px layout, and `sm:`/`md:`/`lg:` only widen.
  - Touch targets are ≥ 44px. No horizontal scroll at 320px. The top bar is ≤ 56px tall.
  - Never shrink the root font size.
- **Motion.** CSS and SMIL only, decoration only, with `prefers-reduced-motion: reduce` honoured. Data never animates.
- **TS in `content/`, `lib/`** and their tests uses erasable syntax only: no enums, no namespaces, no parameter properties. Relative imports carry `.ts`, so `node --test` can run them.
- **Commits.** Plain messages with no AI trailer. Work stays on branch `redesign`. Nothing is pushed without the owner's approval.

## Review Focus

1. **JavaScript disabled or failing.** Every section, the hero, the expandable project details and the email/PDF links must work from the static HTML. *Test (Task 9):* assert that `out/index.html` contains every section heading and `href="/Ravindu-Perera-Resume.pdf"`.
2. **Corrupt or blocked theme storage.** If `localStorage` throws or holds junk, the page must still render (falling back to the system preference, then dark). *Test (Task 3):* `resolveTheme()` cases.
3. **Long tokens at 320px.** Labels such as "OpenTelemetry" and long project titles must not overflow any element. *Test (Task 9):* a measurement script reports `scrollWidth > clientWidth` per element at 320px.
4. **Reduced motion.** With `prefers-reduced-motion: reduce`, the hero packets must not animate. *Test (Task 9):* emulate it and assert that the computed `animation-name` is `none` and the packets are hidden.
5. **Third-party stats images unavailable.** If the GitHub stats cards 404 or are offline, the layout must not collapse. *Test (Task 7):* the `<img>` tags carry `width`, `height`, `loading="lazy"` and non-empty `alt`.

---

### Task 1: Clean scaffold that builds to a static export

**Files:**
- Delete: `app/*`, `components/*`, `pages/`, `types/`, `firebase.ts`, `data.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `.eslintrc.json`, `public/*` (except `favicon.ico`), `pnpm-lock.yaml` (regenerated).
- Create: `package.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx` (a placeholder `<main>`), `app/globals.css`, `.gitignore` (add `out/`, `.next/`), `.node-version` (`22`).

**Interfaces:**
- Produces:
  - Path alias `@/*` pointing to the repo root.
  - CSS custom properties `--bg --surface --tile --border --text --muted --violet --azure --cyan` under `:root[data-theme="dark"]` and `:root[data-theme="light"]`, exposed to Tailwind through `@theme inline`.
  - Font variables `--font-sans` (Geist) and `--font-mono` (Geist Mono).

- [ ] **Step 1:** Remove the template files listed above and write the new `package.json`.
  - Scripts:
    - `dev: next dev`
    - `build: node scripts/check-pdf.mjs && next build` (`check-pdf.mjs` is a no-op stub that exits 0 until Task 8)
    - `test: node --test`
    - `typecheck: tsc --noEmit`
    - `lint: eslint .`
    - `images: node scripts/images.mjs`
    - `pdf: node scripts/pdf.mjs`
  - Pin the dependencies from the Global Constraints, and set `"packageManager": "pnpm@11.22.0"`.
- [ ] **Step 2:** `next.config.ts`: `{ output: "export", images: { unoptimized: true }, trailingSlash: false, reactStrictMode: true }`. `tsconfig.json`: `target: "ES2022"`, `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`, `noEmit: true`, `strict: true`, `noUncheckedIndexedAccess: true`, plus the Next plugin.
- [ ] **Step 3:** `app/layout.tsx` sets up the Geist fonts through `next/font/google`, `<html lang="en" data-theme="dark">` and the token CSS.
- [ ] **Step 4:** Run `pnpm install && pnpm typecheck && pnpm lint && pnpm build`. Expected: all exit 0 and `out/index.html` exists. Check `head -3 pnpm-lock.yaml` and confirm it shows `lockfileVersion: '9.0'`, which Vercel's pnpm reads.
- [ ] **Step 5:** Commit: "Replace the template scaffold with a static Next 16 app".

### Task 2: Typed content, sourced, with a validator that fails closed

**Files:**
- Create: `content/schema.ts`, `content/profile.ts`, `content/experience.ts`, `content/work.ts`, `content/stack.ts`, `content/community.ts`, `content/education.ts`, `content/cv-extras.ts`, `content/index.ts`, `content/validate.ts`, `content/validate.test.ts`, `content/content.test.ts`.

**Interfaces:**
- Produces, from `content/schema.ts` (types only):
  - `Link { kind: LinkKind; label: string; href: string; primary?: true }`, where `LinkKind` is a string union of email, linkedin, github, portfolio, x, devto, stackoverflow, tryhackme, instagram, facebook, discord.
  - `Period { start: string /* YYYY-MM */; end: string | "present" }`
  - `Role { title: string; period: Period; bullets: string[]; stack: string[] }`
  - `Job { company: string; location?: string; roles: Role[]; note?: string }`. The Techwire entry has two roles, and `note` names 747 Live as a client.
  - `DiagramNode { id: string; label: string; kind: "client"|"service"|"store"|"queue"|"external"; col: 0|1|2|3; row: 0|1|2 }`
  - `DiagramEdge { from: string; to: string; label?: string; async?: true }`
  - `Diagram { nodes: DiagramNode[]; edges: DiagramEdge[] }`
  - `Featured { slug: string; title: string; role: string; summary: string; bullets: string[]; stack: string[]; repo?: string; diagram: Diagram }`
  - `Project { slug: string; title: string; summary: string; stack: string[]; href?: string; image?: { src: string; width: number; height: number; alt: string }; group: "client"|"public"|"community" }`
  - `StackGroup { title: string; items: { name: string; icon?: string }[] }`
  - `Education { school: string; detail: string; qualification: string; period: Period }`
  - `Profile`: name, shortName, role, location, summary, photo (as `Project.image`), links, highlights.
  - `CvExtras { skills: { label: string; value: string }[] }`
  - `Content`: aggregates all of the above.
- Produces, from `content/index.ts`: `export const content: Content`.
- Produces, from `content/validate.ts`:
  - `validateContent(c: Content, opts: { fileExists: (publicPath: string) => boolean }): string[]` returns human-readable errors, and an empty array means valid.
  - `assertValidContent(c: Content, opts): void` throws a single error listing all of them.
  - `BANNED_WORDS: readonly string[]`.

- [ ] **Step 1: Write the failing tests** in `content/validate.test.ts`. Each case mutates a valid fixture and asserts that the error list contains the stated message fragment:
  - `bans gambling vocabulary as whole words`: "odds" → `banned word "odds"`; "bet" → banned; "alphabet" and "bettering" → no error.
  - `rejects non-https links`: `http://x` → `link must be https: or mailto:`.
  - `rejects a period that ends before it starts`: `{start:"2024-08", end:"2023-12"}` → `ends before it starts`.
  - `rejects malformed months`: `"2024-13"` → `invalid month`.
  - `rejects a missing image`: with `fileExists` returning false → `missing image /img/x.avif`.
  - `rejects diagram edges to unknown nodes` → `unknown node "zz"`.
  - `rejects two diagram nodes in one cell` → `cell (1,2) used twice`.
  - `rejects phone-number-looking text anywhere`: `+00 000 000 0000` → `looks like a phone number`.
  - `rejects empty strings anywhere` → `empty string at featured[0].summary`. Implement this as a recursive walk.
- [ ] **Step 2:** Run `node --test content/validate.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `validate.ts`. It walks the whole object recursively for empty strings, banned words and phone patterns (`/\+?\d[\d\s-]{8,}\d/`), then runs the structural checks.
- [ ] **Step 4:** Write the content modules from the CV and the spec's Content sources.
  - Copy wording from the CV, trimmed for brevity. The six featured projects use the README's wording, which was already neutralized.
  - Diagrams contain only the components named in that project's CV bullets.
  - The second module group takes screenshots from `live-site-2026-10-21.json`, with paths `/img/<slug>.avif` produced in Task 3.
- [ ] **Step 5:** Write `content/content.test.ts`:
  - `the shipped content is valid`. Run `validateContent(content, { fileExists: p => existsSync("public"+p) })` and expect `[]`. It is marked `todo` until Task 3 adds the images; the non-image checks run now.
  - `experience follows the CV`: the companies are exactly `["Techwire Lanka (Pvt) Ltd","EXE.lk"]`; the Techwire roles are `Software Engineer` (2024-08, present) and `Associate Software Engineer` (2023-12, 2024-08).
  - `primary links are CV, email, LinkedIn, GitHub`.
- [ ] **Step 6:** Run `pnpm test`. Expected: PASS, apart from the one todo.
- [ ] **Step 7:** Commit: "Add typed resume content and a fail-closed validator".

### Task 3: Self-hosted images, vendored icons, theme resolution

**Files:**
- Create: `scripts/images.mjs`, `content/_sources/images.json`, `lib/theme.ts`, `lib/theme.test.ts`, `public/img/*`, `public/icons/*`.
- Modify: `content/content.test.ts` (drop the todo).

**Interfaces:**
- Produces:
  - `lib/theme.ts`: `resolveTheme(stored: unknown, prefersDark: boolean | null): "dark"|"light"` and `THEME_INIT_SCRIPT: string`. The latter is the inline head script, generated from the same rules.
  - Files `public/img/<name>.avif` and `.webp` at widths `[w, 2w]`, named `<name>@1x` and `<name>@2x`.
  - `public/icons/<devicon-id>.svg`.

- [ ] **Step 1:** Write the failing test `lib/theme.test.ts`:
  - `resolveTheme("light", true) === "light"`
  - `resolveTheme("dark", false) === "dark"`
  - `resolveTheme("purple", false) === "light"`
  - `resolveTheme(null, null) === "dark"`
  - `resolveTheme({}, true) === "dark"`
- [ ] **Step 2:** Implement `lib/theme.ts`. `THEME_INIT_SCRIPT` wraps `localStorage` access in try/catch and sets `document.documentElement.dataset.theme`.
- [ ] **Step 3:** Write `images.json`, one entry per image: `{name, source, width, alt}`. `source` is either a URL from the live-site JSON or a local path. Write `images.mjs`:
  - It downloads each URL into a temp directory and writes AVIF (quality 55) and WebP (quality 72) at `width` and `2×width` with `sharp`, never upscaling past the source size.
  - It copies the pinned devicon SVGs (`https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/<id>/<id>-<variant>.svg`, the same ids and variants as the README `scripts/stack.mjs`) into `public/icons/`.
  - Any download failure exits 1.
- [ ] **Step 4:** Run `pnpm images`. Then run `pnpm test` with the todo removed. Expected: PASS, with the shipped content valid including image existence.
- [ ] **Step 5:** Commit: "Self-host optimized images and vendored icons".

### Task 4: Layout shell: top bar, mobile menu, theme toggle, footer

**Files:**
- Create: `components/site/TopBar.tsx`, `components/site/MobileMenu.tsx` (client), `components/site/ThemeToggle.tsx` (client), `components/site/Footer.tsx`, `components/site/CopyEmail.tsx` (client), `components/ui/Section.tsx`, `components/ui/Chip.tsx`, `components/ui/SocialIcon.tsx`.
- Modify: `app/layout.tsx` (inject `THEME_INIT_SCRIPT` in `<head>`, add the skip link and `<Analytics/>` / `<SpeedInsights/>`).

**Interfaces:**
- Consumes: `content.profile.links`, `THEME_INIT_SCRIPT`.
- Produces:
  - `<Section id title eyebrow? children>`. It renders `<section id aria-labelledby>` with an `h2` and a scroll-margin equal to the top bar's height.
  - `<Chip>{text}</Chip>`
  - `SECTION_LINKS: { id: string; label: string }[]` in `components/site/TopBar.tsx`, which drives navigation and the menu.
  - `<SocialIcon kind: LinkKind />`, inline SVG paths. Brands with no icon get a generic link glyph.

- [ ] **Step 1:** Build the top bar: a fixed 56px height. Name on the left. Section links are visible from `md:`; below that, a 44×44 menu button opens `MobileMenu`, a native `<dialog>` with a focus trap provided by the dialog itself. The theme toggle is 44×44. `CopyEmail` falls back to a plain `mailto:` link when `navigator.clipboard` isn't available.
- [ ] **Step 2:** Run `pnpm typecheck && pnpm lint && pnpm build`. Expected: exit 0.
- [ ] **Step 3:** Commit: "Add the layout shell: top bar, menu, theme toggle, footer".

### Task 5: Hero with service mesh, highlights, about

**Files:**
- Create: `components/hero/Hero.tsx`, `components/hero/ServiceMesh.tsx`, `components/sections/Highlights.tsx`, `components/sections/About.tsx`.
- Modify: `app/page.tsx`.

**Interfaces:**
- Consumes: `content.profile`.
- Produces: the `<ServiceMesh />` inline SVG. Its node ids and labels are api-gateway, service-bus, identity, ledger and realtime, matching the README banner. Packets have class `packet`, which is hidden by reduced motion.

- [ ] **Step 1:** Build the hero. The text renders in the server HTML: the kicker `$ dotnet run --project ravindu` (a CSS typing reveal with the full text as its rest state), the name with a gradient surname, the role, and the location.
  - Actions: "Download CV" → `/Ravindu-Perera-Resume.pdf`, Email, LinkedIn, GitHub, each ≥ 44px tall.
  - The mesh sits below the text at the base breakpoint and beside it from `lg:`.
- [ ] **Step 2:** Run `pnpm build`, then open `out/index.html`. Expected: it contains "Ravindu Dhanushka" and "Download CV".
- [ ] **Step 3:** Commit: "Add hero, highlights and about".

### Task 6: Architecture diagrams and selected work

**Files:**
- Create: `lib/diagram.ts`, `lib/diagram.test.ts`, `components/sections/ArchitectureDiagram.tsx`, `components/sections/SelectedWork.tsx`.

**Interfaces:**
- Consumes: `Featured`, `Diagram` from Task 2.
- Produces:
  - `layoutDiagram(d: Diagram, opts?: { cellW?: number; cellH?: number; nodeW?: number; nodeH?: number }): { width: number; height: number; nodes: (DiagramNode & { x: number; y: number; w: number; h: number })[]; edges: { from: string; to: string; label?: string; async?: true; path: string }[] }`
  - Defaults: `cellW 180`, `cellH 96`, `nodeW 148`, `nodeH 44`. Width is `(maxCol + 1) × cellW`.
  - Edge paths run from the centre of the source's facing side to the centre of the target's facing side, as straight `M x y L x y` segments.

- [ ] **Step 1: Write the failing tests** in `lib/diagram.test.ts`:
  - `places nodes on the grid`: a node at col 2, row 1 gets x = 2·180 + (180−148)/2 = 376 and y = 96 + (96−44)/2 = 122.
  - `sizes the canvas to the used grid`: nodes up to col 3 and row 2 give width 720 and height 288.
  - `connects right side to left side for a left-to-right edge`: the path starts at the source x+w and the target x.
  - `connects bottom to top for a vertical edge`.
  - `every shipped diagram lays out without throwing and has no zero-length edge`.
- [ ] **Step 2:** Run `node --test lib/diagram.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `layoutDiagram`. Then build the `ArchitectureDiagram` SVG:
  - `viewBox` from the layout, `width="100%"`, and `role="img"` with an `aria-label` listing the components.
  - Async edges are dashed, with a CSS-animated packet.
- [ ] **Step 4:** Build `SelectedWork`. Each card holds a title, role, summary, diagram, chips, and `<details><summary>Highlights</summary>` with the bullets, plus a repo link when there is one.
- [ ] **Step 5:** Run `pnpm test && pnpm build`. Expected: PASS and exit 0.
- [ ] **Step 6:** Commit: "Render architecture diagrams for selected work".

### Task 7: Experience, stack, more projects, open source, GitHub activity

**Files:**
- Create: `components/sections/Experience.tsx`, `components/sections/Stack.tsx`, `components/sections/MoreProjects.tsx`, `components/sections/OpenSource.tsx`, `components/sections/GithubActivity.tsx`, `lib/format.ts`, `lib/format.test.ts`.

**Interfaces:**
- Produces: `formatPeriod(p: Period): string`. `{start:"2024-08",end:"present"}` gives `"Aug 2024 – Present"`, and `{start:"2023-12",end:"2024-08"}` gives `"Dec 2023 – Aug 2024"`. Use an en dash with spaces, en-GB month names, and UTC.

- [ ] **Step 1:** Write a failing `lib/format.test.ts` with the two cases above, plus `"2022-11"`–`"2023-05"` → `"Nov 2022 – May 2023"`.
- [ ] **Step 2:** Implement `formatPeriod`. Build the sections:
  - The timeline groups Techwire's two roles under one company.
  - `MoreProjects` uses `<picture>` with AVIF/WebP sources, `loading="lazy"`, `decoding="async"` and explicit width and height.
  - `GithubActivity` uses `<picture>` with a dark/light `<source media="(prefers-color-scheme: dark)">`, plus `width=415 height=280 loading="lazy"` and alt text, for both `stats-activity` and `stats-languages`.
- [ ] **Step 3:** Run `pnpm test && pnpm build`, then `grep -c 'loading="lazy"' out/index.html`. Expected: tests pass, and the count is ≥ (screenshot count + 2).
- [ ] **Step 4:** Commit: "Add experience, stack, projects, open source and activity".

### Task 8: `/resume` print page, PDF pipeline, stale-PDF guard

**Files:**
- Create:
  - `app/resume/page.tsx`, `components/resume/ResumeDocument.tsx`, `app/resume/print.css`;
  - `lib/content-hash.mjs`, `lib/content-hash.test.mjs`, `scripts/check-pdf.mjs` (replacing the Task 1 stub), `scripts/check-pdf.test.mjs`, `scripts/pdf.mjs`, `scripts/cdp.mjs`;
  - `public/Ravindu-Perera-Resume.pdf`, `public/resume.pdf.json`.

**Interfaces:**
- Produces:
  - `contentHash(root: string): string`: the hex SHA-256 over the sorted `content/*.ts` files that are not tests, plus `components/resume/*.tsx`. Hash each file as `path\0bytes\0`, with line endings normalized to `\n` so Windows and Linux agree.
  - `checkPdf(root): { ok: true } | { ok: false; reason: string }`.
  - `resume.pdf.json`: `{ "contentHash": string, "generatedAt": ISO, "pages": number }`.
  - `scripts/cdp.mjs`: `printPdf(url: string, out: string): Promise<{pages:number}>`. It launches the browser from `BROWSER`, or else from the first existing path among Edge on Windows, `google-chrome`, `chromium` and `chromium-browser`. It uses `--headless=new`, calls `Page.printToPDF({ preferCSSPageSize: true, printBackground: true })` and counts the `/Type /Page` objects.

- [ ] **Step 1: Write the failing tests:**
  - `lib/content-hash.test.mjs`:
    - `is stable for identical trees`.
    - `changes when a content file changes`.
    - `ignores CRLF vs LF`.
    - `ignores *.test.ts`.
    - Each case builds its tree in a temp directory.
  - `scripts/check-pdf.test.mjs`:
    - `fails when resume.pdf.json is missing`, with reason `run pnpm pdf`.
    - `fails when the hash differs`, with reason `content changed; run pnpm pdf`.
    - `passes when the hash matches and the pdf exists`.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the hash and the check. `check-pdf.mjs` exits 1 and prints the reason when the check fails.
- [ ] **Step 4:** Build the resume page.
  - A single column on A4, with `@page { size: A4; margin: 14mm 14mm }`. Sections follow the CV structure: header with name, role and links (no phone); Profile; Skills (`cvExtras.skills`); Experience; Selected Projects; Additional Projects; Volunteering; Education.
  - Entries carry `break-inside: avoid`. Print colours are near-black on white.
  - The screen view adds a "Download PDF" link, which is hidden in print.
- [ ] **Step 5:** Implement `pdf.mjs`:
  - Run `next build`.
  - Serve `out/` on an ephemeral port with `node:http`, mapping `/resume` to `/resume.html`.
  - Call `printPdf`, then write the PDF and the JSON.
  - It fails if `pages > 2`.
- [ ] **Step 6:** Run `pnpm pdf && pnpm build`. Expected: exit 0 and `pages ≤ 2`. Then edit one character in `content/profile.ts` and run `pnpm build`. Expected: exit 1 with "content changed; run pnpm pdf". Revert the edit.
- [ ] **Step 7:** Commit: "Generate the resume PDF from content and block stale PDFs".

### Task 9: SEO, social card, and full verification

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts` (both `export const dynamic = "force-static"`), `app/icon.svg`, `app/opengraph-image.png` (rendered by `scripts/og.mjs` through `scripts/cdp.mjs` screenshot mode), `scripts/og.mjs`, `scripts/verify.mjs`.
- Modify: `app/layout.tsx` (metadata: `metadataBase` `https://ravinduperera.vercel.app`, title template, description from `profile.summary`, OG/Twitter), `app/page.tsx` (JSON-LD `Person`).

**Interfaces:**
- Consumes: `scripts/cdp.mjs`. Add `screenshot(url, out, {width,height})` there.
- Produces: `scripts/verify.mjs`, a CI-free local check that serves `out/` and loads `/` at 320, 390 and 1280 in both themes. It prints a JSON report and exits 1 if any check fails:
  - `docScroll` (scrollWidth > clientWidth);
  - `overflowingElements[]` (per element, excluding `pre` and code blocks);
  - `topBarHeight` (must be ≤ 56);
  - `smallTargets[]` (visible `a, button` with a box under 44×44, inline text links excluded);
  - `reducedMotionAnimating` (count of `.packet` elements with a running animation under reduce emulation);
  - `consoleErrors[]`;
  - `missingHeadings` (expected section ids not found in the HTML).

- [ ] **Step 1:** Add the metadata, JSON-LD (`@type: Person`, name, jobTitle, `worksFor: {Organization: "Techwire Lanka"}`, `alumniOf: University of Plymouth`, `sameAs`: the non-email links), sitemap, robots and OG image.
- [ ] **Step 2:** Run `pnpm build && node scripts/verify.mjs`. Expected: exit 0 with every list empty.
- [ ] **Step 3:** Run Lighthouse (the edge-devtools MCP `lighthouse_audit`, mobile and desktop) against the locally served `out/`, plus a performance trace for LCP and CLS. Expected: Performance, Accessibility, Best Practices and SEO ≥ 95; LCP ≤ 2.0 s; CLS < 0.05. Fix and re-run until met. Record the numbers in the commit message.
- [ ] **Step 4:** Commit: "Add SEO, social card and a responsive verification script".

### Task 10: CI, repo docs, review, preview, release

**Files:**
- Create: `.github/workflows/ci.yml`, `CLAUDE.md`.
- Modify: `README.md`, replacing the template's README with a short one: what it is, commands, how to edit content, how to refresh the PDF.

- [ ] **Step 1:** `ci.yml`.
  - Triggers: `push` and `pull_request`, with `permissions: contents: read`.
  - Actions pinned by SHA: `actions/checkout`, `pnpm/action-setup`, `actions/setup-node` (`node-version: 22`, pnpm cache).
  - Steps: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
- [ ] **Step 2:** `CLAUDE.md`:
  - commands;
  - the content model;
  - the rule that content edits require `pnpm pdf`;
  - the banned-word and no-phone rules, and the reason for each;
  - brand tokens shared with the README repo;
  - mobile-first checks through `scripts/verify.mjs`.
- [ ] **Step 3:** Run the whole-branch review: one fresh reviewer on the most capable model, given this plan, the spec and `git diff main...redesign`. Fix every blocking or should-fix finding, and re-run `pnpm test && pnpm build && node scripts/verify.mjs`.
- [ ] **Step 4:** **Ask the owner**, then push `redesign`. Open the Vercel preview URL (from the GitHub deployment status) and re-run `verify.mjs` and Lighthouse against it.
- [ ] **Step 5:** **Ask the owner**, then merge `redesign` into `main` and push. Re-measure the live site: TTFB ≤ 300 ms, Lighthouse as in Task 9, no broken images. Report the owner's cleanup actions from the spec's "Rollout and cleanup".
