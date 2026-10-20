# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Ravindu Dhanushka Perera's resume site, live at https://ravinduperera.vercel.app. Vercel's GitHub integration deploys `main`, and every other branch gets a preview URL. It is a static export: Next.js 16, React 19, Tailwind CSS 4 and TypeScript, built with pnpm 11. There is no server, database or API at runtime. The repo started as a fork of `jigar-sable/next-portfolio`, but none of that code remains. The 2026-10-21 rebuild is described in `docs/superpowers/specs/2026-10-21-resume-redesign-design.md`.

## Commands

```bash
pnpm dev                    # local dev server
pnpm test                   # node --test: content validation, diagram layout, theme, format, PDF hash
node --test lib/diagram.test.ts   # one test file (Node >= 22.18 strips the types natively)
pnpm typecheck && pnpm lint
pnpm build                  # check-pdf guard, then next build -> out/
pnpm pdf                    # rebuild, print /resume to public/Ravindu-Perera-Resume.pdf (max 2 pages)
pnpm images                 # re-download sources in content/_sources/images.json -> public/img, public/icons
node scripts/og.mjs         # re-render app/opengraph-image.png
node scripts/verify.mjs     # after a build: measure out/ at 320/390/1280 in both themes; exit 1 on any failure
node scripts/verify.mjs https://<preview-url>   # the same checks against a deployed URL
```

`pdf`, `og` and `verify` drive a headless Chromium (Edge on this machine, where Chrome is not installed) over CDP with Node built-ins (`scripts/cdp.mjs`). They delete its temp profile after it exits, and every call has a timeout. Set `BROWSER` to override the executable.

## How it fits together

- **All content is typed data in `content/`**, typed by `content/schema.ts` and exported from `content/index.ts`. Components only render it. To change what the site says, edit `content/*.ts`, never JSX.
- **The validator is the guardrail.** `content/validate.ts` runs in `pnpm test`, and also at module scope in `app/page.tsx`, so `next build` itself fails (Vercel never waits for CI). It checks every string and structure, and fails on:
  - gambling vocabulary (`BANNED_WORDS`): exact `bet`/`odds`, plus stems such as `casino*`, `wager*`, `gambl*`, `lotteries`, `sportsbook` and `igaming`;
  - anything that looks like a phone number, including `(071) 010-1234` and `071.010.1234`;
  - empty text;
  - links that aren't `https:` or `mailto:`;
  - bad `YYYY-MM` periods;
  - images or icons missing from `public/`;
  - diagram edges to unknown nodes or two nodes in one cell.

  `content/content.test.ts` pins two owner rulings: the CV work history and the primary links.
- **Owner rulings, 2026-10-21. Do not reverse them without asking.**
  - Work history follows the CV (`D:/747/Claude/Ravindu Dhanushka.docx`). Techwire Lanka is the employer and 747 Live is a client, described neutrally, never in gambling terms. The old site's "Amplify Solutions" and "747 Live as employer" entries were dropped on purpose.
  - No phone number anywhere, because the PDF is public. The schema has no phone field.
  - No contact form and no backend. Contact is links only.
- **The resume PDF and the site cannot drift apart.**
  - `lib/content-hash.mjs` hashes `content/*.ts`, `components/resume/*.tsx`, `app/resume/page.tsx`, `app/resume/resume.css` and `lib/format.ts` (`SOURCES`).
  - `pnpm pdf` writes that hash to `public/resume.pdf.json`.
  - `pnpm build` runs `scripts/check-pdf.mjs` first and fails with "content changed; run pnpm pdf" if they differ.
  - So any edit to those files is followed by `pnpm pdf`, and both files are committed.
- **Images.**
  - The only photo is the portrait. `content/_sources/images.json` lists it, and `pnpm images` writes `<name>@1x|@2x.avif|.webp` to `public/img/` and the sizes to `content/_sources/image-sizes.json`.
  - Project cards have no screenshots: `components/ui/ProjectCover.tsx` draws a generated, theme-aware cover from the project's `motif` (a domain glyph), its stack logos (`lib/icons.ts` maps stack names to the vendored devicons) and its group. To add a domain, add a glyph to `GLYPHS` and a value to the `Motif` type.
  - A test makes the content's `width`/`height` match those sizes.
  - `Image.src` in content is a base path (`/img/name`); `components/ui/Picture.tsx` builds the sources.
  - Nothing is hotlinked, except the GitHub stats and snake SVGs. Those come from the profile repo's `output` branch (`ravindu0823/ravindu0823`), which rebuilds them twice a day.
- **Architecture diagrams.**
  - Each featured project carries a `diagram` (nodes on a 4×3 grid, plus edges). `lib/diagram.ts` lays it out and `ArchitectureDiagram.tsx` draws the SVG from `md` up; below `md` it shows a flow list.
  - Tests forbid diagonal edges and require horizontal edge labels to fit the 72px column gap. Put connected nodes in the same row or column, and keep horizontal labels to 9 characters or fewer.
  - A diagram names only components the CV names for that project.
- **Theme.**
  - `data-theme` on `<html>` is set before first paint by `THEME_INIT_SCRIPT` (`lib/theme.ts`, tested). The default is the system preference, falling back to dark.
  - Tailwind's `dark:` variant follows `data-theme`, not the OS.
  - The colour tokens in `app/globals.css` are shared with the GitHub README brand. The light-theme `--azure` and `--cyan` are deliberately darker, to pass WCAG AA for small text.
- **Motion is decoration only.** It is CSS and SMIL, with no JS animation library. Its resting state is the finished state, and everything stops under `prefers-reduced-motion` (`verify.mjs` checks this). Data never animates.

## UI rules (mobile first, measured)

Build at 390px first and widen with `sm:`/`md:`/`lg:`.
- The top bar is fixed at 56px (`h-14`).
- Touch targets are ≥ 44px.
- There is no horizontal page scroll at 320px. Project groups are intentional swipe rows below `sm`.
- Never fix a narrow layout by shrinking the root font.

After UI changes, run `pnpm build && node scripts/verify.mjs`. It must exit 0. Besides scroll and touch targets, it flags any box narrower than its content (outside intentional swipe rows), `aria-labelledby` pointing at missing ids, and timeline dots that are not centred on their line. Elements with class `timeline-dot` are checked, so keep that class on the dot.

## Deploy

- `pnpm-workspace.yaml` lists `packages: ["."]` because pnpm 9 refuses the file without it. Vercel may pick pnpm 9 from `lockfileVersion: '9.0'` when Corepack is off.
- `engines.node` is `>=22.18.0`.

Push a branch and check its Vercel preview with `node scripts/verify.mjs <preview-url>`. Then merge to `main`. Rollback: promote the previous deployment in Vercel, or revert the merge. The old Firebase and SendGrid environment variables on the Vercel project are no longer used.
