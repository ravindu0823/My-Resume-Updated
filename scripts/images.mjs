// Downloads each source image once and writes self-hosted AVIF + WebP at 1x and 2x, then vendors
// the devicon SVGs. Outputs are committed: the site never hotlinks an image at runtime.
//   node scripts/images.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(join(root, "content/_sources/images.json"), "utf8"));
const imgDir = join(root, "public/img");
const iconDir = join(root, "public/icons");
await mkdir(imgDir, { recursive: true });
await mkdir(iconDir, { recursive: true });

async function load(source) {
  if (!/^https:\/\//.test(source)) return readFile(join(root, source));
  const res = await fetch(source);
  if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const sizes = {};
for (const { name, source, width } of manifest.images) {
  const input = await load(source);
  const meta = await sharp(input).rotate().metadata();
  for (const [suffix, target] of [["@1x", width], ["@2x", width * 2]]) {
    // Never upscale: a small source gives a 2x file at its own size.
    const w = Math.min(target, meta.width);
    const base = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    const avif = await base.clone().avif({ quality: 55, effort: 6 }).toBuffer({ resolveWithObject: true });
    const webp = await base.clone().webp({ quality: 72 }).toBuffer({ resolveWithObject: true });
    await writeFile(join(imgDir, `${name}${suffix}.avif`), avif.data);
    await writeFile(join(imgDir, `${name}${suffix}.webp`), webp.data);
    if (suffix === "@1x") sizes[name] = { width: avif.info.width, height: avif.info.height };
    console.log(`${name}${suffix}: ${avif.info.width}x${avif.info.height} avif ${avif.data.length}B webp ${webp.data.length}B`);
  }
}
await writeFile(join(root, "content/_sources/image-sizes.json"), JSON.stringify(sizes, null, 2) + "\n");

for (const { id, variant = "original" } of manifest.icons) {
  const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/${id}/${id}-${variant}.svg`;
  const svg = (await load(url)).toString("utf8");
  if (!svg.includes("<svg")) throw new Error(`${url}: not an SVG`);
  await writeFile(join(iconDir, `${id}.svg`), svg);
}
console.log(`icons: ${manifest.icons.length} written to public/icons`);
