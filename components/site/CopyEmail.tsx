"use client";

import { useEffect, useRef, useState } from "react";

// Progressive enhancement: hidden in the static HTML, shown once JS confirms the clipboard API.
export function CopyEmail({ email }: { email: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current && navigator.clipboard) ref.current.hidden = false;
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      hidden
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm text-muted transition-colors hover:border-cyan hover:text-ink"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
