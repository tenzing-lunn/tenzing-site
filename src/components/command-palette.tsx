"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/dialog";
import { useUI } from "@/components/ui-provider";
import { buildIndex, type IndexEntry } from "@/lib/index";
import { fuzzyScore } from "@/lib/fuzzy";

const INDEX = buildIndex();

export function CommandPalette() {
  const { overlay, closeOverlay } = useUI();
  const open = overlay === "palette";

  return (
    <Dialog
      open={open}
      onClose={closeOverlay}
      label="Command palette"
      className="items-start justify-center pt-[12vh] sm:pt-[18vh]"
    >
      {/* Mounted fresh on every open, so query/selection reset naturally. */}
      <PaletteBody onClose={closeOverlay} />
    </Dialog>
  );
}

function PaletteBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => search(query), [query]);

  // Keep the active row in view.
  useEffect(() => {
    const row = listRef.current?.children[active] as HTMLElement | undefined;
    row?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const select = (entry: IndexEntry | undefined) => {
    if (!entry) return;
    onClose();
    if (entry.external) window.open(entry.href, "_blank", "noopener,noreferrer");
    else router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[active]);
    }
  };

  const activeEntry = results[active];

  return (
    <div className="mx-4 w-full max-w-[34rem] border border-border-strong bg-bg" onKeyDown={onKeyDown}>
      <div className="px-4 pt-4 pb-1 font-mono text-xs text-fg-3">Where would you like to go?</div>
      <div className="flex items-center gap-2 px-4 pb-3">
        <span className="font-mono text-fg-3" aria-hidden>
          ❯
        </span>
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-results"
          aria-activedescendant={activeEntry ? `palette-${activeEntry.id}` : undefined}
          aria-autocomplete="list"
          aria-label="Search"
          autoComplete="off"
          spellCheck={false}
          placeholder="type to search"
          className="w-full bg-transparent font-mono text-sm text-fg placeholder:text-fg-3 focus:outline-none"
        />
      </div>

      <ul
        ref={listRef}
        id="palette-results"
        role="listbox"
        aria-label="Results"
        className="max-h-[50vh] overflow-y-auto border-t border-border py-1"
      >
        {results.length === 0 ? (
          <li className="px-4 py-3 font-mono text-xs text-fg-3">no matches</li>
        ) : (
          results.map((entry, i) => (
            <li
              key={entry.id}
              id={`palette-${entry.id}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => select(entry)}
              className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-1.5 text-sm ${
                i === active ? "bg-selection text-fg" : "text-fg-2"
              }`}
            >
              <span className="flex min-w-0 items-baseline gap-3">
                <span className="w-12 shrink-0 font-mono text-[11px] text-fg-3">{entry.kind}</span>
                <span className="truncate">{entry.title}</span>
              </span>
              {entry.meta ? (
                <span className="shrink-0 font-mono text-[11px] text-fg-3">{entry.meta}</span>
              ) : null}
            </li>
          ))
        )}
      </ul>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border px-4 py-2 font-mono text-[11px] text-fg-3">
        <span>↑ ↓ to move</span>
        <span>↵ to open</span>
        <span>esc to close</span>
      </div>
    </div>
  );
}

function search(query: string): IndexEntry[] {
  const q = query.trim();
  if (!q) return INDEX;
  return INDEX.map((entry) => {
    const a = fuzzyScore(q, entry.title);
    const b = entry.keywords ? fuzzyScore(q, entry.keywords) : null;
    const score = Math.max(a ?? -Infinity, b !== null ? b - 20 : -Infinity);
    return { entry, score };
  })
    .filter((r) => r.score > -Infinity)
    .sort((x, y) => y.score - x.score)
    .map((r) => r.entry);
}
