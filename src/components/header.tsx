"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { site } from "@/content/site";
import { archiveOf, displayId, getRecord, person, records } from "@/content/records";
import { paper } from "@/content/paper";
import { useUI } from "@/components/ui-provider";
import { Badge } from "@/components/badge";
import { LinkPending, RouteProgress } from "@/components/route-progress";
import { TldrToggle } from "@/features/tldr";

const NAV: { href: string; label: string }[] = [
  { href: "/list", label: "Listings" },
  { href: `/abs/${paper.id}`, label: "Paper" },
  { href: "/resume", label: "Résumé" },
  { href: "/ask", label: "Ask" },
];

const ARCHIVES: { [prefix: string]: string } = {
  cs: "Computer Science",
  math: "Mathematics",
  "q-fin": "Quantitative Finance",
  stat: "Statistics",
  pm: "Product",
  life: "Life",
};

/** The other pages: what the subject bar calls them. */
const PAGES: { [segment: string]: string } = {
  resume: "Résumé",
  about: "About",
  now: "Now",
  art: "Art",
  thoughts: "Thoughts",
  ask: "Ask",
  errata: "Errata",
  v: "Versions",
  diff: "Compare versions",
};

type Subject = { subject: ReactNode; aside?: ReactNode };

/** Next's segment for the 404 page, which is prerendered once and served for every unknown URL. */
const NOT_FOUND_SEGMENT = "/_not-found";

/** Any URL with no record or page behind it: one fixed label, whatever the path. */
const NOT_FOUND: Subject = { subject: "Article identifier not recognized" };

/**
 * What the subject bar under the masthead says on each route (left: the
 * subject, right: an ID, a count or a status). Derived from the path so it
 * is right on the server's first render.
 */
export function subjectFor(pathname: string): Subject {
  const [first, second] = pathname.split("/").filter(Boolean);
  if (pathname === NOT_FOUND_SEGMENT) return NOT_FOUND;
  if (!first) {
    return {
      subject: `Mathematics > ${person.subjects[0].name}`,
      aside: `${displayId(person.id)}v${person.version}`,
    };
  }
  if (first === "list") {
    return {
      subject: `Submissions by ${site.name}`,
      aside: `Total of ${records.length} entries`,
    };
  }
  if (first === "abs" && second) {
    const r = getRecord(decodeURIComponent(second));
    if (r) {
      const primary = r.subjects[0];
      const archive = archiveOf(primary);
      return {
        subject: `${ARCHIVES[archive] ?? archive} > ${primary.name}`,
        aside: <Badge status={r.status} />,
      };
    }
  }
  const label = PAGES[first];
  if (!label) return NOT_FOUND;
  return {
    subject: label,
    aside: second && first === "v" ? `${displayId(person.id)}v${second}` : undefined,
  };
}

/**
 * The masthead: an ink band with the lunnXiv wordmark, the search trigger
 * (it opens the command palette) and four links; a 1px rule that doubles
 * as the route-progress line; then the page's subject bar.
 */
export function Header() {
  // The prerendered 404 is built at /_not-found but served at the missing URL, so
  // on a 404 the router's segment, not the URL, keeps server and client in step.
  const segment = useSelectedLayoutSegment();
  const url = usePathname();
  const pathname = segment === NOT_FOUND_SEGMENT ? NOT_FOUND_SEGMENT : url;
  const { openPalette } = useUI();
  const { subject, aside } = subjectFor(pathname);

  return (
    <header className="no-print">
      <div className="mast-wrap">
        <div className="mast">
          <div className="wrap mast-in">
            <Link href="/" className="brand" aria-label="lunnXiv, home">
              lunn<i>X</i>iv
              <LinkPending />
            </Link>
            <button type="button" className="search" onClick={openPalette} aria-label="Search lunnXiv (⌘K or /)">
              <span>Search lunnXiv…</span>
              <kbd>⌘K</kbd>
            </button>
            <nav aria-label="Primary" className="nav">
              {NAV.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}>
                    {l.label}
                    <LinkPending />
                  </Link>
                );
              })}
            </nav>
            <div className="mast-tldr">
              <TldrToggle />
            </div>
          </div>
        </div>
        <div className="hair" />
        <RouteProgress />
      </div>
      <div className="subj">
        <div className="wrap subj-in">
          <span>{subject}</span>
          {aside ? <span>{aside}</span> : null}
        </div>
      </div>
    </header>
  );
}
