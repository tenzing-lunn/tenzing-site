import { getProject } from "@/content/projects";
import { citeAs, type ArchiveRecord } from "@/content/records";
import { abstractLead, abstractRest, paper } from "@/content/paper";
import { Markdown } from "@/lib/markdown";
import { Dateline } from "@/components/dateline";
import { AbstractFold } from "@/components/abstract-fold";
import { Metatable } from "@/components/metatable";
import { Badge } from "@/components/badge";
import { Sidebar, SideBlock } from "@/components/side-block";
import { BrowseContext } from "@/components/browse-context";
import { CiteButton } from "@/components/cite-modal";
import { ErrataLink } from "@/features/errata";
import { ViewSourceButton } from "@/features/view-source";
import { neighbours, SubjectsValue } from "./shared";

/** The project write-up that sits under the paper: why and how, in the author's words. */
const WRITE_UP: { key: "why" | "how" | "learned"; title: string }[] = [
  { key: "why", title: "Why this question" },
  { key: "how", title: "How the study works" },
  { key: "learned", title: "What I learned" },
];

/**
 * TL:2605.00003, the NeurIPS workshop paper. The title, abstract, warning,
 * table and limitations come from paper.ts (the submitted PDF); the PDF itself
 * is withheld while review is double-blind.
 */
export function PaperPage({ record: r }: { record: ArchiveRecord }) {
  const primary = r.subjects[0];
  const project = getProject(r.slug!);
  const { prev, next } = neighbours(r);

  return (
    <div className="wrap abs">
      <article className="min-w-0">
        <Dateline submitted={paper.submitted} note={`to ${paper.venue}: decision pending`} />
        <h1 className="title">{paper.title}</h1>
        <p className="affil">
          {paper.authorsLine} · {paper.affiliation}
        </p>

        <p className="warn">
          <b>Content warning.</b> {paper.contentWarning}
        </p>

        <AbstractFold lead={abstractLead} rest={abstractRest} />

        <Metatable
          rows={[
            { label: "Comments", value: paper.comments },
            { label: "Subjects", value: <SubjectsValue record={r} /> },
            { label: "Cite as", detail: true, value: citeAs(r.id, primary).line },
            { label: "Model", detail: true, value: paper.model },
          ]}
        />

        <h2 className="sec" id="results">
          Headline results
        </h2>
        <div className="sec-rule" />
        <table className="bk">
          <caption>
            <b>Table 1:</b>
            {paper.table1.caption}
          </caption>
          <thead>
            <tr>
              <th scope="col">Measure</th>
              <th scope="col" className="r">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {paper.table1.rows.map((row) => (
              <tr key={row.label} className={row.best ? "best" : undefined}>
                <td>{row.label}</td>
                <td className="r">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div data-detail>
          <h2 className="sec" id="notes">
            Notes from the author
          </h2>
          <div className="sec-rule" />
          <div className="cols2">
            <div>
              <h4>My contribution</h4>
              <ul>
                {paper.contributions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Limitations, stated plainly</h4>
              <ul>
                {paper.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {project ? (
          <div data-detail id="write-up">
            {WRITE_UP.map(({ key, title }) =>
              project[key] ? (
                <section key={key}>
                  <h2 className="sec">{title}</h2>
                  <div className="sec-rule" />
                  <div className="abs-body prose">
                    <Markdown source={project[key]} />
                  </div>
                </section>
              ) : null,
            )}
          </div>
        ) : null}

        <div data-detail>
          <h2 className="sec" id="history">
            Submission history
          </h2>
          <div className="sec-rule" />
          <ul className="hist">
            <li className="now">
              <span className="v">[v1]</span>
              <span className="d">{paper.submitted}</span>
              Submitted to {paper.venue} (anonymized, {paper.pages} pp)
            </li>
          </ul>
        </div>
      </article>

      <Sidebar>
        <SideBlock title="Access paper:">
          <p className="withheld">PDF: withheld during double-blind review</p>
          <details className="whatis">
            <summary>(what is this?)</summary>
            <p>Workshop reviewers read the paper without author names, so the PDF stays off this site until decisions are out.</p>
          </details>
          <ul className="side-list">
            <li>
              <a href="#write-up">Write-up (HTML)</a>
            </li>
            <li>
              Code <span className="small">(after review)</span>
            </li>
            <li>
              <ViewSourceButton />
            </li>
          </ul>
        </SideBlock>
        <SideBlock title="Status">
          <p className="side-badge">
            <Badge status={paper.status} />
          </p>
          <p className="small">{paper.venue}</p>
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
