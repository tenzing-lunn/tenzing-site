import { endorsements } from "@/content/endorsements";
import "./endorsements.css";

/**
 * The Endorsements section, after the submission history on the home page.
 * Each note is laid out like an OpenReview comment: a title, the author line,
 * then Summary / Relationship / Date / Source fields. The outline is the
 * status, as with badges: solid when the note links to a public source,
 * dashed when it was sent privately, and the Source row says which in words.
 * With no entries it is one muted line with a (what is this?) disclosure.
 */
export function Endorsements() {
  if (endorsements.length === 0) {
    return (
      <details className="whatis ft-endorsements-empty">
        <summary>
          No endorsements yet. <span className="ft-endorsements-q">(what is this?)</span>
        </summary>
        <p>
          Endorsements are short notes from people Tenzing has worked with, added here by hand and in their own words.
        </p>
      </details>
    );
  }

  return (
    <section aria-labelledby="endorsements">
      <h2 className="sec" id="endorsements">
        Endorsements{" "}
        <span className="label">
          showing {endorsements.length} of {endorsements.length}
        </span>
      </h2>
      <div className="sec-rule" />
      <ol className="ft-endorsements-list">
        {endorsements.map((e, i) => {
          const titleId = `endorsement-${i + 1}`;
          return (
            <li key={`${e.name}-${e.date}`}>
              <article
                className={`ft-endorsements-note ${e.source ? "ft-endorsements-public" : "ft-endorsements-private"}`}
                aria-labelledby={titleId}
              >
                <h3 id={titleId} className="ft-endorsements-title">
                  Endorsement by {e.name}
                </h3>
                <p className="ft-endorsements-by">
                  {e.name} · {e.role}
                </p>
                <dl className="ft-endorsements-fields">
                  <dt>Summary:</dt>
                  <dd className="ft-endorsements-summary">{e.summary}</dd>
                  <dt>Relationship:</dt>
                  <dd>{e.relationship}</dd>
                  <dt>Date:</dt>
                  <dd>{e.date}</dd>
                  <dt>Source:</dt>
                  <dd>
                    {e.source ? (
                      <a href={e.source.href} target="_blank" rel="noopener noreferrer">
                        {e.source.label}
                      </a>
                    ) : (
                      <span className="quiet">sent privately, added by hand</span>
                    )}
                  </dd>
                </dl>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
