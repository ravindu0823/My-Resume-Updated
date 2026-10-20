# ravinduperera.vercel.app

The resume site of **Ravindu Dhanushka Perera**, Software Engineer (.NET & Azure).

It is a static site built with Next.js 16, React 19 and Tailwind CSS 4. All content lives in typed files under `content/`. The site and the downloadable PDF resume are both generated from that content, and the build fails if the PDF is out of date.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # content validation and unit tests
pnpm build        # static export to out/
```

## Edit content

1. Change the data in `content/*.ts`.
2. Run `pnpm pdf` to regenerate `public/Ravindu-Perera-Resume.pdf`. It must stay within 2 pages.
3. Run `pnpm test && pnpm build && node scripts/verify.mjs`.
4. Commit everything, including the PDF and `public/resume.pdf.json`.

To add or replace an image, list it in `content/_sources/images.json` and run `pnpm images`.

See `CLAUDE.md` for how it fits together.
