"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Dialog } from "@/components/dialog";
import { useUI } from "@/components/ui-provider";
import { buildIndex, type IndexEntry } from "@/lib/index";
import { fuzzyScore } from "@/lib/fuzzy";
import { parseQuery, search, type Mark } from "@/lib/query";

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

  const hits = useMemo(() => search(INDEX, query, fuzzyScore), [query]);
  const results = hits.map((h) => h.entry);
  // Shown in the footer when operators were dropped for plain fuzzy search.
  const syntaxError = useMemo(() => parseQuery(query.trim()).error, [query]);

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
          placeholder="search, or try cat:cs.SE status:rev"
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
        {hits.length === 0 ? (
          <li className="px-4 py-3 font-mono text-xs text-fg-3">no matches</li>
        ) : (
          hits.map(({ entry, marks }, i) => (
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
                <span className="truncate">
                  <Marked text={entry.title} marks={marks} />
                </span>
              </span>
              <span className="flex shrink-0 items-baseline gap-2">
                {entry.status ? <Badge status={entry.status} /> : null}
                {entry.meta ? (
                  // Next to a badge the ID would squeeze the title on a phone.
                  <span className={`font-mono text-[11px] text-fg-3 ${entry.status ? "hidden sm:inline" : ""}`}>
                    {entry.meta}
                  </span>
                ) : null}
              </span>
            </li>
          ))
        )}
      </ul>

      <span role="status" className="sr-only">
        {query.trim() ? `${hits.length} ${hits.length === 1 ? "result" : "results"}` : ""}
      </span>

      <div className="border-t border-border px-4 py-2 font-mono text-[11px] text-fg-3">
        <p className="truncate" title="Operators: ti: au: cat: status: year: id:. Terms are ANDed; quote values with spaces.">
          {syntaxError ? (
            <>operators ignored ({syntaxError}); fuzzy match</>
          ) : (
            <>ti: au: cat:cs.SE status:rev year:2025 id: · AND implied · &quot;quote&quot; phrases</>
          )}
        </p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>↑ ↓ to move</span>
          <span>↵ to open</span>
          <span>esc to close</span>
        </p>
      </div>
    </div>
  );
}

/** The title with each matched range underlined in ink. */
function Marked({ text, marks }: { text: string; marks: Mark[] }) {
  if (marks.length === 0) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let at = 0;
  for (const [start, end] of marks) {
    if (start > at) parts.push(text.slice(at, start));
    parts.push(
      <span key={start} className="text-fg underline decoration-ink decoration-1 underline-offset-[3px]">
        {text.slice(start, end)}
      </span>,
    );
    at = end;
  }
  if (at < text.length) parts.push(text.slice(at));
  return <>{parts}</>;
}
