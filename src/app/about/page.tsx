import type { Metadata } from "next";
import Link from "next/link";
import { Bio, Pastimes } from "@/components/about-text";
import { Chapter } from "@/components/chapter";
import { Scraps } from "@/components/scraps";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
};

export default function AboutPage() {
  return (
    <Chapter label="About" title="Where I come from">
      <div className="grid gap-10 md:grid-cols-[1fr_340px] md:gap-12">
        <div>
          <Bio />
          <div className="mt-6">
            <Pastimes />
          </div>
          <p className="mt-6">
            <Link href="/now" className="plain-link">
              currently
            </Link>
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-1 text-sm text-fg-2">
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
        </div>
        <Scraps className="md:self-start" />
      </div>
    </Chapter>
  );
}
