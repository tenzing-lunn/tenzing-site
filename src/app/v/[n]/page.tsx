import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { citeAs, displayId, getRecord, person, serialOf, type ArchiveRecord } from "@/content/records";
import { abstractSource, getSnapshot, snapshots, sourcesOf } from "@/content/snapshots";
import { Dateline, datelineDate } from "@/components/dateline";
import { HoverCite } from "@/components/hover-cite";
import { Metatable } from "@/components/metatable";
import { Entry } from "@/components/entry";
import { Sidebar, SideBlock } from "@/components/side-block";
import { SubmissionHistory, compareHref } from "@/features/version-diff";

type Params = { n: string };

/** One page per version, v1–v4; anything else is the arXiv-style 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return snapshots.map((s) => ({ n: String(s.v) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { n } = await params;
  const s = getSnapshot(Number(n));
  if (!s) return {};
  return {
    title: `${displayId(person.id)}v${s.v}: ${person.title}`,
    description: `${person.title}, as of v${s.v} (${s.date}): ${s.label}.`,
  };
}

/** The abstract, with each `[yymm.nnnnn]` turned into a hover citation. */
function Abstract({ text }: { text: string }) {
  return text.split(/\[(\d{4}\.\d{5})\]/).map((part, i) => (i % 2 ? <HoverCite key={i} id={part} n={serialOf(part)} /> : part));
}

/** The person record as of one version: its affiliation, abstract and the submissions that existed by then. */
export default async function VersionPage({ params }: { params: Promise<Params> }) {
  const { n } = await params;
  const s = getSnapshot(Number(n));
  if (!s) notFound();

  const latest = person.version;
  const primary = person.subjects[0];
  const cite = citeAs(person.id, primary, s.v);
  // newest first, as on a listing
  const entries = s.submissions
    .map((x) => getRecord(x.value))
    .filter((r): r is ArchiveRecord => Boolean(r))
    .sort((x, y) => y.id.localeCompare(x.id));

  return (
    <div className="wrap abs">
      <div className="min-w-0">
        <Dateline
          submitted={person.versions[0].date}
          firstHref={s.v === 1 ? undefined : "/v/1"}
          // the live version carries the day it was last revised, as on the home page
          revised={s.v === latest ? datelineDate(person.revised) : s.v > 1 ? s.date : undefined}
          version={s.v}
        />
        <h1 className="hero">{person.title}</h1>
        <p className="affil">{s.affiliation.value.join(" · ")}</p>
        <p className="ft-version-diff-note">
          {s.reconstructed ? (
            <>
              v{s.v} of {displayId(person.id)}, reconstructed from the résumé and bio: résumé entries dated by {s.date}, plus the undated bio, and
              every line names its source below. The current version is <Link href="/">v{latest}</Link>.
            </>
          ) : (
            <>
              v{s.v} is the current version, the same record as the <Link href="/">home page</Link>.
            </>
          )}
        </p>

        <p className="abstract">
          <b className="sc">Abstract:</b>
          <Abstract text={abstractSource(s)} />
        </p>

        <Metatable
          rows={[
            { label: "Version", value: `v${s.v} · ${s.date} · ${s.label}` },
            {
              label: "Cite as",
              value: (
                <>
                  {cite.line}
                  <br />
                  <span className="quiet">{cite.versioned}</span>
                </>
              ),
            },
            {
              label: "Sources",
              detail: true,
              value: (
                <ul className="ft-version-diff-sources">
                  {sourcesOf(s).map((src) => (
                    <li key={src}>{src}</li>
                  ))}
                </ul>
              ),
            },
          ]}
        />

        <h2 className="sec" id="submissions">
          Submissions as of v{s.v} <span className="label">{entries.length} entries</span>
        </h2>
        <div className="sec-rule" />
        {entries.length ? (
          <>
            <ol className="entries">
              {entries.map((r) => (
                <Entry key={r.id} record={r} />
              ))}
            </ol>
            {s.reconstructed ? <p className="ft-version-diff-note">Each entry is shown as it stands today.</p> : null}
          </>
        ) : (
          <p className="ft-version-diff-empty">No submissions by this version.</p>
        )}

        <h2 className="sec" id="history">
          Submission history
        </h2>
        <div className="sec-rule" />
        <SubmissionHistory current={s.v} />
      </div>

      <Sidebar label="Version tools">
        <SideBlock title="Access record:">
          <ul>
            <li>
              <Link href="/">Current version (v{latest})</Link>
            </li>
            {s.v > 1 ? (
              <li>
                <Link href={compareHref(s.v - 1, s.v)}>
                  Compare v{s.v - 1} → v{s.v}
                </Link>
              </li>
            ) : null}
            {s.v < latest ? (
              <li>
                <Link href={compareHref(s.v, latest)}>
                  Compare v{s.v} → v{latest}
                </Link>
              </li>
            ) : null}
          </ul>
        </SideBlock>
        <SideBlock title="Versions">
          <ul>
            {snapshots.map((x) => (
              <li key={x.v}>
                {x.v === s.v ? (
                  <b aria-current="page">
                    v{x.v} · {x.date}
                  </b>
                ) : (
                  <Link href={`/v/${x.v}`}>
                    v{x.v} · {x.date}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </SideBlock>
        {s.reconstructed ? (
          <SideBlock>
            <details className="whatis">
              <summary>(what is this?)</summary>
              <p>
                arXiv keeps every version of a paper. This record does too: earlier versions are rewritten from the résumé
                entries dated by then and the bio, and each line names its source.
              </p>
            </details>
          </SideBlock>
        ) : null}
      </Sidebar>
    </div>
  );
}
