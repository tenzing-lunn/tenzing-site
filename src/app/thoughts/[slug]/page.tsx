import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getThought, thoughts } from "@/content/thoughts";
import { formatDate } from "@/lib/dates";
import { Markdown } from "@/lib/markdown";
import { Chapter } from "@/components/chapter";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return thoughts.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) return {};
  return {
    title: thought.title,
    description: thought.summary ?? `A thought from ${formatDate(thought.date)}.`,
    openGraph: { type: "article", publishedTime: thought.date },
  };
}

export default async function ThoughtPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) notFound();

  return (
    <Chapter label="Thoughts">
      <article>
      <header>
        <h1 className="title">{thought.title}</h1>
        <time dateTime={thought.date} className="dateline block">
          {formatDate(thought.date)}
        </time>
      </header>

      <div className="prose mt-10">
        <Markdown source={thought.body} />
      </div>

      <p className="mt-16">
        <Link href="/thoughts" className="label hover:text-fg">
          ← All thoughts
        </Link>
      </p>
      </article>
    </Chapter>
  );
}
