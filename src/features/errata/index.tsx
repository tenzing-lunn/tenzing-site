"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { errata, errataFor } from "@/content/errata";
import { person } from "@/content/records";
import { SideBlock } from "@/components/side-block";

/** The record a route shows: `/` is the person, `/abs/<id>` is that record. */
function recordOf(pathname: string): string | undefined {
  if (pathname === "/") return person.id;
  const m = /^\/abs\/([^/]+)\/?$/.exec(pathname);
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * The sidebar's "Errata (N)" link. On a record with corrections it counts
 * that record's and jumps to them (/errata#<id>); on a record without any it
 * says so and links the whole log; anywhere else it counts the whole log.
 * `id` overrides the record read from the route.
 */
export function ErrataLink({ id }: { id?: string } = {}) {
  const pathname = usePathname();
  const record = id ?? recordOf(pathname);
  const own = record ? errataFor(record) : [];
  return (
    <SideBlock title="Errata">
      {own.length ? (
        <>
          <Link href={`/errata#${record}`}>Errata ({own.length})</Link>
          <p className="small">
            Corrections to this record. <Link href="/errata">All {errata.length}</Link>
          </p>
        </>
      ) : record ? (
        <p className="small">
          None for this record. <Link href="/errata">All {errata.length} site-wide</Link>
        </p>
      ) : (
        <Link href="/errata">Errata ({errata.length})</Link>
      )}
    </SideBlock>
  );
}
