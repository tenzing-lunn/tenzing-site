"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { site } from "@/content/site";
import { Clock } from "@/components/clock";

const LINKS: { href: string; label: string; key?: string }[] = [
  { href: "/about", label: "About", key: "A" },
  { href: "/projects", label: "Work", key: "P" },
  { href: "/now", label: "Now" },
  { href: "/ask", label: "Ask", key: "/" },
  { href: "/resume", label: "Résumé", key: "R" },
];

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#/*+";

/** Letters shuffle for a moment, then settle back into the word, left to right. */
function scramble(el: HTMLElement) {
  const text = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = text;
  let n = 0;
  const run = () => {
    el.textContent = [...text].map((c, i) => (i < n / 2 || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    if (n++ < text.length * 2) requestAnimationFrame(run);
    else el.textContent = text;
  };
  run();
}

/**
 * One line across the top, in white with difference blending so it reads on
 * both paper and ink. Going to another page passes a curtain of ink over the
 * screen with that page's name on it.
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [curtain, setCurtain] = useState("");
  const [run, setRun] = useState(0);
  const timer = useRef(0);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || pathname === href) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    setCurtain(label);
    setRun((r) => r + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => router.push(href), 500);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-20 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 px-5 pt-4 pb-3 text-white mix-blend-difference sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-[4vw] sm:pt-5">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="text-sm font-medium" onMouseEnter={(e) => scramble(e.currentTarget)} onClick={(e) => go(e, "/", site.name)}>
          {site.name}
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] sm:order-last sm:justify-self-end">
          NYC <Clock seconds />
        </span>
        <nav aria-label="Primary" className="w-full sm:w-auto">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm sm:gap-x-6">
            {LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    title={l.key ? `${l.label} (${l.key})` : undefined}
                    onMouseEnter={(e) => scramble(e.currentTarget)}
                    onClick={(e) => go(e, l.href, l.label)}
                    className={`underline-offset-4 ${active ? "underline" : "hover:underline"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <div key={run} className={`curtain ${run ? "go" : ""}`} aria-hidden="true">
        <b className="absolute bottom-[5vh] left-5 text-[clamp(40px,8vw,120px)] leading-none font-semibold tracking-[-0.05em] sm:left-[4vw]">{curtain}</b>
      </div>
    </>
  );
}
