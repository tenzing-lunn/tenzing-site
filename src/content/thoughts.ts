/**
 * Thoughts, newest first. Dates are ISO strings (YYYY-MM-DD).
 *
 * Bodies use a small
 * Markdown subset: `#`/`##`/`###` headings, paragraphs, `-` lists,
 * `1.` lists, `>` quotes, fenced code blocks, [links](url), `code`,
 * **bold**, and *italic*.
 */

export type Thought = {
  slug: string;
  title: string;
  date: string;
  /** Optional one-line summary for the palette and metadata. */
  summary?: string;
  body: string;
};

export const thoughts: Thought[] = [];

export function getThought(slug: string): Thought | undefined {
  return thoughts.find((n) => n.slug === slug);
}

/** Thoughts grouped by year, newest year first, newest thought first within a year. */
export function thoughtsByYear(): { year: number; thoughts: Thought[] }[] {
  const sorted = [...thoughts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const groups = new Map<number, Thought[]>();
  for (const thought of sorted) {
    const year = Number(thought.date.slice(0, 4));
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(thought);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, thoughts]) => ({ year, thoughts }));
}
