"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** `[vN]`, linked to /v/N unless this page is /v/N, where a self-link would only reload it. */
export function VersionLink({ v }: { v: number }) {
  const href = `/v/${v}`;
  if (usePathname() === href) return <span aria-current="page">[v{v}]</span>;
  return <Link href={href}>[v{v}]</Link>;
}
