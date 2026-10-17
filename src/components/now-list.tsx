import { site } from "@/content/site";
import { formatDate } from "@/lib/dates";
import { Listening } from "@/components/listening";
import { Metatable } from "@/components/metatable";

const ROWS: { label: string; key: keyof typeof site.now }[] = [
  { label: "Where", key: "location" },
  { label: "Working on", key: "workingOn" },
  { label: "Thinking about", key: "thinkingAbout" },
  { label: "Reading", key: "reading" },
  { label: "Learning", key: "learning" },
];

/** The current snapshot, plus whatever is playing on Spotify, as a metatable. */
export function NowList({ className = "" }: { className?: string }) {
  return (
    <Metatable
      className={className}
      rows={[
        ...ROWS.map(({ label, key }) => ({ label, value: site.now[key] })),
        { label: "Listening", value: <Listening /> },
        { label: "Updated", value: <time dateTime={site.now.lastUpdated}>{formatDate(site.now.lastUpdated)}</time> },
      ]}
    />
  );
}
