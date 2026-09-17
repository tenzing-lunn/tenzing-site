import type { Metadata } from "next";
import { site } from "@/content/site";
import { formatDate } from "@/lib/dates";
import { lastPlayed } from "@/lib/spotify";

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

export const revalidate = 300;

export default async function NowPage() {
  const track = await lastPlayed();
  return (
    <section>
      <h1 className="text-lg font-medium text-fg">Now</h1>
      <dl className="mt-10 space-y-6">
        {ROWS.map(({ label, key }) => (
          <div key={key}>
            <dt className="font-mono text-xs text-fg-3">{label}</dt>
            <dd className="mt-1 text-fg-2 leading-relaxed">{site.now[key]}</dd>
          </div>
        ))}
        {track ? (
          <div>
            <dt className="font-mono text-xs text-fg-3">Last played</dt>
            <dd className="mt-1 text-fg-2 leading-relaxed">
              <a
                href={track.url}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-fg transition-colors underline-offset-4 hover:underline"
              >
                {track.title}
              </a>
              , {track.artist}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="font-mono text-xs text-fg-3">Last updated</dt>
          <dd className="mt-1 font-mono text-xs text-fg-2">
            <time dateTime={site.now.lastUpdated}>{formatDate(site.now.lastUpdated)}</time>
          </dd>
        </div>
      </dl>
    </section>
  );
}
