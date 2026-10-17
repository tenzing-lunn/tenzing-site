import { STATUS_LABEL, type Status } from "@/content/records";

/**
 * A status stamp: mono caps in a 1px ink outline, no fill. The line style is
 * the status (solid live, dashed in progress or under review, dotted
 * concluded), and the word is always there too.
 */
export function Badge({ status, label }: { status: Status; label?: string }) {
  return <span className={`badge b-${status}`}>{label ?? STATUS_LABEL[status]}</span>;
}
