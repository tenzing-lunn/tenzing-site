import type { Metadata } from "next";
import { site } from "@/content/site";
import { ErrataList } from "@/features/errata/errata-list";

export const metadata: Metadata = {
  title: "Errata",
  description: `Corrections to the record of ${site.name}: what was claimed, what is true now, and the commit that changed it.`,
};

export default function ErrataPage() {
  return <ErrataList />;
}
