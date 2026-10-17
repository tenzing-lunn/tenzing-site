import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { person, submissions } from "@/content/records";
import { thoughts } from "@/content/thoughts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticPages = [
    "",
    "/list",
    "/about",
    "/thoughts",
    "/resume",
    "/ask",
    "/now",
    "/art",
    "/errata",
    "/diff",
    "/feed.xml",
    ...person.versions.map((v) => `/v/${v.v}`),
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(site.now.lastUpdated),
  }));
  const recordPages = submissions.map((r) => ({
    url: `${base}${r.href}`,
    lastModified: new Date(site.now.lastUpdated),
  }));
  const thoughtPages = thoughts.map((n) => ({
    url: `${base}/thoughts/${n.slug}`,
    lastModified: new Date(n.date),
  }));
  return [...staticPages, ...recordPages, ...thoughtPages];
}
