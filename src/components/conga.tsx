"use client";

import { useEffect, useRef, useState } from "react";
import { playBand } from "@/lib/band";

/**
 * Type "conga" anywhere and the band from the intro pops up and plays for a
 * bit. The keyboard registry (lib/shortcuts.ts) spots the word and fires a
 * "conga" event, so its letters never trigger other shortcuts.
 */
export function Conga() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const play = () => setOn(true);
    addEventListener("conga", play);
    return () => removeEventListener("conga", play);
  }, []);

  useEffect(() => {
    if (!on || !ref.current) return;
    // with motion turned down the band is drawn once, already seated, and holds still
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = still
      ? playBand(ref.current, { seconds: 0, sitAt: () => -1, popAt: () => -1 })
      : playBand(ref.current, { seconds: Infinity, sitAt: (i) => 0.3 + i * 0.25, popAt: (i) => i * 0.08 });
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
      className={`fixed bottom-0 left-1/2 z-70 w-[200px] -translate-x-1/2 border border-b-0 border-border bg-bg transition-transform duration-600 ease-[cubic-bezier(.2,1.3,.4,1)] ${on ? "translate-y-0" : "translate-y-[110%]"}`}
    />
  );
}
