import type { Metadata } from "next";
import { AboutText } from "@/components/about-text";
import { Chapter } from "@/components/chapter";
import { Scraps } from "@/components/scraps";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
};

export default function AboutPage() {
  return (
    <Chapter label="About" title="Where I come from" as="h1">
      <AboutText />
      <Scraps />
      <ul className="mt-12 flex flex-wrap gap-x-5 gap-y-1 text-sm text-fg-2">
        {site.links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer noopener" : undefined}
              className="sweep hover:text-fg transition-colors"
            >
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
