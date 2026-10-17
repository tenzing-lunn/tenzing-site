import { site } from "@/content/site";
import { displayId, isRoutable, records, subjectLabel } from "@/content/records";

/** Built once at build time; nothing here reads the request (R4). */
export const dynamic = "force-static";

/** Escapes text for XML and drops the control characters XML 1.0 forbids. */
const xml = (s: string) =>
  s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * RSS 2.0 feed of every submission with an abs page, newest ID first. No
 * pubDate: no record has a day-precise date (R25), and the field is optional.
 */
export function GET() {
  const base = site.url.replace(/\/$/, "");
  const items = records
    .filter(isRoutable)
    .sort((a, b) => b.id.localeCompare(a.id))
    .map((r) =>
      [
        "    <item>",
        `      <title>${xml(r.title)}</title>`,
        `      <link>${xml(base + r.href)}</link>`,
        `      <guid isPermaLink="false">${xml(displayId(r.id))}</guid>`,
        `      <description>${xml(r.tldr)}</description>`,
        `      <category>${xml(subjectLabel(r.subjects[0]))}</category>`,
        "    </item>",
      ].join("\n"),
    );

  const body = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    "  <channel>",
    `    <title>${xml(`lunnXiv: ${site.name}`)}</title>`,
    `    <link>${xml(base)}</link>`,
    `    <description>${xml(site.description)}</description>`,
    `    <atom:link href="${xml(`${base}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
