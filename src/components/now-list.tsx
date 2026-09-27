import { site } from "@/content/site";
import { formatDate } from "@/lib/dates";
import { Listening } from "@/components/listening";

const ROWS: { label: string; key: keyof typeof site.now }[] = [
  { label: "Where", key: "location" },
  { label: "Working on", key: "workingOn" },
  { label: "Thinking about", key: "thinkingAbout" },
  { label: "Reading", key: "reading" },
  { label: "Learning", key: "learning" },
];

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-1 border-b border-border py-3 first:border-t sm:grid-cols-[180px_1fr] sm:items-baseline">
    <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">{label}</dt>
    <dd className="min-w-0 text-[clamp(17px,1.5vw,21px)] tracking-[-0.015em]">{children}</dd>
  </div>
);

/** The current snapshot, plus whatever is playing on Spotify. */
export function NowList() {
  return (
    <>
      <dl>
        {ROWS.map(({ label, key }) => (
          <Row key={key} label={label}>
            {site.now[key]}
          </Row>
        ))}
        <Row label="Listening">
          <Listening />
        </Row>
      </dl>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
        Updated <time dateTime={site.now.lastUpdated}>{formatDate(site.now.lastUpdated)}</time>
      </p>
    </>
  );
}
