"use client";

import { useEffect, useRef } from "react";

/**
 * A section that marks itself .in the first time it scrolls into view, which
 * lets its heading and contents rise into place (see globals.css).
 */
export function Reveal({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={`reveal ${className ?? ""}`}>
      {children}
    </section>
  );
}
