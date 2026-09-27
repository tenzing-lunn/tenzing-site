"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/content/projects";

/**
 * Projects, one per row. Pointing at a row fills it with ink, and a card with
 * what it is follows the cursor. Each row opens the full write-up.
 */
export function WorkList() {
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // the card trails the pointer a little, so it feels like it's being carried
  useEffect(() => {
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      if (card.current) card.current.style.transform = `translate(${cx + 24}px, ${cy + 24}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    loop();
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const shown = active === null ? null : projects[active];
  return (
    <>
      <ol className="border-t border-border" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-border">
            <Link
              href={`/projects/${p.slug}`}
              data-cursor="open"
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              className="ink-row grid grid-cols-[44px_1fr_auto] items-baseline gap-x-2 px-3 py-5 sm:grid-cols-[60px_1fr_auto]"
            >
              <span className="font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-[clamp(20px,2.4vw,34px)] leading-[1.1] font-medium tracking-[-0.03em]">{p.name}</span>
                {p.proof ? <span className="mt-1.5 block text-sm opacity-60">{p.proof}</span> : null}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-60">{p.status ?? p.year}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div
        ref={card}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-30 w-[280px] border border-fg bg-bg px-[18px] py-4 transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
      >
        {shown ? (
          <>
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
              {shown.year}
              {shown.status ? ` · ${shown.status}` : ""}
            </span>
            <p className="mt-2 text-sm">{shown.description}</p>
          </>
        ) : null}
      </div>
    </>
  );
}
