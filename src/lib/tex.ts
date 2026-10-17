/**
 * The LaTeX source of a page, generated from content for the view-source
 * overlay (`\`). Nothing here is hand-written prose: every line is read from
 * records.ts, paper.ts, projects.ts, about.ts and site.ts, then escaped, so
 * the output would compile with pdflatex.
 *
 * Covers `/` (the person record), `/list` and `/abs/<id>`; any other route
 * has no source and texFor returns null.
 */

import { site } from "@/content/site";
import { recordAbstract } from "@/content/about";
import { getProject } from "@/content/projects";
import { paper } from "@/content/paper";
import {
  STATUS_LABEL,
  citation,
  citeAs,
  crosslists,
  displayId,
  getRecord,
  isRoutable,
  person,
  records,
  selected,
  serialOf,
  subjectLabel,
  submissions,
  type ArchiveRecord,
} from "@/content/records";
import { datelineDate, idMonth } from "@/components/dateline";
import { escapeTex as esc, escapeUrl } from "@/lib/tex-escape";

export { escapeTex } from "@/lib/tex-escape";

export type TexSource = { filename: string; tex: string };

const base = site.url.replace(/\/$/, "");
const abs = (href: string) => (href.startsWith("/") ? `${base}${href}` : href);
const href = (url: string, label: string) => `\\href{${escapeUrl(abs(url))}}{${esc(label)}}`;

/** `\item` and `\\` both look for a `[` next; a `{}` stops text like "[v1]" being read as an option. */
const lead = (tex: string) => (tex.startsWith("[") ? `{}${tex}` : tex);
const item = (tex: string) => `  \\item ${lead(tex)}`;
const br = " \\\\";

const list = (env: "itemize" | "enumerate", items: string[]) => [`\\begin{${env}}`, ...items.map(item), `\\end{${env}}`];

/** Metadata rows as a description list, the metatable's TeX shape. */
const describe = (rows: [label: string, tex: string | undefined][]) => [
  "\\begin{description}",
  ...rows.filter(([, tex]) => tex).map(([label, tex]) => `  \\item[${esc(label)}] ${lead(tex!)}`),
  "\\end{description}",
];

const subjectsTex = (r: Pick<ArchiveRecord, "subjects">) =>
  r.subjects.map((s, i) => (i ? esc(subjectLabel(s)) : `\\textbf{${esc(subjectLabel(s))}}`)).join("; ");

/* ---------- Markdown (projects.ts section bodies) ---------- */

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/** The inline subset lib/markdown.tsx renders: links, code, bold, italic. */
function inline(text: string): string {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    out += esc(text.slice(last, at));
    if (m[1] !== undefined) out += href(m[2], m[1]);
    else if (m[3] !== undefined) out += `\\texttt{${esc(m[3])}}`;
    else if (m[4] !== undefined) out += `\\textbf{${esc(m[4])}}`;
    else out += `\\emph{${esc(m[5])}}`;
    last = at + m[0].length;
  }
  return out + esc(text.slice(last));
}

/** The block subset lib/markdown.tsx renders, as LaTeX paragraphs and lists. */
function markdown(src: string): string[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  const starts = (l: string) => /^(#{1,3}\s|>|[-*]\s+|\d+\.\s+|```)/.test(l);
  let i = 0;
  const take = (re: RegExp) => {
    const got: string[] = [];
    while (i < lines.length && re.test(lines[i])) got.push(lines[i++].replace(re, ""));
    return got;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (out.length) out.push("");
    if (line.startsWith("```")) {
      i++;
      const code: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      out.push("\\begin{verbatim}", ...code, "\\end{verbatim}");
    } else if (/^#{1,3}\s/.test(line)) {
      out.push(`\\subsection*{${inline(line.replace(/^#{1,3}\s+/, "").trim())}}`);
      i++;
    } else if (/^>/.test(line)) {
      out.push("\\begin{quote}", ...take(/^>\s?/).map(inline), "\\end{quote}");
    } else if (/^[-*]\s+/.test(line)) {
      out.push(...list("itemize", take(/^[-*]\s+/).map(inline)));
    } else if (/^\d+\.\s+/.test(line)) {
      out.push(...list("enumerate", take(/^\d+\.\s+/).map(inline)));
    } else {
      const para = [lines[i++]];
      while (i < lines.length && lines[i].trim() && !starts(lines[i])) para.push(lines[i++]);
      out.push(inline(para.join(" ")));
    }
  }
  return out;
}

/* ---------- the document ---------- */

function texDocument(opts: {
  about: string;
  packages?: string[];
  title: string;
  author: string;
  date: string;
  body: string[];
}): string {
  return [
    `% ${opts.about}`,
    "% Generated from the site's content by src/lib/tex.ts. Not hand-written.",
    "\\documentclass{article}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage[utf8]{inputenc}",
    ...(opts.packages ?? []).map((p) => `\\usepackage{${p}}`),
    "\\usepackage{hyperref}",
    "",
    `\\title{${opts.title}}`,
    `\\author{${opts.author}}`,
    `\\date{${opts.date}}`,
    "",
    "\\begin{document}",
    "\\maketitle",
    "",
    ...opts.body,
    "",
    "\\end{document}",
    "",
  ].join("\n");
}

/* ---------- / ---------- */

function personTex(): TexSource {
  const primary = person.subjects[0];
  const cite = citeAs(person.id, primary, person.version);
  const email = site.links.find((l) => l.label === "Email")!.href;
  const cited = [...recordAbstract.matchAll(/\[(\d{4}\.\d{5})\]/g)].map((m) => m[1]);
  // [2605.00003] in the abstract becomes \cite{2605.00003}, resolved below
  const abstract = recordAbstract
    .split(/\[(\d{4}\.\d{5})\]/)
    .map((part, i) => (i % 2 ? `\\cite{${part}}` : esc(part)))
    .join("");
  const first = person.versions[0];

  return {
    filename: `${person.id}v${person.version}.tex`,
    tex: texDocument({
      about: `${displayId(person.id)}v${person.version} [${primary.code}]: the person record.`,
      title: esc(person.title),
      author: [esc(person.title), ...person.affiliation.map((a) => `\\small ${esc(a)}`)].join(br + " "),
      date: esc(`Submitted ${first.date} (v1), last revised ${datelineDate(person.revised)} (this version, v${person.version})`),
      body: [
        "\\begin{abstract}",
        abstract,
        "\\end{abstract}",
        "",
        ...describe([
          ["Comments", esc(person.comments)],
          ["Subjects", subjectsTex(person)],
          ["Cite as", esc(cite.line) + (cite.versioned ? `${br}\n    ${esc(cite.versioned)}` : "")],
          ["Contact", `\\href{${escapeUrl(email)}}{${esc(person.contact)}}`],
          ["Reading", esc(site.now.reading.replace(/\.$/, ""))],
        ]),
        "",
        `\\section*{Selected submissions}`,
        `% showing ${selected.length} of ${submissions.length}`,
        ...list(
          "itemize",
          selected.map(
            (r) => `\\texttt{${esc(displayId(r.id))}} [${esc(STATUS_LABEL[r.status])}] \\textbf{${esc(r.title)}}.${br}\n    ${esc(r.tldr)}`,
          ),
        ),
        "",
        "\\section*{Submission history}",
        `From: ${esc(person.title)}`,
        "\\begin{description}",
        ...person.versions.map(
          (v) => `  \\item[{[v${v.v}]}] ${esc(`${v.date}, ${v.label}`)}${v.v === person.version ? " (this version)" : ""}`,
        ),
        "\\end{description}",
        "",
        `\\begin{thebibliography}{${cited.length}}`,
        ...cited.map((id) => `  \\bibitem{${id}} ${esc(citation(id).plain)}`),
        "\\end{thebibliography}",
      ],
    }),
  };
}

/* ---------- /list ---------- */

/** One listing entry, in the order the page shows it. */
function entryTex(r: ArchiveRecord): string {
  const formats = r.formats.map((f) => href(f.href, f.label)).join(", ");
  const crosslist = r.kind === "crosslist" ? ` \\emph{(cross-list from ${esc(r.subjects[0].code)})}` : "";
  const lines = [
    `\\texttt{${esc(displayId(r.id))}} [${formats}]${crosslist} \\textsc{${esc(STATUS_LABEL[r.status])}}`,
    `\\textbf{${esc(r.title)}}`,
    `Authors: ${esc(r.authorsLine)}`,
    ...(r.comments ? [`Comments: ${esc(r.comments)}`] : []),
    `Subjects: ${subjectsTex(r)}`,
    `TL;DR: ${esc(r.tldr)}`,
  ];
  return `\\item[{[${serialOf(r.id)}]}] ${lines.join(`${br}\n    `)}`;
}

function section(title: string, entries: ArchiveRecord[]): string[] {
  return [
    "",
    `\\section*{${title}}`,
    `(showing ${entries.length} of ${entries.length} entries)`,
    ...(entries.length ? ["\\begin{description}", ...entries.map((r) => `  ${entryTex(r)}`), "\\end{description}"] : []),
  ];
}

function listTex(): TexSource {
  const byNewest = [...submissions].sort((a, b) => b.id.localeCompare(a.id));
  return {
    filename: "list.tex",
    tex: texDocument({
      about: `The listing: ${records.length} entries.`,
      title: `Submissions by ${esc("T. Lunn")}`,
      author: esc(site.name),
      date: `Total of ${records.length} entries`,
      body: [...section("New submissions", byNewest), ...section("Cross-lists", crosslists), ...section("Replacements", [])].slice(1),
    }),
  };
}

/* ---------- /abs/<id> ---------- */

function projectTex(r: ArchiveRecord): TexSource | null {
  const p = r.slug ? getProject(r.slug) : undefined;
  if (!p) return null;
  const sections: [key: "why" | "how" | "learned", title: string][] = [
    ["why", "Why I built it"],
    ["how", "How it works"],
    ["learned", "What I learned"],
  ];
  return {
    filename: `${r.id}.tex`,
    tex: texDocument({
      about: `${displayId(r.id)} [${r.subjects[0].code}]: ${r.title}.`,
      title: esc(r.title),
      author: esc(r.authorsLine),
      date: esc(`Submitted ${idMonth(r.id)}`),
      body: [
        "\\begin{abstract}",
        ...(p.overview ? markdown(p.overview) : [esc(p.description)]),
        "\\end{abstract}",
        "",
        ...describe([
          ["Comments", r.comments ? esc(r.comments) : undefined],
          ["Subjects", subjectsTex(r)],
          ["Cite as", esc(citeAs(r.id, r.subjects[0]).line)],
          ["Status", esc(STATUS_LABEL[r.status])],
        ]),
        ...sections.flatMap(([key, title]) => (p[key] ? ["", `\\section{${title}}`, ...markdown(p[key]!)] : [])),
        "",
        "\\section*{Access}",
        ...(p.links?.length ? list("itemize", p.links.map((l) => href(l.href, l.label))) : ["No public links."]),
      ],
    }),
  };
}

function paperTex(r: ArchiveRecord): TexSource {
  const project = r.slug ? getProject(r.slug) : undefined;
  const writeUp: [key: "why" | "how" | "learned", title: string][] = [
    ["why", "Why this question"],
    ["how", "How the study works"],
    ["learned", "What I learned"],
  ];
  const row = (label: string, value: string, best?: boolean) =>
    best ? `  \\textbf{${esc(label)}} & \\textbf{${esc(value)}} \\\\` : `  ${esc(label)} & ${esc(value)} \\\\`;

  return {
    filename: `${paper.id}.tex`,
    tex: texDocument({
      about: `${displayId(paper.id)} [${r.subjects[0].code}]: under review at ${paper.venue}. PDF withheld during double-blind review.`,
      packages: ["booktabs"],
      title: esc(paper.title),
      author: `${esc(paper.authorsLine)}${br} \\small ${esc(paper.affiliation)}`,
      date: esc(`Submitted ${paper.submitted} to ${paper.venue}: decision pending`),
      body: [
        `\\noindent\\textbf{Content warning.} ${esc(paper.contentWarning)}`,
        "",
        "\\begin{abstract}",
        esc(paper.abstract),
        "\\end{abstract}",
        "",
        ...describe([
          ["Comments", esc(paper.comments)],
          ["Subjects", subjectsTex(r)],
          ["Cite as", esc(citeAs(r.id, r.subjects[0]).line)],
          ["Model", esc(paper.model)],
        ]),
        "",
        "\\section*{Headline results}",
        "\\begin{table}[h]",
        "\\centering",
        `\\caption{${esc(paper.table1.caption)}}`,
        "\\begin{tabular}{lr}",
        "  \\toprule",
        row("Measure", "Value"),
        "  \\midrule",
        ...paper.table1.rows.map((x) => row(x.label, x.value, x.best)),
        "  \\bottomrule",
        "\\end{tabular}",
        "\\end{table}",
        "",
        "\\section*{Notes from the author}",
        "\\subsection*{My contribution}",
        ...list("itemize", paper.contributions.map(esc)),
        "\\subsection*{Limitations, stated plainly}",
        ...list("itemize", paper.limitations.map(esc)),
        ...writeUp.flatMap(([key, title]) =>
          project?.[key] ? ["", `\\section*{${title}}`, ...markdown(project[key]!)] : [],
        ),
        "",
        "\\section*{Submission history}",
        "\\begin{description}",
        `  \\item[{[v1]}] ${esc(`${paper.submitted}, submitted to ${paper.venue} (anonymized, ${paper.pages} pp)`)}`,
        "\\end{description}",
      ],
    }),
  };
}

/** The TeX source for a pathname, or null where a page has none. */
export function texFor(pathname: string): TexSource | null {
  const path = pathname.replace(/(.)\/+$/, "$1");
  if (path === "/") return personTex();
  if (path === "/list") return listTex();
  const id = /^\/abs\/([^/]+)$/.exec(path)?.[1];
  const r = id ? getRecord(decodeURIComponent(id)) : undefined;
  if (!r || !isRoutable(r)) return null;
  return r.id === paper.id ? paperTex(r) : projectTex(r);
}
