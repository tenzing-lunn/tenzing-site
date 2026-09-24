"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small dot that follows the pointer and grows over things you can use.
 * Anything with data-cursor="word" makes it large with that word inside.
 * Only on devices with a fine pointer; everywhere else the normal cursor stays.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("");
  const [size, setSize] = useState<"" | "link" | "big">("");

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setOn(true);
    };
    const over = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const named = el?.closest<HTMLElement>("[data-cursor]");
      const usable = el?.closest("a, button, input, textarea, summary, label");
      setSize(named ? "big" : usable ? "link" : "");
      setLabel(named?.dataset.cursor ?? "");
    };
    const loop = () => {
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      if (ref.current) ref.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    return () => {
      root.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div ref={ref} className={`cursor ${size}`} hidden={!on} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
