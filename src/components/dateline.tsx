import type { ReactNode } from "react";

/**
 * The bracketed line above a record's title, in arXiv's exact shape:
 * `[Submitted Aug 2023 (v1), last revised 17 Sep 2026 (this version, v4)]`.
 * Month precision unless a day is actually known. `note` replaces the
 * revision clause, e.g. "to GenAI4Health @ NeurIPS 2026: decision pending".
 */
export function Dateline({
  submitted,
  firstHref,
  revised,
  version,
  note,
}: {
  submitted: string;
  /** Where "(v1)" links to, if anywhere. */
  firstHref?: string;
  revised?: string;
  version?: number;
  note?: ReactNode;
}) {
  const v1 = firstHref ? <a href={firstHref}>v1</a> : "v1";
  return (
    <p className="dateline">
      [Submitted {submitted} ({v1})
      {note ? <> {note}</> : revised && version && version > 1 ? `, last revised ${revised} (this version, v${version})` : null}]
    </p>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-17" → "17 Sep 2026", without the Date constructor. */
export function datelineDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** A record's start month from its ID: "2512.00001" → "Dec 2025". */
export function idMonth(id: string) {
  const yy = Number(id.slice(0, 2));
  const mm = Number(id.slice(2, 4));
  return `${MONTHS[mm - 1]} ${2000 + yy}`;
}
