import { MobileMenu } from "./MobileMenu.tsx";
import { SECTION_LINKS } from "./nav.ts";
import { ThemeToggle } from "./ThemeToggle.tsx";

// One bar, fixed 56px (h-14). Anything that does not fit lives in the menu.
export function TopBar({ name }: { name: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between gap-2 px-4 sm:px-6">
        <a href="#top" className="flex min-h-11 items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-gradient-to-br from-violet to-azure shadow-[0_0_12px] shadow-cyan/50" />
          {name}
        </a>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center">
            {SECTION_LINKS.filter((l) => l.primary).map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-muted transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
