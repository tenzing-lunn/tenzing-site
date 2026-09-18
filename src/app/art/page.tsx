import type { Metadata } from "next";
import { drawings, photos } from "@/content/art";
import { Gallery } from "@/components/gallery";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Art",
  description: `Drawings and photographs by ${site.name}.`,
};

export default function ArtPage() {
  const pieces = [...drawings, ...photos];
  return (
    <section>
      <h1 className="font-display text-2xl font-bold leading-tight text-fg">Art</h1>
      {pieces.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-fg-3">nothing here yet</p>
      ) : null}
      <Gallery pieces={pieces} />
    </section>
  );
}
