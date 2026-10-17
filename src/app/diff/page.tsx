import type { Metadata } from "next";
import Link from "next/link";
import { displayId, person } from "@/content/records";
import { getSnapshot, snapshots } from "@/content/snapshots";
import { DiffView } from "@/features/version-diff/diff-view";
import { compareHref } from "@/features/version-diff";

export const metadata: Metadata = {
  title: "Compare versions",
  description: `Tracked changes between two versions of ${displayId(person.id)}: deletions struck through, insertions underlined.`,
};

type Search = { from?: string | string[]; to?: string | string[] };

/** A version number from the query, if it names a snapshot. */
function version(raw: string | string[] | undefined): number | undefined {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s || !/^\d+$/.test(s)) return undefined;
  return getSnapshot(Number(s)) ? Number(s) : undefined;
}

/** The pairs offered as one-click links: each step, and the whole history. */
const PAIRS: [number, number][] = [
  ...snapshots.slice(1).map((s): [number, number] => [s.v - 1, s.v]),
  [snapshots[0].v, person.version],
];

/**
 * `/diff?from=3&to=4`: two versions of the person record as tracked changes,
 * word by word. Read on the server from the query; a missing or unknown
 * version falls back to the previous version against the current one.
 */
export default async function DiffPage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const asked = query.from !== undefined || query.to !== undefined;
  let to = version(query.to);
  let from = version(query.from);
  const fellBack = from === undefined || to === undefined;
  // keep whichever side is valid and default only the other
  if (to === undefined) to = from !== undefined && from < person.version ? person.version : from !== undefined ? from : person.version;
  if (from === undefined) from = Math.max(1, to - 1);
  const a = getSnapshot(from!)!;
  const b = getSnapshot(to!)!;
  const tag = (v: number) => `${displayId(person.id)}v${v}`;

  return (
    <div className="wrap list ft-version-diff-page">
      <h1>Compare versions</h1>
      <p className="ft-version-diff-head">
        <b>{tag(a.v)}</b> ({a.date}, {a.label}) → <b>{tag(b.v)}</b> ({b.date}, {b.label})
      </p>
      {asked && fellBack ? (
        <p className="ft-version-diff-note" role="status">
          One side of that pair isn&rsquo;t in the record, so this shows v{from} → v{to}.
        </p>
      ) : null}

      <form className="ft-version-diff-form" action="/diff" method="get">
        <label>
          From
          <select name="from" defaultValue={String(a.v)}>
            {snapshots.map((s) => (
              <option key={s.v} value={s.v}>
                v{s.v} · {s.date}
              </option>
            ))}
          </select>
        </label>
        <label>
          to
          <select name="to" defaultValue={String(b.v)}>
            {snapshots.map((s) => (
              <option key={s.v} value={s.v}>
                v{s.v} · {s.date}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn">
          Compare
        </button>
      </form>

      <nav className="ft-version-diff-pairs" aria-label="Version pairs">
        {PAIRS.map(([x, y]) =>
          x === a.v && y === b.v ? (
            <b key={`${x}-${y}`} aria-current="page">
              v{x}→v{y}
            </b>
          ) : (
            <Link key={`${x}-${y}`} href={compareHref(x, y)}>
              v{x}→v{y}
            </Link>
          ),
        )}
      </nav>

      <p className="ft-version-diff-legend">
        <del>Struck through</del>: in v{a.v}, gone by v{b.v}. <ins>Underlined</ins>: new in v{b.v}.{" "}
        {a.v === b.v ? "These are the same version, so nothing changes. " : null}
        Versions before v{person.version} are reconstructed from the résumé (<Link href={`/v/${a.v}`}>view v{a.v}</Link>
        {" · "}
        <Link href={`/v/${b.v}`}>view v{b.v}</Link>).
      </p>

      <DiffView from={a} to={b} />
    </div>
  );
}
