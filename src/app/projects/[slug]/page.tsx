import { notFound, permanentRedirect } from "next/navigation";
import { getRecordBySlug, records } from "@/content/records";

type Params = { slug: string };

/** Old project URLs, kept alive: /projects/<slug> → /abs/<id> with a 308 (R2). */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return records.filter((r) => r.slug).map((r) => ({ slug: r.slug! }));
}

export default async function ProjectRedirect({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const r = getRecordBySlug(slug);
  if (!r) notFound();
  permanentRedirect(r.href);
}
