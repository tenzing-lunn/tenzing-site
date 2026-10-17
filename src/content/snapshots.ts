/**
 * The person record as of each version, for /v/[n] and /diff. v1–v3 are
 * reconstructed from the résumé: every field names the content entry it comes
 * from: résumé entries dated on or before that version, plus the undated bio
 * in about.ts. Other undated items (interests, the `26xx` records) first appear in v4. v4 is the live
 * record itself, imported, never copied.
 *
 * `[yymm.nnnnn]` in an abstract cites that record, as in about.ts.
 */

import { recordAbstract } from "@/content/about";
import { education, experience, leadership, resumeProjects, type ResumeEntry } from "@/content/resume";
import { displayId, getRecord, person, records, type Version } from "@/content/records";

export type Sourced<T> = { value: T; source: string };

export type Snapshot = Version & {
  affiliation: Sourced<string[]>;
  /** Sentence by sentence, each with the entries it rests on. */
  abstract: Sourced<string>[];
  /** Record IDs that existed by this version. */
  submissions: Sourced<string>[];
  /** False for v4, which is the live record rather than a reconstruction. */
  reconstructed: boolean;
};

const LISTS: { [name: string]: ResumeEntry[] } = { education, experience, resumeProjects, leadership };

/** `resume.ts:education[1]`, found by title so it can't drift from the file. */
function cite(title: string): string {
  for (const [name, list] of Object.entries(LISTS)) {
    const i = list.findIndex((e) => e.title === title);
    if (i >= 0) return `resume.ts:${name}[${i}]${list[i].dates ? ` (${list[i].dates})` : ""}`;
  }
  throw new Error(`snapshots.ts: no résumé entry "${title}"`);
}

const entry = (list: ResumeEntry[], title: string) => list.find((e) => e.title === title)!;
const uwc = entry(education, "United World College Dilijan");

/** A record and the résumé line whose dates put it in this version. */
function rec(id: string): Sourced<string> {
  const r = getRecord(id);
  if (!r) throw new Error(`snapshots.ts: no record "${id}"`);
  const fromResume = r.slug ? experience.find((e) => e.href === `/projects/${r.slug}`)?.title : r.title;
  return { value: id, source: fromResume ? cite(fromResume) : `projects.ts:${r.slug}` };
}

const BIO = "about.ts:bio";
const both = (...sources: string[]) => sources.join("; ");

const meta = (v: number) => person.versions.find((x) => x.v === v)!;

const fordhamAffiliation: Sourced<string[]> = { value: person.affiliation, source: cite("Fordham University") };
const fordhamLead: Sourced<string> = {
  value:
    "We present Tenzing Lunn, a student at Fordham University studying mathematics and computer science on the 3-2 program with Columbia.",
  source: cite("Fordham University"),
};
const uwcClubs = [rec("2308.00009"), rec("2308.00010")];

export const snapshots: Snapshot[] = [
  {
    ...meta(1),
    reconstructed: true,
    affiliation: { value: [uwc.title, uwc.location!], source: cite(uwc.title) },
    abstract: [
      { value: "We present Tenzing Lunn, a student at UWC Dilijan in Armenia.", source: both(BIO, cite(uwc.title)) },
      {
        value:
          "Raised in Los Angeles, the subject leads a mindfulness and meditation club [2308.00009] and has founded weekly art sessions for kindergarten children [2308.00010].",
        source: both(BIO, cite("Mindfulness and Meditation Club"), cite("Art with Kindergarten Kids")),
      },
    ],
    submissions: uwcClubs,
  },
  {
    ...meta(2),
    reconstructed: true,
    affiliation: fordhamAffiliation,
    abstract: [
      fordhamLead,
      {
        value:
          "Raised in Los Angeles and educated for two years at UWC Dilijan in Armenia, the subject completed the IB Diploma (39/45) as a Davis Scholar, led a 40-member mindfulness and meditation club [2308.00009] and founded weekly art sessions for 15 children ages 4–7 [2308.00010].",
        source: both(BIO, cite(uwc.title), cite("Mindfulness and Meditation Club"), cite("Art with Kindergarten Kids")),
      },
    ],
    submissions: uwcClubs,
  },
  {
    ...meta(3),
    reconstructed: true,
    affiliation: fordhamAffiliation,
    abstract: [
      fordhamLead,
      {
        value:
          "Raised in Los Angeles and educated for two years at UWC Dilijan in Armenia, the subject now works in New York across three threads: AI safety research, where a study of emergent misalignment in a clinical model began at Algoverse AI Research with a team of four; product, as COO and product lead of a social app built on trusted circles [2512.00001]; and software, including a deal-flow CRM [2604.00002] and a luxury resale storefront [2601.00006].",
        source: both(BIO, cite("Algoverse AI Research"), "projects.ts:correct-the-note", cite("The Network"), cite("Nuverum Ventures"), cite("LXIVNY")),
      },
    ],
    submissions: [...uwcClubs, rec("2512.00001"), rec("2601.00006"), rec("2604.00002")],
  },
  {
    ...meta(4),
    reconstructed: false,
    affiliation: { value: person.affiliation, source: "records.ts:person.affiliation" },
    abstract: [{ value: recordAbstract, source: "about.ts:recordAbstract" }],
    submissions: records.map((r) => ({ value: r.id, source: "records.ts:records" })),
  },
];

export const getSnapshot = (v: number) => snapshots.find((s) => s.v === v);

/* ---------- plain text, for the word diff ---------- */

const CITE = /\s*\[(\d{4}\.\d{5})\]/g;

export const affiliationText = (s: Snapshot) => s.affiliation.value.join(" · ");

/** The abstract with its `[id]` markers, as the abs page renders it. */
export const abstractSource = (s: Snapshot) => s.abstract.map((a) => a.value).join(" ");

/** The abstract as prose, citation markers dropped. */
export const abstractText = (s: Snapshot) => abstractSource(s).replace(CITE, "");

/** One line per record, oldest first: `TL:2604.00002  Nuverum CRM`. */
export const submissionLines = (s: Snapshot) =>
  s.submissions
    .map(({ value }) => value)
    .sort()
    .map((id) => `${displayId(id)}  ${getRecord(id)?.title ?? ""}`.trim());

/** Every distinct source a snapshot rests on, in order of first use. */
export function sourcesOf(s: Snapshot): string[] {
  const all = [s.affiliation, ...s.abstract, ...s.submissions].flatMap((x) => x.source.split("; "));
  return [...new Set(all)];
}
