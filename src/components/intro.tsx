"use client";

import { useEffect, useRef, useState } from "react";
import { playBand } from "@/lib/band";

/** How long the band plays before the page slides in, in seconds. */
const SECONDS = 2.7;

let played = false;

/** Tells the page the intro is out of the way, so the name can rise in. */
const ready = () => document.documentElement.classList.add("ready");

/**
 * The first time the home page loads: four congas pop up, the drummers sit
 * down at them one after another on a roll, then the page slides up over
 * them. Any key or a click skips it. Without JS the CSS still clears it away.
 */
export function Intro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const skip = useRef(() => {});
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">(played ? "gone" : "playing");

  useEffect(() => {
    played = true;
    // coming back to the home page, or with motion turned down: no intro
    if (!ref.current || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ready();
      const t = window.setTimeout(() => setPhase("gone"));
      return () => window.clearTimeout(t);
    }
    const stop = playBand(ref.current, { seconds: SECONDS + 1, sitAt: (i) => 0.8 + i * 0.3, popAt: (i) => 0.15 + i * 0.14 });
    let gone = 0;
    const leave = () => {
      window.clearTimeout(auto);
      window.removeEventListener("keydown", leave);
      skip.current = () => {};
      setPhase("leaving");
      window.setTimeout(ready, 250);
      gone = window.setTimeout(() => setPhase("gone"), 1100);
    };
    const auto = window.setTimeout(leave, SECONDS * 1000);
    window.addEventListener("keydown", leave);
    skip.current = leave;
    return () => {
      stop();
      window.clearTimeout(auto);
      window.clearTimeout(gone);
      window.removeEventListener("keydown", leave);
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={phase === "leaving" ? "intro gone" : "intro"} aria-hidden="true" onClick={() => skip.current()}>
      <canvas ref={ref} className="block w-[min(340px,74vw)]" />
      <span className="absolute right-6 bottom-6 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">press any key</span>
    </div>
  );
}
