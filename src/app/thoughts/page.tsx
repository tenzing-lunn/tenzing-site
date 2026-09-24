import type { Metadata } from "next";
import Link from "next/link";
import { thoughtsByYear } from "@/content/thoughts";
import { formatDate } from "@/lib/dates";
import { site } from "@/content/site";
import { Chapter } from "@/components/chapter";

export const metadata: Metadata = {
  title: "Thoughts",
  description: `Thoughts and short writing by ${site.name}.`,
};

export default function ThoughtsPage() {
  const groups = thoughtsByYear();
  return (
    <Chapter label="Thoughts" title="Short writing" as="h1">
      {groups.length === 0 ? <p className="text-fg-3">Nothing here yet.</p> : null}
      <div className="space-y-10">
        {groups.map(({ year, thoughts }) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`} className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
              {year}
            </h2>
            <ul className="mt-3 -mx-2">
              {thoughts.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/thoughts/${n.slug}`}
                    className="group flex items-baseline gap-4 px-2 py-1.5"
                  >
                    <time
                      dateTime={n.date}
                      className="w-14 shrink-0 text-[13px] text-fg-3 tabular-nums"
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
    </Chapter>
  );
}
