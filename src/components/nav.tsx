"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { useUI } from "@/components/ui-provider";

const noop = () => () => {};
const isMacClient = () => /Mac|iPhone|iPad/.test(navigator.platform);
const isMacServer = () => true;

const LINKS = [
  { href: "/about", label: "About", key: "A" },
  { href: "/projects", label: "Projects", key: "P" },
  { href: "/notes", label: "Notes", key: "N" },
  { href: "/ask", label: "Ask", key: "/" },
];

export function Nav() {
  const pathname = usePathname();
  const { openPalette } = useUI();
  const modKey = useSyncExternalStore(noop, isMacClient, isMacServer) ? "⌘" : "Ctrl";

  return (
    <header className="mx-auto w-full max-w-[42rem] px-5 pt-6 sm:pt-8">
      <nav aria-label="Primary" className="flex items-baseline justify-between gap-4">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="text-sm font-medium text-fg hover:opacity-70 transition-opacity"
        >
          {site.name}
        </Link>

        <ul className="flex items-baseline gap-4 sm:gap-5">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  title={`${l.label} (${l.key})`}
                  className={`text-sm underline-offset-4 transition-colors ${
                    active
                      ? "text-fg underline decoration-fg-3"
                      : "text-fg-2 hover:text-fg"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="font-mono text-[11px] text-fg-3 hover:text-fg transition-colors"
            >
              {modKey}K
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
