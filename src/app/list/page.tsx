import type { Metadata } from "next";
import { site } from "@/content/site";
import { crosslists, records, submissions } from "@/content/records";
import { Entry } from "@/components/entry";
import { TldrToggle } from "@/features/tldr";
import { SubscribeBlock } from "@/features/subscribe";
import { ViewSourceLink } from "@/features/view-source";

export const metadata: Metadata = {
  title: "Listings",
  description: `Submissions by ${site.name}: projects, research and cross-lists from the résumé.`,
};

/** Newest first, as on an arXiv listing. */
const byNewest = [...submissions].sort((a, b) => b.id.localeCompare(a.id));

/** arXiv's listing page: jump links, honest counts, then the three sections. */
export default function ListPage() {
  return (
    <div className="wrap list">
      <h1>Submissions by T. Lunn</h1>
      <nav className="jump" aria-label="Sections">
        <a href="#new">New submissions</a>
        <a href="#cross">Cross-lists</a>
        <a href="#replacements">Replacements</a>
      </nav>
      <p className="counts">
        Total of {records.length} entries
        <br />
        Showing up to 25 entries per page: <span className="off">fewer</span> | <span className="off">more</span> |{" "}
        <span className="off">all</span>
      </p>
      <div className="list-tools">
        <TldrToggle />
        <SubscribeBlock />
        <ViewSourceLink />
      </div>

      <h2 id="new">
        New submissions{" "}
        <span>
          (showing {byNewest.length} of {byNewest.length} entries)
        </span>
      </h2>
      <ol className="entries">
        {byNewest.map((r) => (
          <Entry key={r.id} record={r} />
        ))}
      </ol>

      <h2 id="cross">
        Cross-lists{" "}
        <span>
          (showing {crosslists.length} of {crosslists.length} entries)
        </span>
      </h2>
      <ol className="entries">
        {crosslists.map((r) => (
          <Entry key={r.id} record={r} />
        ))}
      </ol>

      <h2 id="replacements">
        Replacements <span>(showing 0 of 0 entries)</span>
      </h2>
      <p className="empty">Nothing has been replaced yet. Retired work will be listed here with its reason.</p>
    </div>
  );
}
