import Image from "next/image";
import Link from "next/link";
import { drawings, photos } from "@/content/art";

/** A drawing and a photograph that wipe up into their frames. Both lead to /art. */
export function Scraps({ className = "mt-[8vh]" }: { className?: string }) {
  const pieces = [drawings[0], photos[0]].filter(Boolean);
  return (
    <div className={`grid grid-cols-[1.3fr_1fr] items-end gap-[2vw] ${className}`}>
      {pieces.map((p) => (
        <Link key={p.src} href="/art" data-cursor="look" className="block">
          <span className="wipe block">
            <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width: 640px) 420px, 55vw" className="block h-auto w-full grayscale" />
          </span>
          <span className="mt-2.5 block font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
            {p.title}
            {p.medium ? `, ${p.medium}` : ""}
          </span>
        </Link>
      ))}
    </div>
  );
}
