import type { Metadata } from "next";
import Image from "next/image";
import { drawings } from "@/content/art";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Art",
  description: `Drawings by ${site.name}.`,
};

export default function ArtPage() {
  return (
    <section>
      <h1 className="text-lg font-medium text-fg">Art</h1>
      {drawings.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-fg-3">nothing here yet</p>
      ) : null}
      <ul className="mt-10 space-y-14">
        {drawings.map((d) => (
          <li key={d.src}>
            <figure>
              <Image
                src={d.src}
                alt={d.alt}
                width={d.width}
                height={d.height}
                sizes="(max-width: 42rem) 100vw, 42rem"
                className="w-full h-auto border border-border"
              />
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[11px] text-fg-3">
                <span>{d.title}</span>
                <span className="shrink-0">{[d.medium, d.year].filter(Boolean).join(" · ")}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
