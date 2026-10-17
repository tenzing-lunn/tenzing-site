import { person } from "@/content/records";
import { VersionShortcut } from "./shortcut";
import { VersionLink } from "./version-link";
import "./version-diff.css";

export const compareHref = (from: number, to: number) => `/diff?from=${from}&to=${to}`;

/**
 * The submission history, one line per version. Each [vN] opens the record as
 * of that version at /v/N, whose page links the diffs. The current one is
 * bold, and is a link too except on its own /v/N page. Registers `v`, which
 * opens the diff into the current version.
 */
export function SubmissionHistory({ current }: { current: number }) {
  return (
    <>
      <ul className="hist ft-version-diff-hist">
        {person.versions.map((v) => {
          const now = v.v === current;
          return (
            <li key={v.v} className={now ? "now" : undefined}>
              <span className="v">
                <VersionLink v={v.v} />
              </span>
              <span className="d">{v.date}</span>
              {v.label}
              {now ? " (this version)" : null}
            </li>
          );
        })}
      </ul>
      <VersionShortcut href={current > 1 ? compareHref(current - 1, current) : undefined} />
    </>
  );
}
