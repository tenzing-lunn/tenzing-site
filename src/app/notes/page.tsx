import type { Metadata } from "next";
import Link from "next/link";
import { notesByYear } from "@/content/notes";
import { formatDate } from "@/lib/dates";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Notes",
  description: `Notes and short writing by ${site.name}.`,
};

export default function NotesPage() {
  const groups = notesByYear();
  return (
    <section>
      <h1 className="text-lg font-medium text-fg">Notes</h1>
      <div className="mt-10 space-y-10">
        {groups.map(({ year, notes }) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`} className="font-mono text-xs text-fg-3">
              {year}
            </h2>
            <ul className="mt-3 -mx-2">
              {notes.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/notes/${n.slug}`}
                    className="group flex items-baseline gap-4 px-2 py-1.5"
                  >
                    <time
                      dateTime={n.date}
                      className="w-14 shrink-0 font-mono text-xs text-fg-3 tabular-nums"
                    >
                      {formatDate(n.date, "short")}
                    </time>
                    <span className="text-fg-2 group-hover:text-fg transition-colors underline-offset-4 decoration-fg-3 group-hover:underline">
                      {n.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
