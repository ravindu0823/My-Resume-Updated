import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-tile/60 px-2.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
