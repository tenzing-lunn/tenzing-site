import type { Metadata } from "next";
import Image from "next/image";
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
      <h1 className="text-lg font-medium text-fg">About</h1>
      <div className="prose mt-10">
        {about.map((p, i) => (
          <p key={i}>{renderInline(p)}</p>
        ))}
      </div>
      {site.drawing ? (
        <figure className="mt-12">
          <Image
            src={site.drawing.src}
            alt={site.drawing.alt}
            width={site.drawing.width}
            height={site.drawing.height}
            className="w-full h-auto"
          />
          <figcaption className="mt-2 font-mono text-[11px] text-fg-3">{site.drawing.alt}</figcaption>
        </figure>
      ) : null}
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
