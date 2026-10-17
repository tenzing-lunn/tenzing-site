import Link from "next/link";
import { displayId, type ArchiveRecord } from "@/content/records";
import { SideBlock } from "@/components/side-block";

/**
 * arXiv's "Current browse context": the primary subject, then `< prev | next >`
 * through the submissions in ID order, then the listing links. A direction
 * with nowhere to go is plain grey text, not a link.
 */
export function BrowseContext({ context, prev, next }: { context: string; prev?: ArchiveRecord; next?: ArchiveRecord }) {
  return (
    <SideBlock title="Current browse context:">
      <p className="ctx">{context}</p>
      <p className="nav-line">
        {prev ? (
          <Link href={prev.href} title={displayId(prev.id)}>
            &lt; prev
          </Link>
        ) : (
          "< prev"
        )}
        {"  |  "}
        {next ? (
          <Link href={next.href} title={displayId(next.id)}>
            next &gt;
          </Link>
        ) : (
          "next >"
        )}
      </p>
      <p className="nav-line">
        {/* there is no per-year listing yet, so 2026 stays unlinked */}
        <Link href="/list#new">new</Link> | <Link href="/list">recent</Link> | 2026
      </p>
    </SideBlock>
  );
}
