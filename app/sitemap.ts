import type { MetadataRoute } from "next";
import { content } from "@/content/index.ts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${content.updated}T00:00:00Z`);
  return [
    { url: "https://ravinduperera.vercel.app/", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: "https://ravinduperera.vercel.app/resume", lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
