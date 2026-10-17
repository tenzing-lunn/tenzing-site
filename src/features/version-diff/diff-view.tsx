import { Fragment } from "react";
import { abstractText, affiliationText, submissionLines, type Snapshot } from "@/content/snapshots";
import { diff, tally, words, type Run } from "./diff";
import "./version-diff.css";

/** One run of a diff: kept text plain, deletions struck, insertions underlined. */
function Mark({ run, text }: { run: Run; text: string }) {
  if (run.type === "del")
    return (
      <del>
        <span className="sr-only">[removed: </span>
        {text}
        <span className="sr-only">]</span>
      </del>
    );
  if (run.type === "ins")
    return (
      <ins>
        <span className="sr-only">[added: </span>
        {text}
        <span className="sr-only">]</span>
      </ins>
    );
  return <>{text}</>;
}

/** Prose diffed word by word. */
function Words({ runs }: { runs: Run[] }) {
  return runs.map((r, i) => (
    <Fragment key={i}>
      {i ? " " : null}
      <Mark run={r} text={r.tokens.join(" ")} />
    </Fragment>
  ));
}

/** The submission list diffed line by line: a record is either kept, gone or new. */
function Lines({ runs }: { runs: Run[] }) {
  return (
    <ul className="ft-version-diff-lines">
      {runs.flatMap((r, i) =>
        r.tokens.map((line, k) => (
          <li key={`${i}-${k}`} className={r.type === "eq" ? undefined : `ft-version-diff-${r.type}`}>
            <span className="ft-version-diff-sign" aria-hidden>
              {r.type === "del" ? "−" : r.type === "ins" ? "+" : " "}
            </span>
            <Mark run={r} text={line} />
          </li>
        )),
      )}
    </ul>
  );
}

/**
 * The tracked-changes view of two snapshots: affiliation, abstract and the
 * submission list, each with its own count of what changed.
 */
export function DiffView({ from, to }: { from: Snapshot; to: Snapshot }) {
  const sections = [
    { id: "affiliation", title: "Affiliation", unit: "word", runs: diff(words(affiliationText(from)), words(affiliationText(to))), lines: false },
    { id: "abstract", title: "Abstract", unit: "word", runs: diff(words(abstractText(from)), words(abstractText(to))), lines: false },
    { id: "submissions", title: "Submissions", unit: "record", runs: diff(submissionLines(from), submissionLines(to), 0), lines: true },
  ];

  return (
    <div className="ft-version-diff-view">
      {sections.map((s) => {
        const { removed, added } = tally(s.runs);
        const plural = (n: number) => `${n} ${s.unit}${n === 1 ? "" : "s"}`;
        const changes = [removed ? `${plural(removed)} removed` : "", added ? `${plural(added)} added` : ""].filter(Boolean);
        return (
          <section key={s.id} aria-labelledby={`diff-${s.id}`}>
            <h2 id={`diff-${s.id}`}>
              {s.title} <span>({changes.length ? changes.join(", ") : "unchanged"})</span>
            </h2>
            {s.lines ? (
              <Lines runs={s.runs} />
            ) : (
              <p className={`ft-version-diff-prose ft-version-diff-${s.id}`}>
                <Words runs={s.runs} />
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
