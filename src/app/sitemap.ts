import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticPages = ["", "/about", "/projects", "/notes", "/ask", "/now", "/art"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(site.now.lastUpdated),
  }));
  const projectPages = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(`${p.year}-01-01`),
  }));
  const notePages = notes.map((n) => ({
    url: `${base}/notes/${n.slug}`,
    lastModified: new Date(n.date),
  }));
  return [...staticPages, ...projectPages, ...notePages];
}
