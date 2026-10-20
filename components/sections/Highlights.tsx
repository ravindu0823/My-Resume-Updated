import type { Highlight } from "@/content/schema.ts";

export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {items.map((h) => (
          <li key={h.label} className="bg-surface p-4 sm:p-5">
            <p className="bg-gradient-to-r from-violet to-azure bg-clip-text text-xl font-bold text-transparent sm:text-2xl">{h.value}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{h.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
