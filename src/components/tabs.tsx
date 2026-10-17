"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Tab = { id: string; label: string; panel: ReactNode };

const OPEN_EVENT = "tools:open";

/** Opens a Tools tab by id from anywhere on the page (the `g` key uses this). */
export function openTool(id: string) {
  window.dispatchEvent(new CustomEvent<string>(OPEN_EVENT, { detail: id }));
}

/**
 * Folder tabs along a 1px rule (the Tools block on the home page). An
 * accessible tablist: arrows, Home and End move between tabs. Every panel stays
 * mounted and inactive ones are hidden. Each panel's id is its tab's id, so
 * `/#graph` opens the Graph tab, and openTool("graph") does the same in place.
 */
export function Tabs({ tabs, label, initial }: { tabs: Tab[]; label: string; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const ids = tabs.map((t) => t.id).join(" ");

  useEffect(() => {
    const list = ids.split(" ");
    const show = (id: string, focus: boolean) => {
      const i = list.indexOf(id);
      if (i === -1) return;
      setActive(id);
      const tab = refs.current[i];
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (focus) tab?.focus({ preventScroll: true });
      tab?.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
    };
    const fromHash = () => show(decodeURIComponent(location.hash.slice(1)), false);
    const onOpen = (e: Event) => show((e as CustomEvent<string>).detail, true);
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [ids]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const to = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (to === -1) return;
    e.preventDefault();
    setActive(tabs[to].id);
    refs.current[to]?.focus();
  };

  return (
    <div data-tools>
      <div className="tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            className="tab"
            aria-selected={active === t.id}
            aria-controls={t.id}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={t.id} role="tabpanel" aria-labelledby={`tab-${t.id}`} className="panel" hidden={active !== t.id}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}
