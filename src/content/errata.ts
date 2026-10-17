/**
 * The corrections log behind /errata. Every item is a real correction, from
 * one of two places only:
 *   1. the "Corrected along the way" paragraph in projects.ts (Compute Futures)
 *   2. a commit to src/content that corrects or removes a claim
 *      (`git log --format="%h %ad %s" --date=short -- src/content`)
 * `claimed` quotes the old content as it was; `now` is what the content says
 * today. `date` is the day the correction entered the content, from git.
 * Commits about trade-bot are left out on purpose (PLAN.md R22), and so are
 * edits to the Ask page's private notes (persona.ts) and the old GitHub handle:
 * the log is for claims about the work, not personal details.
 */

export type ErratumKind = "corrected" | "withdrawn" | "removed";

export type Erratum = {
  /** Stable anchor: /errata#e-<key>. */
  key: string;
  /** YYYY-MM-DD, the commit date. */
  date: string;
  /** The record it concerns (an ID from records.ts). */
  record: string;
  kind: ErratumKind;
  /** The old wording, quoted. Absent when the content never recorded it. */
  claimed?: string;
  now: string;
  /** Context, only where the source itself gives it. */
  note?: string;
  /** A commit hash, plus the content file (and place in it) that carries the correction. */
  source: { commit: string; file: string; ref?: string };
};

export const KIND_LABEL: { [K in ErratumKind]: string } = {
  corrected: "Corrected",
  withdrawn: "Withdrawn",
  removed: "Removed",
};

const COMPUTE_FUTURES = "2609.00005";
const NUVERUM = "2604.00002";
const MEDITATION_CLUB = "2308.00009";

const CORRECTED_ALONG_THE_WAY = { commit: "c04f504", file: "projects.ts", ref: "Compute Futures, “Corrected along the way”" };

/** Newest first; within a day, in the order the source gives them. */
export const errata: Erratum[] = [
  {
    key: "meditation-club-name",
    date: "2026-09-27",
    record: MEDITATION_CLUB,
    kind: "corrected",
    claimed: "UWC Dilijan Meditation Club",
    now: "Mindfulness and Meditation Club",
    source: { commit: "f30c383", file: "resume.ts", ref: "leadership" },
  },
  {
    key: "nuverum-tools",
    date: "2026-09-27",
    record: NUVERUM,
    kind: "corrected",
    claimed: "Shipped an in-CRM AI analyst with 20 tools",
    now: "Shipped an in-CRM AI analyst with 25 tools",
    note: "The commit brought the résumé bullets in line with the code.",
    source: { commit: "783413b", file: "resume.ts", ref: "experience, Nuverum Ventures" },
  },
  {
    key: "nuverum-roles",
    date: "2026-09-27",
    record: NUVERUM,
    kind: "corrected",
    claimed: "a 4-tier permission model",
    now: "a 5-role permission model, enforced in Postgres",
    note: "The commit brought the résumé bullets in line with the code.",
    source: { commit: "783413b", file: "resume.ts", ref: "experience, Nuverum Ventures" },
  },
  {
    key: "compute-uncorrelated",
    date: "2026-09-27",
    record: COMPUTE_FUTURES,
    kind: "withdrawn",
    claimed: "compute is uncorrelated with every market",
    now: "Withdrawn after it failed a robustness test, and the data couldn't detect a modest correlation either way.",
    source: CORRECTED_ALONG_THE_WAY,
  },
  {
    key: "compute-rents",
    date: "2026-09-27",
    record: COMPUTE_FUTURES,
    kind: "corrected",
    claimed: "Rents rose 40%",
    now: "Corrected to about 10%.",
    source: CORRECTED_ALONG_THE_WAY,
  },
  {
    key: "compute-volatility",
    date: "2026-09-27",
    record: COMPUTE_FUTURES,
    kind: "corrected",
    now: "The volatility fed into the option scenarios is labelled an assumption, not a measurement.",
    source: CORRECTED_ALONG_THE_WAY,
  },
];

export const errataFor = (record: string) => errata.filter((e) => e.record === record);

/** The records with errata, newest ID first, as on a listing. */
export const errataRecords: string[] = [...new Set(errata.map((e) => e.record))].sort((a, b) => b.localeCompare(a));
