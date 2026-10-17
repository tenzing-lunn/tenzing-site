"use client";

import { useSyncExternalStore } from "react";
import { useShortcut } from "@/lib/shortcuts";
import { TLDR_KEY } from "./boot";
import "./tldr.css";

const EVENT = "tldr:change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
const isOn = () => document.documentElement.classList.contains("tldr");
// The server can't see localStorage; boot.ts has the class right before paint.
const serverOn = () => false;

/** Flips the root class, remembers it, and tells every mounted switch. */
function toggle() {
  const on = !isOn();
  document.documentElement.classList.toggle("tldr", on);
  try {
    localStorage.setItem(TLDR_KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { on } }));
}

/**
 * The TL;DR switch. The state is the class `tldr` on <html> plus a
 * `tldr:change` event; boot.ts sets the class before paint. Mounted in the
 * sidebars of / and /list, and in the masthead on mobile.
 *
 * TL;DR mode hides every [data-detail] and keeps [data-summary], so the record
 * reads in about one screen. `t` flips it from anywhere.
 */
export function TldrToggle() {
  const on = useSyncExternalStore(subscribe, isOn, serverOn);
  // Two switches can be mounted at once; consuming the key keeps it one flip.
  useShortcut("t", () => {
    toggle();
    return true;
  });

  return (
    <div className="side ft-tldr">
      <button
        type="button"
        className="tg ft-tldr-tg"
        aria-pressed={on}
        aria-keyshortcuts="t"
        title="Summaries only: hide the details (t)"
        onClick={toggle}
      >
        <i aria-hidden="true" />
        TL;DR
        <small aria-hidden="true">(t)</small>
      </button>
    </div>
  );
}
