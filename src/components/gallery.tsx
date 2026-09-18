"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/lightbox";
import type { Piece } from "@/content/art";

/** A column of images; clicking one opens it in the lightbox. */
export function Gallery({ pieces }: { pieces: Piece[] }) {
  const [open, setOpen] = useState<Piece | null>(null);

  return (
    <>
      <ul className="mt-10 space-y-14">
        {pieces.map((d) => (
          <li key={d.src}>
            <figure>
              <button
                type="button"
                onClick={() => setOpen(d)}
                aria-label={`Open ${d.title}`}
                className="block w-full cursor-zoom-in"
              >
                <Image
                  src={d.src}
                  alt={d.alt}
                  width={d.width}
                  height={d.height}
                  sizes="(max-width: 42rem) 100vw, 42rem"
                  className="w-full h-auto border border-border"
                />
              </button>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[11px] text-fg-3">
                <span>{d.title}</span>
                <span className="shrink-0">{[d.medium, d.year].filter(Boolean).join(" · ")}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox piece={open} onClose={() => setOpen(null)} />
    </>
  );
}
