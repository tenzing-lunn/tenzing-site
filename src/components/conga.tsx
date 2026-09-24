"use client";

import { useEffect, useRef, useState } from "react";
import { playBand } from "@/lib/band";
import { isTypingTarget } from "@/components/ui-provider";

/** Type "conga" anywhere and the band from the intro pops up and plays for a bit. */
export function Conga() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === "conga") setOn(true);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!on || !ref.current) return;
    const stop = playBand(ref.current, { seconds: Infinity, sitAt: (i) => 0.3 + i * 0.25, popAt: (i) => i * 0.08 });
    const hide = window.setTimeout(() => setOn(false), 5000);
    return () => {
      window.clearTimeout(hide);
      window.setTimeout(stop, 700);
    };
  }, [on]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`fixed bottom-0 left-1/2 z-70 w-[min(300px,70vw)] -translate-x-1/2 border border-b-0 border-border bg-bg transition-transform duration-600 ease-[cubic-bezier(.2,1.3,.4,1)] ${on ? "translate-y-0" : "translate-y-[110%]"}`}
    />
  );
}
