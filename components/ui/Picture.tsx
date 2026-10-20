import type { Image } from "@/content/schema.ts";

/** Self-hosted AVIF with a WebP fallback at 1x/2x density. Explicit width/height reserve space (no CLS). */
export function Picture({
  image,
  className,
  priority = false,
}: {
  image: Image;
  className?: string;
  priority?: boolean;
}) {
  const set = (ext: string) => `${image.src}@1x.${ext} 1x, ${image.src}@2x.${ext} 2x`;
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} />
      <source type="image/webp" srcSet={set("webp")} />
      {/* Plain <img>: files are pre-optimized, and next/image adds nothing in a static export. */}
      <img
        src={`${image.src}@1x.webp`}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
