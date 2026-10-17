import type { Metadata } from "next";
import { drawings, photos } from "@/content/art";
import { Gallery } from "@/components/gallery";
import { site } from "@/content/site";
import { Chapter } from "@/components/chapter";

export const metadata: Metadata = {
  title: "Art",
  description: `Drawings and photographs by ${site.name}.`,
};

export default function ArtPage() {
  const pieces = [...drawings, ...photos];
  return (
    <Chapter label="Art" title="Drawings and photos">
      {pieces.length === 0 ? <p className="text-fg-3">Nothing here yet.</p> : null}
      <Gallery pieces={pieces} />
    </Chapter>
  );
}
