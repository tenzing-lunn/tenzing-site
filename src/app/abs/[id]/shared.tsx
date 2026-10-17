import { submissions, subjectLabel, type ArchiveRecord } from "@/content/records";

/** Where this record sits among the submissions, for `< prev | next >`. */
export function neighbours(r: ArchiveRecord) {
  const i = submissions.findIndex((s) => s.id === r.id);
  return { prev: submissions[i - 1], next: submissions[i + 1] };
}

/** The Subjects line: the primary subject in bold, the rest after semicolons. */
export function SubjectsValue({ record }: { record: ArchiveRecord }) {
  return record.subjects.map((s, i) => (
    <span key={s.code}>
      {i ? "; " : null}
      {i ? subjectLabel(s) : <b>{subjectLabel(s)}</b>}
    </span>
  ));
}
