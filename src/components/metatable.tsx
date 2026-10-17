import { Fragment, type ReactNode } from "react";

export type MetaRow = {
  label: string;
  value: ReactNode;
  /** Hidden in TL;DR mode. */
  detail?: boolean;
};

/**
 * The two-column metadata grid under an abstract: mono labels at 112px on the
 * left (Comments, Subjects, Cite as, Contact…), values on the right.
 */
export function Metatable({ rows, className = "" }: { rows: MetaRow[]; className?: string }) {
  return (
    <dl className={`meta ${className}`}>
      {rows.map((r) => {
        const detail = r.detail ? "" : undefined;
        return (
          <Fragment key={r.label}>
            <dt data-detail={detail}>{r.label}</dt>
            <dd data-detail={detail}>{r.value}</dd>
          </Fragment>
        );
      })}
    </dl>
  );
}
