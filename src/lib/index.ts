import { site } from "@/content/site";
import { displayId, person, records, type Status } from "@/content/records";
import { thoughts } from "@/content/thoughts";
import { formatDate } from "@/lib/dates";
import type { Searchable } from "@/lib/query";

/**
 * One entry in the command palette / terminal navigation index. The
 * Searchable fields (ids, cats, status, years, authors) are what the search
 * operators in lib/query.ts filter on.
 */
export type IndexEntry = Searchable & {
  id: string;
  title: string;
  href: string;
  kind: "page" | "project" | "thought" | "link";
  status?: Status;
  /** Secondary text shown right-aligned (year, date, or hostname). */
  meta?: string;
  /** Extra text that fuzzy search should also match against. */
  keywords?: string;
  external?: boolean;
};

export const pages: IndexEntry[] = [
  { id: "home", title: "Home", href: "/", kind: "page", keywords: "index start", ids: [person.id] },
  { id: "about", title: "About", href: "/about", kind: "page", keywords: "bio me" },
  { id: "list", title: "Listings", href: "/list", kind: "page", keywords: "work projects submissions cross-lists" },
  { id: "paper", title: "Paper", href: "/abs/2605.00003", kind: "page", keywords: "neurips research misalignment" },
  { id: "thoughts", title: "Thoughts", href: "/thoughts", kind: "page", keywords: "writing blog" },
  { id: "resume", title: "Resume", href: "/resume", kind: "page", keywords: "cv experience" },
  { id: "ask", title: "Ask", href: "/ask", kind: "page", keywords: "question" },
  { id: "now", title: "Now", href: "/now", kind: "page", keywords: "snapshot current" },
  { id: "errata", title: "Errata", href: "/errata", kind: "page", keywords: "corrections" },
  { id: "diff", title: "Compare v3 and v4", href: "/diff?from=3&to=4", kind: "page", keywords: "diff versions history" },
  ...person.versions.map((v): IndexEntry => ({
    id: `v${v.v}`,
    title: `${displayId(person.id)}v${v.v}: ${v.label}`,
    href: `/v/${v.v}`,
    kind: "page",
    meta: v.date,
    keywords: `version ${v.label}`,
    ids: [`${person.id}v${v.v}`],
    years: yearsIn(v.date),
  })),
  { id: "feed", title: "RSS feed", href: "/feed.xml", kind: "page", keywords: "subscribe rss", external: true },
];

export function buildIndex(): IndexEntry[] {
  const projectEntries: IndexEntry[] = records.map((r) => ({
    id: `project:${r.id}`,
    title: r.title,
    href: r.href,
    kind: "project",
    meta: displayId(r.id),
    keywords: [r.tldr, r.authorsLine, ...r.subjects.map((s) => `${s.code} ${s.name}`)].join(" "),
    ids: [r.id],
    cats: r.subjects.map((s) => s.code),
    status: r.status,
    years: r.year ? [r.year] : [],
    authors: r.authorsLine,
  }));

  const thoughtEntries: IndexEntry[] = thoughts.map((n) => ({
    id: `thought:${n.slug}`,
    title: n.title,
    href: `/thoughts/${n.slug}`,
    kind: "thought",
    meta: formatDate(n.date, "short"),
    keywords: n.summary ?? "",
    years: yearsIn(n.date),
  }));

  const linkEntries: IndexEntry[] = site.links.map((l) => ({
    id: `link:${l.label}`,
    title: l.label,
    href: l.href,
    kind: "link",
    meta: safeHost(l.href),
    external: true,
  }));

  return [...pages, ...projectEntries, ...thoughtEntries, ...linkEntries];
}

/** "Aug 2023" → [2023]; "2025" → [2025]. */
function yearsIn(text: string): number[] {
  return (text.match(/\b\d{4}\b/g) ?? []).map(Number);
}

function safeHost(href: string): string | undefined {
  try {
    if (href.startsWith("mailto:")) return "mail";
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
