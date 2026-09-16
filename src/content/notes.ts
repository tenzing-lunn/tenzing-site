/**
 * Notes, newest first. Dates are ISO strings (YYYY-MM-DD).
 *
 * PLACEHOLDER CONTENT — replace with your own writing. Bodies use a small
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
  {
    slug: "on-writing-less",
    title: "On writing less",
    date: "2026-09-02",
    summary: "A short note about editing.",
    body: `Almost everything I write is improved by cutting the first paragraph.

The first paragraph is usually me warming up: explaining why I am about to say something instead of saying it. Once the real sentence arrives, the warm-up can go.

The same is true of code. The first version of a function tends to handle three cases that will never happen. Deleting them makes the one case that matters legible.

## A small rule

1. Write the thing.
2. Wait a day.
3. Remove everything that does not change what the reader will do.

It is not a rule I follow reliably. But when I do, the result is shorter and the shortness is the point.`,
  },
  {
    slug: "plain-text-is-a-feature",
    title: "Plain text is a feature",
    date: "2025-11-20",
    summary: "Notes on keeping files that outlive their software.",
    body: `Every notes app I have used has eventually asked me to export. Every export has lost something: a link, a date, the order of things.

A folder of text files never asks. It opens in anything, diffs cleanly, and searches with tools that have existed for fifty years.

\`\`\`
notes/
  2025-11-20.md
  2025-11-19.md
  2025-11-18.md
\`\`\`

This is the entire schema.

The cost is that plain text will not remind you of anything, sync itself, or draw a graph. Those are real losses. But they are losses I can add back with small tools, whereas the reverse migration, from an app back to text, is always lossy.

**The rule I have landed on:** the format should be boring, and the tools around it can be as clever as they like.`,
  },
  {
    slug: "small-interfaces",
    title: "Small interfaces",
    date: "2025-06-08",
    summary: "What one-screen apps taught me about scope.",
    body: `An interface that fits on one screen forces a kind of honesty. There is nowhere to hide a feature you are not sure about.

When I built [Quiet Hours](/projects/quiet-hours) the first sketch had settings, history, and a chart. The final version has a timer and a line. Each removal was uncomfortable and each one made the app better.

### Questions I now ask

- Would I miss this if it were gone tomorrow?
- Does this exist because a user needs it or because I could build it?
- Can the absence be made to look deliberate?

The last question is the hard one. A missing feature reads as unfinished unless the rest of the design closes around the gap.`,
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
