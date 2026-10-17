import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, type Project } from "@/content/projects";
import { citeAs, displayId, getRecord, isRoutable, submissions, type ArchiveRecord } from "@/content/records";
import { paper } from "@/content/paper";
import { Markdown } from "@/lib/markdown";
import { Dateline, idMonth } from "@/components/dateline";
import { Metatable } from "@/components/metatable";
import { Badge } from "@/components/badge";
import { Sidebar, SideBlock } from "@/components/side-block";
import { BrowseContext } from "@/components/browse-context";
import { CiteButton } from "@/components/cite-modal";
import { ErrataLink } from "@/features/errata";
import { ViewSourceLink } from "@/features/view-source";
import { PaperPage } from "./paper-page";
import { neighbours, SubjectsValue } from "./shared";

type Params = { id: string };

/** One abs page per submission. Cross-lists aren't routable (R3), and any other ID is a 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return submissions.filter(isRoutable).map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const r = getRecord(id);
  if (!r) return {};
  return { title: `${displayId(r.id)}: ${r.title}`, description: r.tldr };
}

const SECTIONS: { key: "why" | "how" | "learned"; title: string }[] = [
  { key: "why", title: "Why I built it" },
  { key: "how", title: "How it works" },
  { key: "learned", title: "What I learned" },
];

export default async function AbsPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const r = getRecord(id);
  if (!r || !isRoutable(r)) notFound();
  if (r.id === paper.id) return <PaperPage record={r} />;
  const p = getProject(r.slug!);
  if (!p) notFound();
  return <ProjectPage record={r} project={p} />;
}

/** A project as a submission: overview = Abstract, why / how / learned = sections, links = Access. */
function ProjectPage({ record: r, project: p }: { record: ArchiveRecord; project: Project }) {
  const primary = r.subjects[0];
  const { prev, next } = neighbours(r);
  return (
    <div className="wrap abs">
      <article className="min-w-0">
        <Dateline submitted={idMonth(r.id)} />
        <h1 className="title">{r.title}</h1>
        <p className="affil">{r.authorsLine}</p>

        <div className="abstract">
          <b className="sc">Abstract:</b>
          {p.overview ? <Markdown source={p.overview} /> : <p>{p.description}</p>}
        </div>

        <Metatable
          rows={[
            ...(r.comments ? [{ label: "Comments", value: r.comments }] : []),
            { label: "Subjects", value: <SubjectsValue record={r} /> },
            { label: "Cite as", detail: true, value: citeAs(r.id, primary).line },
          ]}
        />

        {SECTIONS.map(({ key, title }) =>
          p[key] ? (
            <section key={key} data-detail>
              <h2 className="sec" id={key}>
                {title}
              </h2>
              <div className="sec-rule" />
              <div className="abs-body prose">
                <Markdown source={p[key]} />
              </div>
            </section>
          ) : null,
        )}
      </article>

      <Sidebar>
        <SideBlock title="Access submission:">
          {p.links?.length ? (
            <ul>
              {p.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer noopener">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small">No public links.</p>
          )}
        </SideBlock>
        <ViewSourceLink />
        <SideBlock title="Status">
          <p className="side-badge">
            <Badge status={r.status} />
          </p>
        </SideBlock>
        <BrowseContext context={primary.code} prev={prev} next={next} />
        <SideBlock title="Cite">
          <CiteButton id={r.id} />
        </SideBlock>
        <ErrataLink />
      </Sidebar>
    </div>
  );
}
