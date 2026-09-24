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
        <h1 className="text-[clamp(40px,6vw,92px)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance text-fg">{thought.title}</h1>
        <time dateTime={thought.date} className="mt-3 block text-[13px] text-fg-3">
          {formatDate(thought.date)}
        </time>
      </header>

      <div className="prose mt-10">
        <Markdown source={thought.body} />
      </div>

      <p className="mt-16">
        <Link href="/thoughts" className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3 hover:text-fg sweep">
          ← All thoughts
        </Link>
      </p>
      </article>
    </Chapter>
  );
}
