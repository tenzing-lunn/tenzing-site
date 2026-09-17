import type { Metadata } from "next";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { renderInline } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
};

export default function AboutPage() {
  return (
    <article>
      <h1 className="sr-only">About</h1>
      <div className="prose">
        {about.map((p, i) => (
          <p key={i}>{renderInline(p)}</p>
        ))}
      </div>
      <ul className="mt-12 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-fg-3">
        {site.links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer noopener" : undefined}
              className="hover:text-fg transition-colors underline-offset-4 hover:underline"
            >
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
