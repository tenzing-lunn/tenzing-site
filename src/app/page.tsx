import Link from "next/link";
import { site } from "@/content/site";
import { recordAbstract } from "@/content/about";
import { citeAs, displayId, person, selected, serialOf, subjectLabel, submissions } from "@/content/records";
import { Intro } from "@/components/intro";
import { Dateline, datelineDate } from "@/components/dateline";
import { HoverCite } from "@/components/hover-cite";
import { Metatable } from "@/components/metatable";
import { Entry } from "@/components/entry";
import { Sidebar, SideBlock } from "@/components/side-block";
import { BrowseContext } from "@/components/browse-context";
import { CiteButton } from "@/components/cite-modal";
import { Tabs } from "@/components/tabs";
import { AskForm } from "@/components/ask-form";
import { NowList } from "@/components/now-list";
import { LiveData } from "@/components/listening";
import { ShortcutList } from "@/components/shortcuts-overlay";
import { SubmissionHistory } from "@/features/version-diff";
import { WorkingDraft } from "@/features/draft";
import { Endorsements } from "@/features/endorsements";
import { GraphPanel } from "@/features/graph";
import { ViewSourceButton } from "@/features/view-source";
import { TldrToggle } from "@/features/tldr";
import { ErrataLink } from "@/features/errata";
import { SubscribeBlock } from "@/features/subscribe";

const primary = person.subjects[0];
const cite = citeAs(person.id, primary, person.version);
const email = site.links.find((l) => l.label === "Email")!.href;
const github = site.links.find((l) => l.label === "GitHub")!.href;

/** The abstract, with each `[yymm.nnnnn]` turned into a hover citation. */
function Abstract() {
  return recordAbstract.split(/\[(\d{4}\.\d{5})\]/).map((part, i) =>
    i % 2 ? <HoverCite key={i} id={part} n={serialOf(part)} /> : part,
  );
}

/** The person record, TL:2610.00001v4, laid out as an arXiv abstract page. */
export default function HomePage() {
  return (
    <>
      <Intro />
      <div className="wrap abs">
        <div className="min-w-0">
          <Dateline submitted={person.versions[0].date} firstHref="/v/1" revised={datelineDate(person.revised)} version={person.version} />
          <h1 className="hero">{person.title}</h1>
          <p className="affil" data-summary>
            {person.affiliation.map((part, i) => (
              <span key={part}>
                {i ? " · " : null}
                {i === 0 ? <Link href="/resume#fordham-university">{part}</Link> : part}
              </span>
            ))}
          </p>

          {/* on a phone the sidebar falls below the fold, so the access links come up here */}
          <p className="access-mobile">
            <Link href="/resume">View résumé (PDF)</Link> · <Link href="/about">HTML (experimental)</Link> ·{" "}
            <a href={github} target="_blank" rel="noreferrer noopener">
              Source (GitHub)
            </a>
          </p>

          <p className="abstract" data-detail>
            <b className="sc">Abstract:</b>
            <Abstract />
          </p>

          <Metatable
            rows={[
              { label: "Comments", value: person.comments },
              {
                label: "Subjects",
                detail: true,
                value: person.subjects.map((s, i) => (
                  <span key={s.code}>
                    {i ? "; " : null}
                    {i ? subjectLabel(s) : <b>{subjectLabel(s)}</b>}
                  </span>
                )),
              },
              {
                label: "Cite as",
                detail: true,
                value: (
                  <>
                    {cite.line}
                    <br />
                    <span className="quiet">{cite.versioned}</span>
                  </>
                ),
              },
              { label: "Contact", value: <a href={email}>{person.contact}</a> },
              { label: "Reading", detail: true, value: site.now.reading.replace(/\.$/, "") },
            ]}
          />

          <h2 className="sec" id="submissions">
            Selected submissions <span className="label">showing {selected.length} of {submissions.length}</span>
          </h2>
          <div className="sec-rule" />
          <ol className="entries">
            {selected.map((r) => (
              <Entry key={r.id} record={r} />
            ))}
          </ol>

          <div data-detail>
            <h2 className="sec" id="history">
              Submission history
            </h2>
            <div className="sec-rule" />
            <p className="hist-from">
              From: {person.title} [<a href={email}>view email</a>]
            </p>
            <SubmissionHistory current={person.version} />
            <WorkingDraft />
          </div>

          <div data-detail>
            <Endorsements />
          </div>

          <div data-detail>
            <Tabs
              label="Tools"
              tabs={[
                {
                  id: "ask",
                  label: "Ask",
                  panel: (
                    <>
                      <h4>Query this record</h4>
                      <p className="sub">Answers come only from what is written on this site.</p>
                      <AskForm />
                    </>
                  ),
                },
                { id: "graph", label: "Graph", panel: <GraphPanel /> },
                { id: "now", label: "Now", panel: <NowList className="m-0" /> },
                { id: "shortcuts", label: "Shortcuts", panel: <ShortcutList className="m-0" /> },
              ]}
            />
          </div>
        </div>

        <Sidebar>
          <SideBlock title="Access record:">
            <ul>
              <li>
                <Link href="/resume">View résumé (PDF)</Link>
              </li>
              <li>
                <Link href="/about">HTML (experimental)</Link>
              </li>
              <li>
                <a href={github} target="_blank" rel="noreferrer noopener">
                  Source (GitHub)
                </a>
              </li>
              <li>
                <ViewSourceButton />
              </li>
            </ul>
          </SideBlock>
          <BrowseContext context={primary.code} next={submissions.find((r) => r.subjects[0].code === primary.code)} />
          <SideBlock title="Cite this person">
            <CiteButton />
          </SideBlock>
          <TldrToggle />
          <ErrataLink />
          <SubscribeBlock />
          <SideBlock title="References & links">
            <ul>
              {site.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer noopener">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </SideBlock>
          <LiveData />
          <p className="side-fine">
            <a href={`${email}?subject=${encodeURIComponent(`Report an issue with ${displayId(person.id)}`)}`}>Report an issue with this person</a>
          </p>
        </Sidebar>
      </div>
    </>
  );
}
