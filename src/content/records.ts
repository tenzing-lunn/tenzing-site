/**
 * The archive: every project and résumé item as a lunnXiv record, plus the
 * person record itself. Nothing here is new prose. Each field is picked from
 * projects.ts, resume.ts, site.ts or paper.ts, so a fact only ever lives in
 * one place. IDs are `YYMM.NNNNN` (start month, then a serial); `TL:` is
 * added only for display. Undated items use `26xx`.
 */

import { site } from "@/content/site";
import { getProject, type Project } from "@/content/projects";
import { education, experience, leadership, resumeProjects, skills, type ResumeEntry } from "@/content/resume";
import { paper } from "@/content/paper";

export type Status = "live" | "prog" | "rev" | "done";

export const STATUS_LABEL: { [S in Status]: string } = {
  live: "Live",
  prog: "In progress",
  rev: "Under review",
  done: "Concluded",
};

export type Subject = { code: string; name: string };
export type Format = { label: string; href: string };

export type ArchiveRecord = {
  /** "2605.00003". Shown as TL:2605.00003. */
  id: string;
  /** The project slug, where the record has a project page. */
  slug?: string;
  title: string;
  status: Status;
  /** The primary subject first. */
  subjects: Subject[];
  authorsLine: string;
  comments?: string;
  tldr: string;
  /** Longer text that ▽ More unfolds. */
  abstract?: string;
  formats: Format[];
  kind: "submission" | "crosslist";
  /** The abs page for a submission, or the résumé anchor for a cross-list. */
  href: string;
  /** Calendar year of the start month, when one is known. */
  year?: number;
};
export type { ArchiveRecord as Record };

const SUBJECTS: { [code: string]: string } = {
  "cs.LG": "Machine Learning",
  "cs.AI": "Artificial Intelligence",
  "cs.CL": "Computation and Language",
  "cs.SE": "Software Engineering",
  "cs.DB": "Databases",
  "cs.CY": "Computers and Society",
  "q-fin.CP": "Computational Finance",
  "stat.AP": "Applications",
  "stat.ML": "Machine Learning",
  "pm.PR": "Product",
  math: "Mathematics",
  "life.MED": "Meditation",
  "life.ART": "Art",
};

const subjects = (...codes: string[]): Subject[] => codes.map((code) => ({ code, name: SUBJECTS[code] ?? code }));

/** `Machine Learning (cs.LG)` */
export const subjectLabel = (s: Subject) => `${s.name} (${s.code})`;

/** The archive a primary subject belongs to: cs.LG → cs. */
export const archiveOf = (s: Subject) => s.code.split(".")[0];

export const displayId = (id: string) => `TL:${id}`;

/** The serial at the end of an ID, used as the listing index [n]. */
export const serialOf = (id: string) => Number(id.split(".")[1]);

/** The id the résumé page gives an entry, so cross-lists can link to it. */
export const resumeAnchor = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const yearOf = (id: string) => (/^\d{2}\d{2}\./.test(id) ? 2000 + Number(id.slice(0, 2)) : undefined);

const resumeEntry = (list: ResumeEntry[], title: string): ResumeEntry => {
  const e = list.find((x) => x.title === title);
  if (!e) throw new Error(`records.ts: no résumé entry "${title}"`);
  return e;
};

const project = (slug: string): Project => {
  const p = getProject(slug);
  if (!p) throw new Error(`records.ts: no project "${slug}"`);
  return p;
};

/** The résumé entry whose write-up is this project's page. */
const experienceFor = (slug: string) => experience.find((e) => e.href === `/projects/${slug}`);

/** A submission built from its project page and its résumé line. */
function submission(id: string, slug: string, status: Status, codes: string[]): ArchiveRecord {
  const p = project(slug);
  const e = experienceFor(slug);
  const role = e ? [e.role, e.title !== p.name ? e.title : ""].filter(Boolean).join(", ") : "";
  return {
    id,
    slug,
    title: p.name,
    status,
    subjects: subjects(...codes),
    authorsLine: ["T. Lunn", role, e?.dates].filter(Boolean).join(" · "),
    comments: [p.tech?.join(", "), p.proof].filter(Boolean).join(". "),
    tldr: e?.headline ?? p.description,
    abstract: p.description,
    formats: [
      { label: "html", href: `/abs/${id}` },
      ...(p.links ?? []).map((l) => ({ label: l.label.toLowerCase(), href: l.href })),
    ],
    kind: "submission",
    href: `/abs/${id}`,
    year: yearOf(id),
  };
}

/** A cross-list: a résumé entry with no project page. Shown, never routed. */
function crosslist(id: string, entry: ResumeEntry, status: Status, codes: string[]): ArchiveRecord {
  const href = `/resume#${resumeAnchor(entry.title)}`;
  return {
    id,
    title: entry.title,
    status,
    subjects: subjects(...codes),
    authorsLine: ["T. Lunn", entry.role, entry.dates].filter(Boolean).join(" · "),
    comments: [entry.subtitle, entry.location].filter(Boolean).join(" · ") || undefined,
    tldr: entry.headline ?? entry.bullets[0] ?? "",
    abstract: entry.bullets.join(" "),
    formats: [{ label: "résumé", href }],
    kind: "crosslist",
    href,
    year: yearOf(id),
  };
}

const theNote = submission("2605.00003", "correct-the-note", "rev", ["cs.LG", "cs.AI", "cs.CL"]);

/** The five submissions, by ID. */
export const submissions: ArchiveRecord[] = [
  submission("2512.00001", "the-network", "done", ["pm.PR", "cs.CY"]),
  submission("2604.00002", "nuverum-crm", "live", ["cs.SE", "cs.DB"]),
  {
    ...theNote,
    title: paper.title,
    authorsLine: `T. Lunn + 3 co-authors (${paper.affiliation})`,
    comments: `Submitted to ${paper.venue}. ${paper.pages} pages.`,
    tldr: paper.tldr,
    // Double-blind review: no code link until decisions are out (DESIGN.md §9).
    formats: theNote.formats.filter((f) => f.label !== "code"),
  },
  submission("2608.00004", "meditate-with-me", "live", ["cs.SE", "life.MED"]),
  submission("2609.00005", "compute-futures", "prog", ["q-fin.CP", "stat.AP"]),
];

/** Résumé items without a project page. */
export const crosslists: ArchiveRecord[] = [
  crosslist("2601.00006", resumeEntry(resumeProjects, "LXIVNY"), "live", ["cs.SE"]),
  crosslist("26xx.00007", resumeEntry(resumeProjects, "AI Command Center"), "live", ["cs.AI"]),
  crosslist("26xx.00008", resumeEntry(resumeProjects, "Tennis Prediction Engine"), "done", ["stat.ML"]),
  crosslist("2308.00009", resumeEntry(leadership, "Mindfulness and Meditation Club"), "done", ["life.MED"]),
  crosslist("2308.00010", resumeEntry(leadership, "Art with Kindergarten Kids"), "done", ["life.ART"]),
];

export const records: ArchiveRecord[] = [...submissions, ...crosslists];

/** Order for "Selected submissions" on the home page: the paper first. */
export const selected: ArchiveRecord[] = ["2605.00003", "2609.00005", "2608.00004", "2604.00002", "2512.00001"].map(
  (id) => submissions.find((r) => r.id === id)!,
);

export const getRecord = (id: string) => records.find((r) => r.id === id);
export const getRecordBySlug = (slug: string) => records.find((r) => r.slug === slug);
/** Only submissions have an abs page (R3). */
export const isRoutable = (r: ArchiveRecord) => r.kind === "submission";

/* ---------- the person record ---------- */

const fordham = resumeEntry(education, "Fordham University");
const uwc = resumeEntry(education, "United World College Dilijan");
const algoverse = resumeEntry(experience, "Algoverse AI Research");
const languages = skills.find((s) => s.label === "Languages")?.value ?? "";

export type Version = { v: number; date: string; label: string };

export const person = {
  id: "2610.00001",
  version: 4,
  title: site.name,
  /** "B.S. in Mathematics & Computer Science (3-2 …)" → "B.S. Mathematics & Computer Science" */
  affiliation: [
    fordham.title,
    (fordham.subtitle ?? "").replace(" in ", " ").replace(/\s*\(.*\)$/, ""),
    fordham.location,
  ].filter(Boolean) as string[],
  /** The last time the site's own snapshot was updated (day-precise, from site.ts). */
  revised: site.now.lastUpdated,
  versions: [
    { v: 1, date: "Aug 2023", label: `${uwc.title} · ${uwc.role}` },
    { v: 2, date: "2025", label: `${fordham.title} · ${fordham.role}` },
    { v: 3, date: "May 2026", label: `${algoverse.title} · ${algoverse.subtitle}` },
    { v: 4, date: "Sep 2026", label: `${paper.venue} submission` },
  ] as Version[],
  subjects: subjects("cs.LG", "math", "q-fin.CP", "cs.SE", "life.MED"),
  comments: [
    `${submissions.length} submissions; ${submissions.filter((r) => r.status === "rev").length} under review at ${paper.venue}.`,
    `${fordham.headline?.split(" · ")[0]}.`,
    `${languages}.`,
  ].join(" "),
  contact: site.links.find((l) => l.label === "Email")?.href.replace("mailto:", "") ?? "",
};

/** `TL:2610.00001 [cs.LG]` and `(or TL:2610.00001v4 [cs.LG] for this version)` */
export function citeAs(id: string, primary: Subject, version?: number) {
  const base = `${displayId(id)} [${primary.code}]`;
  return { line: base, versioned: version ? `(or ${displayId(id)}v${version} [${primary.code}] for this version)` : undefined };
}

/* ---------- citations ---------- */

export type Citation = { bibtex: string; apa: string; plain: string };

const bibKey = (title: string, year: number) =>
  `lunn${year}${resumeAnchor(title).split("-").find((w) => w.length > 3) ?? ""}`;

/** BibTeX / APA / plain text for the person (no id) or one record. */
export function citation(id?: string): Citation {
  const base = site.url.replace(/\/$/, "");
  if (!id || id === person.id) {
    const primary = person.subjects[0];
    const tag = `${displayId(person.id)}v${person.version}`;
    const year = Number(person.revised.slice(0, 4));
    return {
      bibtex: [
        `@misc{lunn${year},`,
        `  title  = {${person.title}},`,
        `  author = {Lunn, Tenzing},`,
        `  year   = {${year}},`,
        `  note   = {${tag} [${primary.code}]. ${person.affiliation.slice(0, 2).join(", ")}},`,
        `  url    = {${base}}`,
        `}`,
      ].join("\n"),
      apa: `Lunn, T. (${year}). ${person.title} (${tag}) [Person record]. lunnXiv. ${base}`,
      plain: `${person.title}. ${tag} [${primary.code}]. lunnXiv, ${year}. ${base}`,
    };
  }
  const r = getRecord(id);
  if (!r) return citation();
  const year = r.year ?? Number(person.revised.slice(0, 4));
  const url = isRoutable(r) ? `${base}${r.href}` : `${base}/resume`;
  const coauthors = r.id === paper.id;
  return {
    bibtex: [
      `@misc{${bibKey(r.title, year)},`,
      `  title  = {${r.title}},`,
      `  author = {Lunn, Tenzing${coauthors ? " and others" : ""}},`,
      `  year   = {${year}},`,
      `  note   = {${displayId(r.id)} [${r.subjects[0].code}]${coauthors ? `. Under review, ${paper.venue}` : ""}},`,
      `  url    = {${url}}`,
      `}`,
    ].join("\n"),
    apa: `Lunn, T.${coauthors ? ", et al." : ""} (${year}). ${r.title} (${displayId(r.id)}). lunnXiv. ${url}`,
    plain: `${coauthors ? "T. Lunn et al." : "T. Lunn."} ${r.title}. ${displayId(r.id)} [${r.subjects[0].code}], lunnXiv, ${year}. ${url}`,
  };
}
