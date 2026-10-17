"use client";

import { useEffect, useRef, useState } from "react";
import { playBand } from "@/lib/band";
import { displayId, person, submissions } from "@/content/records";
import { INTRO_KEY } from "@/components/intro-boot";

/** How long the record "compiles" before the loader fades, in seconds. */
const SECONDS = 3;
/** When each log line reports ok, in ms (on the beat). */
const LOG_AT = [600, 1300, 2000];
const LOG = [
  `fetching ${displayId(person.id)}v${person.version} …`,
  `resolving ${submissions.length} submissions …`,
  "typesetting abstract …",
];

let played = false;

/**
 * "Compiling the record": the first time the home page loads in a session,
 * the four drummers sit down at their congas in a small canvas while three log
 * lines report ok and a 1px line fills. Then it fades and the masthead's rule
 * draws in from the left. Any key or a click skips it; without JS the CSS
 * clears it after 5s.
 */
export function Intro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const skip = useRef(() => {});
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">(played ? "gone" : "playing");
  const [lines, setLines] = useState(0);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    played = true;
    if (!ref.current || document.documentElement.classList.contains("no-intro")) {
      const t = window.setTimeout(() => setPhase("gone"));
      return () => window.clearTimeout(t);
    }
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // storage blocked: the boot script then skips the loader anyway
    }

    const stop = playBand(ref.current, { seconds: Infinity, sitAt: (i) => 0.8 + i * 0.3, popAt: (i) => 0.15 + i * 0.14 });
    const timers = LOG_AT.map((ms, i) => window.setTimeout(() => setLines(i + 1), ms));
    const fill = requestAnimationFrame(() => setFilling(true));
    let gone = 0;
    const leave = () => {
      window.clearTimeout(auto);
      window.removeEventListener("keydown", onKey, true);
      skip.current = () => {};
      setPhase("leaving");
      gone = window.setTimeout(() => {
        setPhase("gone");
        document.querySelector(".hair")?.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
          duration: 400,
          easing: "cubic-bezier(.2,.8,.2,1)",
        });
      }, 500);
    };
    // The skipping key is consumed here, in the capture phase, so "/", "c" or "g"
    // doesn't also open the palette, the cite modal or the graph behind the fade.
    const onKey = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (!e.metaKey && !e.ctrlKey && !e.altKey) e.preventDefault();
      leave();
    };
    const auto = window.setTimeout(leave, SECONDS * 1000);
    window.addEventListener("keydown", onKey, true);
    skip.current = leave;
    return () => {
      stop();
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(fill);
      window.clearTimeout(auto);
      window.clearTimeout(gone);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={phase === "leaving" ? "loader out" : "loader"} aria-hidden="true" onClick={() => skip.current()}>
      <div className="loader-in">
        <canvas ref={ref} />
        <div className={filling ? "bar go" : "bar"}>
          <i />
        </div>
        <ul className="log">
          {LOG.map((line, i) => (
            <li key={line} className={i < lines ? "on" : undefined}>
              <span>{line}</span>
              <span>ok</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="label skip">press any key</span>
    </div>
  );
}
