/**
 * Notes, newest first. Dates are ISO strings (YYYY-MM-DD).
 *
 * Bodies use a small
 * Markdown subset: `#`/`##`/`###` headings, paragraphs, `-` lists,
 * `1.` lists, `>` quotes, fenced code blocks, [links](url), `code`,
 * **bold**, and *italic*.
 */

export type Note = {
  slug: string;
  title: string;
  date: string;
  /** Optional one-line summary for the palette and metadata. */
  summary?: string;
  body: string;
};

export const notes: Note[] = [
  {
    slug: "a-place-to-begin",
    title: "A place to begin",
    date: "2026-09-13",
    summary: "Why this site exists and what it is for.",
    body: `This site is a small room. It has a few doors and not much furniture.

I wanted somewhere to keep notes that were more than a tweet and less than an essay, and a list of the things I have built that I could point people to without explaining each one from scratch.

## What it is not

It is not a portfolio in the usual sense. There are no case studies with hero images, and there is no pitch. If you want to know what I am doing right now, the [current snapshot](/now) is the honest answer.

## How to move around

Most of the site can be driven from the keyboard.

- \`A\`, \`P\`, \`N\` jump to About, Projects, and Notes.
- \`/\` opens the Ask page.
- \`⌘K\` opens a small command palette that searches everything.
- \`?\` shows the full list.

There is also a terminal at the bottom of every page. It understands a handful of commands and is mostly there because I like it.

> Build the thing you would want to find.

That is the whole idea.`,
  },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

/** Notes grouped by year, newest year first, newest note first within a year. */
export function notesByYear(): { year: number; notes: Note[] }[] {
  const sorted = [...notes].sort((a, b) => (a.date < b.date ? 1 : -1));
  const groups = new Map<number, Note[]>();
  for (const note of sorted) {
    const year = Number(note.date.slice(0, 4));
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(note);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, notes]) => ({ year, notes }));
}
