/**
 * Projects, newest first.
 *
 * PLACEHOLDER CONTENT — these are illustrative entries. Replace them with
 * your own. Section bodies (`overview`, `why`, `how`, `learned`) accept the
 * same lightweight Markdown that notes do: paragraphs, headings, lists,
 * quotes, code blocks, links.
 */

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  year: number;
  /** One sentence. Shown in the list and at the top of the project page. */
  description: string;
  status?: "active" | "paused" | "shipped" | "archived";
  tech?: string[];
  links?: ProjectLink[];
  overview: string;
  why: string;
  how: string;
  learned: string;
};

export const projects: Project[] = [
  {
    slug: "quiet-hours",
    name: "Quiet Hours",
    year: 2026,
    description:
      "An iOS app that turns a phone into a single timer and nothing else for a chosen stretch of the day.",
    status: "active",
    tech: ["Swift", "SwiftUI", "WidgetKit"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
    overview: `Quiet Hours is a deliberately small app. You pick a length of time, the screen goes dark except for a thin progress line, and the app asks the system to hold notifications until the timer ends.

There is no history, no streaks, and no account. When the timer finishes the app shows the elapsed time once and then forgets it.`,
    why: `Most focus apps try to motivate you. I wanted one that simply got out of the way and made the phone slightly less interesting for an hour.

The constraint was that the entire interface should fit on one screen and be operable with one thumb.`,
    how: `The app is a single SwiftUI view driven by a small state machine: \`idle → running → done\`. A lock-screen widget mirrors the progress line so the phone can stay face down.

- Focus filters are requested through the system Focus API rather than a custom Do Not Disturb.
- Timer state is persisted to \`UserDefaults\` so a force-quit resumes correctly.
- There is no networking code at all.`,
    learned: `Removing features is more work than adding them. Every time I cut something I had to redesign the remaining pieces so the absence felt intentional rather than unfinished.`,
  },
  {
    slug: "fieldnotes",
    name: "Fieldnotes",
    year: 2025,
    description:
      "A plain-text notes format and command-line tool for keeping a daily log that stays readable without any software.",
    status: "shipped",
    tech: ["TypeScript", "Node"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
    overview: `Fieldnotes is a folder of Markdown files named by date and a tiny CLI that opens today's file, searches across days, and prints a weekly digest.

The format is the product. The tool is a convenience.`,
    why: `I kept switching notes apps and losing history in each migration. A directory of text files is the only format I trust to still open in twenty years.`,
    how: `The CLI is a few hundred lines of TypeScript with no dependencies beyond Node's standard library.

\`\`\`
fieldnotes            # open today
fieldnotes week       # print the last 7 days
fieldnotes grep foo   # search all entries
\`\`\`

Search is a linear scan. For a decade of daily notes that is still under a megabyte of text, so an index would be premature.`,
    learned: `Constraints on the file format did more for consistency than any feature. Because every entry is just a dated heading and prose, the digest and search commands were almost free to write.`,
  },
  {
    slug: "ledger",
    name: "Ledger",
    year: 2025,
    description:
      "A single-page web app for splitting shared expenses among friends, with no sign-up and state stored in the URL.",
    status: "paused",
    tech: ["React", "TypeScript"],
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "Demo", href: "https://example.com/" },
    ],
    overview: `Ledger lets a group enter who paid what, then shows the minimum set of transfers needed to settle up. The whole state is compressed into the URL, so sharing the link shares the ledger.`,
    why: `Existing tools required everyone to install an app and create an account to split a dinner. That is too much ceremony for a one-time event.`,
    how: `Settlement is computed greedily: sort net balances, then repeatedly pair the largest debtor with the largest creditor. It is not always optimal in the number of transfers but it is always correct and easy to explain.

State is serialized to JSON, compressed, and base64-encoded into the hash fragment so nothing is ever sent to a server.`,
    learned: `Putting state in the URL made the app trivially shareable and trivially private, but it also meant a long URL. Users cared far less about that than I expected.`,
  },
  {
    slug: "monotype",
    name: "Monotype",
    year: 2024,
    description:
      "A typing practice page that only ever shows one line of text at a time.",
    status: "archived",
    tech: ["HTML", "CSS", "JavaScript"],
    overview: `A single HTML file. It shows one sentence, you type it, and it shows the next one. Accuracy and speed appear once at the end of a session and are not saved.`,
    why: `I wanted something to warm up on before writing, without a leaderboard or a dashboard asking me to come back tomorrow.`,
    how: `There is no build step. The page is around two hundred lines including the sentence bank. Keystrokes are compared against the target string character by character, and the caret is a real text cursor rather than a drawn one so screen readers behave normally.`,
    learned: `The first version tracked far too much. Stripping it back to a single number at the end made it something I actually opened.`,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
