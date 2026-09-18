import type { Metadata } from "next";
import { site } from "@/content/site";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${site.firstName} is doing right now.`,
};

const ROWS: { label: string; key: keyof typeof site.now }[] = [
  { label: "Location", key: "location" },
  { label: "Working on", key: "workingOn" },
  { label: "Thinking about", key: "thinkingAbout" },
  { label: "Reading", key: "reading" },
  { label: "Learning", key: "learning" },
];

/** Label on the left, value on the right, so the whole snapshot fits on one screen. */
export default function NowPage() {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold leading-tight text-fg">Now</h1>
      <dl className="mt-8 grid gap-y-3 sm:grid-cols-[8rem_1fr] sm:gap-x-6">
        {ROWS.map(({ label, key }) => (
          <div key={key} className="contents">
            <dt className="font-mono text-xs leading-7 text-fg-3">{label}</dt>
            <dd className="-mt-2 text-fg-2 leading-7 sm:mt-0">{site.now[key]}</dd>
          </div>
        ))}
        <div className="contents">
          <dt className="font-mono text-xs leading-7 text-fg-3">Last updated</dt>
          <dd className="-mt-2 font-mono text-xs leading-7 text-fg-2 sm:mt-0">
            <time dateTime={site.now.lastUpdated}>{formatDate(site.now.lastUpdated)}</time>
          </dd>
        </div>
      </dl>
    </section>
  );
}
