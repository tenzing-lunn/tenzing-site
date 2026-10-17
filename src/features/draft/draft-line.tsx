"use client";

import { Fragment, useEffect, useState } from "react";
import type { Draft } from "./types";

type Shown = Exclude<Draft, { none: true }>;

/** Fetches /api/draft once and renders one .hist row, or nothing at all. */
export function DraftLine({ next }: { next: number }) {
  const [draft, setDraft] = useState<Shown | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/draft", { signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Draft>) : null))
      .then((d) => {
        if (d && !("none" in d) && d.pushes > 0) setDraft(d);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (!draft) return null;
  const n = draft.pushes;

  return (
    <ul className="hist ft-draft">
      <li>
        <span className="v">[v{next}]</span>
        <span className="d">draft</span>
        {n} {n === 1 ? "change" : "changes"} this week
        {draft.repos.length > 0 ? " · " : null}
        {draft.repos.map((full, i) => (
          <Fragment key={full}>
            {i > 0 ? ", " : null}
            <a
              className="ft-draft-repo"
              href={`https://github.com/${full}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${full} on GitHub (opens in a new tab)`}
            >
              {full.split("/")[1]}
            </a>
          </Fragment>
        ))}
      </li>
    </ul>
  );
}
