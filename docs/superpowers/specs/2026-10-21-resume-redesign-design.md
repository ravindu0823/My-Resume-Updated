# Resume site redesign — design

Date: 2026-10-21 · Owner: Ravindu Dhanushka Perera (`ravindu0823`) · Live: https://ravinduperera.vercel.app

## Why

The current site is a fork of the `jigar-sable/next-portfolio` template (Next 13.1, 2023 dependencies). It is slow and out of date:

- **Slow by construction.** `app/page.tsx` fetches the whole Firebase Realtime Database with `cache: "no-store"` on every request, which puts a 2.8 s TTFB on the live site (measured 2026-10-21). `HomePage.tsx` then hides everything behind a hard-coded `setTimeout(2000)` loader. On top of that come 6 web-font files and about 20 icon PNGs proxied from icons8 through `_next/image`. The hero background is a 1920px JPEG at quality 100.
- **Out of date and inconsistent.**
  - The content still lists "Amplify Solutions" and "747 Live" as employers, and lists 747 Live under "Senior Software Engineer". The owner's CV and the new GitHub profile README use a different history: Techwire Lanka is the employer and 747 Live is a client. **The owner ruled: follow the CV.**
  - The "Download resume" link points at an old PDF on Google Drive.
- **Fragile.**
  - The runtime depends on Firebase.
  - Images are hotlinked from i.ibb.co, icons8, Freepik and Drive.
  - A SendGrid mail endpoint has no input validation, no spam protection and no HTML escaping.

## Goals

1. **Fast**: static HTML from the CDN, with no data fetch at request time. Mobile Lighthouse ≥ 95 for Performance, Accessibility, Best Practices and SEO. LCP ≤ 2.0 s and CLS < 0.05 under the Lighthouse mobile preset. Homepage first-load JS ≤ 120 KB gzipped.
2. **Current and true**: content follows the CV (`D:/747/Claude/Ravindu Dhanushka.docx`) and GitHub facts that can be verified, and matches the GitHub profile README.
3. **One source of truth**: a single typed content module drives the website and the downloadable PDF resume.
4. **Modern and distinctive**: the same visual system as the GitHub README (`ravindu0823/ravindu0823`). It should read as one personal brand.
5. **Mobile first**: correct at a 390px viewport first and widened with breakpoints. Touch targets are ≥ 44px, and there is no horizontal scroll at 320px.

## Non-goals

- No CMS, no database, no admin UI. Content is edited in the repo and deployed by pushing.
- No contact form and no backend. **The owner ruled: direct links only.**
- No blog.
- No analytics beyond the two Vercel packages the site already ships (`@vercel/analytics`, `@vercel/speed-insights`).
- No new hosting or domain. It stays on the existing Vercel project and URL.

## Anti-goals (a failure even if it works)

- Getting slow again, for example from a WebGL or particle hero, heavy animation libraries, or client-side data fetching.
- Gambling vocabulary anywhere in the content: casino, betting, bet, odds, gambling, wager, lottery, jackpot. 747 Live is named as a client and described neutrally.
- Invented numbers, employers, testimonials or claims that aren't in the CV or verifiable on GitHub.
- A layout that is "responsive" but pushes the first useful content below the fold on a phone.

## Decisions

The owner made these on 2026-10-21:

| Topic | Decision |
|---|---|
| Work history | Follow the CV. Techwire Lanka: Associate SE (Dec 2023 – Aug 2024), then SE (Aug 2024 – present), with 747 Live named as a client. EXE.lk Software Engineer Intern (R&D), Nov 2022 – May 2023. Amplify Solutions and "747 Live as employer" are dropped. |
| Content storage | Typed TypeScript content in the repo, validated at build time. Images are self-hosted and pre-optimized. Static pages. |
| Contact | No form. Direct links only, so the site is fully static. |
| Resume PDF | Generated from the same content via a print-perfect `/resume` page and committed to the repo. |
| Look | Match the GitHub brand: deep navy, .NET violet, Azure blue, cyan motion accent, and an animated service-mesh hero. Dark first, with light supported. |
| PDF contact details | No phone number. Email, LinkedIn, GitHub and portfolio URL only, because the PDF is public. The content model has no phone field, so it can't be added by accident. |
| Approval | The owner approved this spec on 2026-10-21. |

These are my calls as builder. The owner can overrule them:

- **Same repository and branch strategy.** The Vercel project deploys from this repo, and there is no Vercel CLI or dashboard access from this machine. So the rebuild happens in place, on branch `redesign`. Pushing it gives a Vercel preview URL to verify, then it is merged to `main`. The GitHub "forked from" label stays.
- **Static export** (`output: "export"`). No server code, and the output is portable to any static host.
- **Package manager: pnpm**, which the repo already uses (pnpm 11.22 locally).

## Content sources (resolved in the builder check)

- **CV**, `D:/747/Claude/Ravindu Dhanushka.docx`: profile summary, skills, experience, projects, volunteering, education. It is the primary source.
- **Live site data**: content the owner published in Firebase, recovered from the live page's RSC payload on 2026-10-21 and saved as `content/_sources/live-site-2026-10-21.json`. It covers the photo, the community event projects (SFD 2023, Hackovate / Hacktoberfest 2023, Technosphere 2022) and project screenshots. It counts as owner-supplied, but only for what it actually says. No roles or dates are added to it.
- **Links**: the set already verified for the GitHub README on 2026-10-21:
  - email `dhanushka114@outlook.com`
  - LinkedIn `ravindu-dhanushka`
  - GitHub `ravindu0823`
  - X `RavinduDhanush4`
  - dev.to `ravindu0823`
  - Stack Overflow `users/16387999/night-fury`
  - TryHackMe `p/ravindu0823`
  - Instagram `_d_h_a_n_u_23`
  - Facebook `muditha.warawita`
  - Discord `https://discord.com/users/601340478104928275`

  **Primary** (shown in the hero): Download CV, Email, LinkedIn, GitHub. The rest appear in the footer.
- **Photo**: the owner's photo from the live site, `https://i.ibb.co/37cN869/YOS-7452-Cropped.png`, downloaded once and self-hosted as AVIF/WebP. The template's Freepik placeholder is not used.
- **GitHub facts**: frag-arena has 14 merged PRs, and the Dokploy PRs were submitted with none merged. Both were verified through the GitHub API on 2026-10-21.

## Content model

`content/` holds plain TypeScript modules typed by `content/schema.ts`. A section is added by adding data, not markup.

- `profile`: name, short name, role line, location, summary paragraph, photo (local path), links (email, LinkedIn, GitHub, portfolio, X, dev.to, Stack Overflow, TryHackMe, Instagram, Facebook, Discord). Each link carries a `primary` flag that decides whether it shows in the hero or only in the footer.
- `highlights`: three or four short facts taken from the CV, such as "3+ years", "First-Class BSc", "lead engineer, ~90% of 480+ commits". No computed or invented metrics.
- `experience[]`: company, role, start, end (or `present`), location (optional), bullets, and stack tags.
- `education[]` and `volunteering[]`.
- `featured[]`: the six CV "Selected Projects" plus Musify. Each has a title, role, summary, bullets, stack tags, an optional repo link, and an **architecture diagram spec** (nodes plus directed edges with labels). The diagram shows only components named in that project's CV bullets.
- `projects[]`: secondary work. These are the CV "Additional Projects", the public repositories (Farmy, Hotel Room Booking, Hospital Management, Job Application Tracker, Movie Booking, LMS, Garbage Management) and the live site's community items (SFD 2023, Hackovate / Hacktoberfest 2023, Technosphere 2022, FOSS NSBM). Each has an optional self-hosted screenshot.
- `stack[]`: the same groups as the README stack cards. Backend; Data & messaging; Cloud & DevOps; Frontend, ML & observability.
- `openSource[]`: frag-arena (14 merged PRs), Dokploy (PRs submitted, none merged), FOSS NSBM.
- `cvExtras`: CV-only blocks the PDF needs and the site may skip.
  - **Skills summary rows**: Languages; Frameworks & Libraries; Architecture & Practices; Data & Messaging; Cloud & DevOps; Tools; Soft Skills.
  - **The A-Level entry**.
  - **Builder's call**: the PDF follows the CV's structure. It is the document recruiters get, has no diagrams, and fits on two A4 pages or fewer.

**Validation**, `content/validate.ts`. It runs in `pnpm test` and as a prebuild step, and a failure fails the build:

- Required fields are non-empty.
- Every date parses, and every start date is on or before its end date.
- Links use `https:` or `mailto:`.
- Every local image path exists under `public/`.
- Diagram edges reference existing node ids.
- **The gambling-vocabulary list above appears nowhere in the content.** The neutral-wording ruling is checked in code, not left as a comment.

## Pages and sections

All of this is one page, `/`, in this order. Mobile is the base layout.

1. **Top bar**: a 56px fixed-height budget holding name, section links and a theme toggle. On a phone, the section links collapse into a menu button.
2. **Hero**:
   - A typed `$ dotnet run --project ravindu` kicker, the name with a gradient surname, the role line and location.
   - Primary actions: Download CV (PDF), Email, LinkedIn, GitHub.
   - An animated SVG service mesh (gateway → bus → identity / ledger / realtime) beside the text on desktop and below it on mobile. Pure SVG and CSS, no JS animation library, honouring `prefers-reduced-motion`.
   - The hero text is the LCP element, rendered without JS.
3. **Highlights strip.**
4. **About**: summary plus photo.
5. **Selected work**: cards with title, role, summary, stack chips and the project's architecture diagram rendered from its spec. Bullets live behind an expand control (a `<details>` element, no JS).
6. **Experience and education timeline.**
7. **Stack**: grouped tech logos, using the devicon SVGs vendored into `public/icons` (MIT, the same icons as the README).
8. **More projects**: a grid with lazy-loaded screenshots.
9. **Open source and community.**
10. **GitHub activity**: embeds the profile repo's self-generated stats cards (`raw.githubusercontent.com/ravindu0823/ravindu0823/output/stats-*-{dark,light}.svg`), lazy-loaded, so the numbers stay current with no build-time token.
11. **Contact / footer**: all links, a copy-email button (a progressive enhancement; plain `mailto:` without JS), and a last-updated date.

`/resume`: a print-first A4 layout from the same content. A visible "Download PDF" link sits on screen, `@page` rules apply in print, and the layout uses a single text column so applicant-tracking systems can parse it.

## Assets and performance

- **Images**: `scripts/images.mjs`, using `sharp` (Apache-2.0, maintained by lovell), downloads or reads each source image once. It writes AVIF and WebP at 1× and 2× with explicit dimensions. The output is committed under `public/img/`, and nothing is hotlinked at runtime except the GitHub stats cards. `next/image` runs with `unoptimized: true`, since the files are already optimized.
- **Fonts**: one variable sans plus one mono, both through `next/font` (self-hosted at build): Geist and Geist Mono.
- **JS**: React Server Components by default. Client components only for the theme toggle, the mobile menu and copy-email. No animation library: motion is CSS and SMIL.
- **Theme**: a `data-theme` attribute set by a tiny inline script in `<head>` before first paint, so there is no flash. The default is system preference, falling back to dark. The choice is stored in `localStorage`, wrapped in try/catch.
- **SEO**:
  - metadata API, a canonical URL, Open Graph and Twitter cards with a static OG image, `sitemap.xml` and `robots.txt`;
  - JSON-LD `Person` (name, jobTitle, worksFor Techwire Lanka, alumniOf University of Plymouth, sameAs links).
- **Accessibility**: semantic landmarks, a skip link, visible focus, AA contrast in both themes, and alt text from the content.

## Resume PDF pipeline

`pnpm pdf`:

1. `next build` (static export to `out/`).
2. Serve `out/` with a tiny Node `http` server (no package).
3. Drive headless Edge on Windows, or Chrome or Chromium on Linux, over CDP: `Page.printToPDF` on `/resume`. The path is auto-detected, or overridden with `BROWSER`.
4. Write `public/Ravindu-Perera-Resume.pdf`, plus `public/resume.pdf.json` holding the SHA-256 of the content modules.

**Stale-PDF guard**: the prebuild check recomputes the content hash and fails the build if it differs from `resume.pdf.json`. The error message is "content changed; run `pnpm pdf`". A deploy can therefore never ship a resume PDF that disagrees with the website.

## Tooling and quality gates

- **Dependencies** (all MIT unless noted, current stable versions checked on npm 2026-10-21):
  - runtime: `next@16.4.2`, `react@19.3.1`, `react-dom@19.3.1`, `@vercel/analytics@2.0.1`, `@vercel/speed-insights@2.0.0` (Apache-2.0);
  - dev: `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, `typescript@5.9.3` (Apache-2.0; 5.x, not 7.x, until Next supports the native compiler), `@types/*`, `sharp@0.35.5` (Apache-2.0), `eslint@10`, `eslint-config-next@16.4.2`.
  - **Removed**: firebase, @sendgrid/mail, axios, framer-motion, react-scroll, react-toastify, typewriter-effect, fast-average-color, react-intersection-observer, next-themes, react-icons, and @next/font (folded into next/font).
- **Scripts**:
  - `pnpm dev`;
  - `pnpm build`: validate content, check the PDF hash, then `next build`;
  - `pnpm test`: content validation, diagram specs and the PDF hash, with `node --test`;
  - `pnpm lint`, `pnpm typecheck`, `pnpm pdf`, `pnpm images`.
- **CI** (`.github/workflows/ci.yml`, actions pinned by SHA): install, typecheck, lint, test and build on pushes and PRs. Vercel builds independently.
- **Repo `CLAUDE.md`**: commands, the content model, the PDF rule and the wording rule.

## Verification (definition of done)

- `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build` all pass locally and in CI.
- Measured in headless Edge, mobile and desktop, both themes:
  - Lighthouse numbers meet Goal 1;
  - no horizontal scroll at 320px and 390px;
  - the first content (the hero name) starts below a top bar of ≤ 56px;
  - no visible touch target under 44px;
  - no console errors.
- `/resume` prints to two A4 pages or fewer, and its text extracts cleanly.
- The Vercel preview of branch `redesign` is checked end to end before the merge to `main`.
- After the merge, the live URL is re-measured. TTFB ≤ 300 ms, measured from this machine and compared against the 2.8 s baseline.

## Rollout and cleanup

1. Build on `redesign`. Push with the owner's approval to get a Vercel preview, verify it, then merge to `main` with approval.
2. After going live, the owner removes the unused Vercel env vars (`NEXT_PUBLIC_FIREBASE_*`, `SENDGRID_API_KEY`, `MAIL_TO`, `MAIL_FROM`). I can't reach the Vercel dashboard.
3. Firebase: the old data was publicly readable at `<db>/.json` with no auth, which is how `page.tsx` fetched it. Once the site no longer uses it, lock the rules down or delete the project. This is the owner's action.
4. **Rollback**: Vercel keeps the previous production deployment, so "Promote" in the dashboard or a revert of the merge commit restores the old site.

## Open to the builder

Exact visual details within the brand system, the copy edits needed for brevity (staying faithful to the CV), the order of cards inside sections, and the micro-interactions.
