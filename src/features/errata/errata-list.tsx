import Link from "next/link";
import { errata, errataFor, errataRecords, KIND_LABEL, type Erratum } from "@/content/errata";
import { displayId, getRecord, isRoutable, person } from "@/content/records";
import "./errata.css";

type Group = { id: string; title: string; href?: string; resume?: string };

/** Title and link for a record ID. Cross-lists show their ID unlinked, with a [résumé] link (R3). */
function groupFor(id: string): Group {
  if (id === person.id) return { id, title: person.title, href: "/" };
  const r = getRecord(id);
  if (!r) throw new Error(`errata.ts: no record "${id}"`);
  return isRoutable(r) ? { id, title: r.title, href: r.href } : { id, title: r.title, resume: r.href };
}

/** "2026-09-27" → "27 Sep 2026", without a Date (no timezone drift between server and client). */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** The arXiv-style errata list: counts, jump links, then one section per record. */
export function ErrataList() {
  const groups = errataRecords.map(groupFor);
  // one running index across the page, as on a listing
  const index = new Map(groups.flatMap((g) => errataFor(g.id)).map((e, i) => [e.key, i + 1]));
  return (
    <div className="wrap list">
      <h1>Errata</h1>
      <p className="ft-errata-lede" data-detail>
        Corrections to this record, each with what was claimed, what is true now, and where the change is recorded.
        Only corrections stated in the content or made by a commit are listed.
      </p>
      <nav className="jump" aria-label="Records with errata">
        {groups.map((g) => (
          <a key={g.id} href={`#${g.id}`}>
            {displayId(g.id)}
          </a>
        ))}
      </nav>
      <p className="counts">
        Total of {errata.length} entries across {groups.length} records
        <br />
        Dates are when the correction entered the content, from git history.
      </p>

      {groups.map((g) => {
        const items = errataFor(g.id);
        return (
          <section key={g.id} id={g.id} className="ft-errata-group" aria-labelledby={`h-${g.id}`}>
            <h2 id={`h-${g.id}`}>
              {g.href ? <Link href={g.href}>{displayId(g.id)}</Link> : displayId(g.id)} {g.title}{" "}
              {g.resume ? (
                <>
                  <span className="ft-errata-fmt">
                    [<Link href={g.resume}>résumé</Link>]
                  </span>{" "}
                </>
              ) : null}
              <span>
                (showing {items.length} of {items.length} entries)
              </span>
            </h2>
            <ol className="entries">
              {items.map((e) => (
                <Item key={e.key} e={e} n={index.get(e.key)!} />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function Item({ e, n }: { e: Erratum; n: number }) {
  return (
    <li className="entry ft-errata-item" id={`e-${e.key}`}>
      <span className="n">[{n}]</span>
      <div className="min-w-0">
        <div className="idline">
          <time dateTime={e.date}>{day(e.date)}</time>
          <span className={`badge ft-errata-kind ft-errata-${e.kind}`}>{KIND_LABEL[e.kind]}</span>
        </div>
        <dl className="ft-errata-dl">
          <dt>Claimed</dt>
          <dd>
            {e.claimed ? (
              <del>“{e.claimed}”</del>
            ) : (
              <span className="ft-errata-quiet">The original wording is not recorded.</span>
            )}
          </dd>
          <dt>Now</dt>
          <dd>{e.now}</dd>
        </dl>
        {e.note ? <p className="ft-errata-note">{e.note}</p> : null}
        <p className="ln">
          <span className="k">Source</span>
          commit <code className="ft-errata-hash">{e.source.commit}</code> · {e.source.file}
          {e.source.ref ? `, ${e.source.ref}` : null}
        </p>
      </div>
    </li>
  );
}
