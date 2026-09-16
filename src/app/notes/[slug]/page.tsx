import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote, notes } from "@/content/notes";
import { formatDate } from "@/lib/dates";
import { Markdown } from "@/lib/markdown";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary ?? `A note from ${formatDate(note.date)}.`,
    openGraph: { type: "article", publishedTime: note.date },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <article>
      <header>
        <h1 className="text-lg font-medium text-fg">{note.title}</h1>
        <time dateTime={note.date} className="mt-2 block font-mono text-xs text-fg-3">
          {formatDate(note.date)}
        </time>
      </header>

      <div className="prose mt-10">
        <Markdown source={note.body} />
      </div>

      <p className="mt-16">
        <Link href="/notes" className="text-sm text-fg-2 hover:text-fg transition-colors">
          ← Back to Notes
        </Link>
      </p>
    </article>
  );
}
