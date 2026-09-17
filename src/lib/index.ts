import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { thoughts } from "@/content/thoughts";
import { formatDate } from "@/lib/dates";

/** One entry in the command palette / terminal navigation index. */
export type IndexEntry = {
  id: string;
  title: string;
  href: string;
  kind: "page" | "project" | "thought" | "link";
  /** Secondary text shown right-aligned (year, date, or hostname). */
  meta?: string;
  /** Extra text that fuzzy search should also match against. */
  keywords?: string;
  external?: boolean;
};

export const pages: IndexEntry[] = [
  { id: "home", title: "Home", href: "/", kind: "page", keywords: "index start" },
  { id: "about", title: "About", href: "/about", kind: "page", keywords: "bio me" },
  { id: "projects", title: "Projects", href: "/projects", kind: "page", keywords: "work" },
  { id: "thoughts", title: "Thoughts", href: "/thoughts", kind: "page", keywords: "writing blog" },
  { id: "ask", title: "Ask", href: "/ask", kind: "page", keywords: "question" },
  { id: "now", title: "Now", href: "/now", kind: "page", keywords: "snapshot current" },
  { id: "art", title: "Art", href: "/art", kind: "page", keywords: "drawings gallery sketch" },
];

export function buildIndex(): IndexEntry[] {
  const projectEntries: IndexEntry[] = projects.map((p) => ({
    id: `project:${p.slug}`,
    title: p.name,
    href: `/projects/${p.slug}`,
    kind: "project",
    meta: String(p.year),
    keywords: [p.description, ...(p.tech ?? [])].join(" "),
  }));

  const thoughtEntries: IndexEntry[] = thoughts.map((n) => ({
    id: `thought:${n.slug}`,
    title: n.title,
    href: `/thoughts/${n.slug}`,
    kind: "thought",
    meta: formatDate(n.date, "short"),
    keywords: n.summary ?? "",
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

function safeHost(href: string): string | undefined {
  try {
    if (href.startsWith("mailto:")) return "mail";
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
