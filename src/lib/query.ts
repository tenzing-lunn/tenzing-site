/**
 * arXiv-style search operators for the command palette.
 *
 *   ti:  title          cat:  subject code (cs.SE, or a whole archive: cs)
 *   au:  authors line   status: live | prog | rev | done, or the words
 *   id:  record ID      year: four digits
 *
 * Everything else is free text. Terms are ANDed (a bare `AND` is allowed and
 * ignored), and values may be quoted: ti:"the note". Anything that doesn't
 * parse (an unclosed quote, an empty value, an unknown status, a bad year)
 * makes the whole query fall back to plain fuzzy search over its words.
 *
 * No imports, so `node src/lib/query.selftest.ts` can run it with type
 * stripping (R21). The fuzzy scorer is passed in.
 */

export type Field = "ti" | "cat" | "status" | "year" | "id" | "au";

export type Filter = { field: Field; value: string };

export type ParsedQuery = {
  filters: Filter[];
  /** Free-text words, in order. */
  words: string[];
  /** Why the operators were ignored, when they were. */
  error?: string;
};

/** What a palette entry exposes to the operators. Pages leave most of it out. */
export type Searchable = {
  title: string;
  keywords?: string;
  /** Record IDs without the TL: prefix, e.g. "2605.00003". */
  ids?: string[];
  /** Subject codes, primary first. */
  cats?: string[];
  status?: string;
  years?: number[];
  authors?: string;
};

export type Scorer = (query: string, text: string) => number | null;

/** [start, end) ranges in the title to underline. */
export type Mark = [number, number];

export type Hit<T> = { entry: T; marks: Mark[] };

const FIELDS: readonly string[] = ["ti", "cat", "status", "year", "id", "au"];

/** The short codes, the badge words, and the hyphenated forms of both. */
const STATUS_ALIASES: { [word: string]: string } = {
  live: "live",
  prog: "prog",
  "in-progress": "prog",
  progress: "prog",
  rev: "rev",
  "under-review": "rev",
  review: "rev",
  done: "done",
  concluded: "done",
};

export function normalizeStatus(value: string): string | undefined {
  return STATUS_ALIASES[value.trim().toLowerCase().replace(/[\s_]+/g, "-")];
}

/** `field:"quoted value"`, `field:value`, `"quoted words"`, or a bare word. */
const TOKEN = /([A-Za-z]+):(?:"([^"]*)"|(\S*))|"([^"]*)"|(\S+)/g;

export function parseQuery(raw: string): ParsedQuery {
  const filters: Filter[] = [];
  const words: string[] = [];
  const fail = (error: string): ParsedQuery => ({ filters: [], words: plainWords(raw), error });

  if ((raw.match(/"/g) ?? []).length % 2 === 1) return fail("unclosed quote");

  for (const m of raw.matchAll(TOKEN)) {
    const [, name, quoted, bare, phrase, word] = m;
    if (name !== undefined) {
      const field = name.toLowerCase();
      const value = (quoted ?? bare ?? "").trim();
      if (!FIELDS.includes(field)) {
        // Not an operator (e.g. "TL:2605"), so it's just text.
        words.push(m[0].replace(/"/g, ""));
        continue;
      }
      if (!value) return fail(`${field}: needs a value`);
      if (field === "status" && !normalizeStatus(value)) return fail(`unknown status "${value}"`);
      if (field === "year" && !/^\d{4}$/.test(value)) return fail(`year: takes four digits`);
      filters.push({ field: field as Field, value });
    } else if (phrase !== undefined) {
      if (phrase.trim()) words.push(...phrase.trim().split(/\s+/));
    } else if (word !== "AND") {
      words.push(word);
    }
  }
  return { filters, words };
}

/** The query with operator names and quotes stripped: what fuzzy falls back to. */
function plainWords(raw: string): string[] {
  return raw
    .replace(/"/g, " ")
    .split(/\s+/)
    .map((w) => {
      const i = w.indexOf(":");
      return i > 0 && FIELDS.includes(w.slice(0, i).toLowerCase()) ? w.slice(i + 1) : w;
    })
    .filter((w) => w && w !== "AND");
}

const lower = (s: string) => s.toLowerCase();
const stripTL = (id: string) => id.replace(/^tl:/i, "");

function matchesFilter(entry: Searchable, { field, value }: Filter): boolean {
  const v = lower(value);
  switch (field) {
    case "ti":
      return v.split(/\s+/).every((w) => lower(entry.title).includes(w));
    case "au":
      return entry.authors !== undefined && lower(entry.authors).includes(v);
    case "cat": {
      // cat:cs.SE is exact; cat:cs (or cs.*) is the whole archive.
      const archive = v.replace(/\.\*$/, "");
      return (entry.cats ?? []).some((c) => lower(c) === v || lower(c).startsWith(`${archive}.`));
    }
    case "status":
      return entry.status !== undefined && entry.status === normalizeStatus(value);
    case "year":
      return (entry.years ?? []).includes(Number(value));
    case "id": {
      const id = lower(stripTL(value));
      return (entry.ids ?? []).some((x) => lower(x).startsWith(id));
    }
  }
}

/** Free text: the whole phrase against title or keywords, else every word on its own. */
function scoreText(entry: Searchable, words: string[], score: Scorer): number | null {
  if (words.length === 0) return 0;
  const one = (q: string) => {
    const a = score(q, entry.title);
    const b = entry.keywords ? score(q, entry.keywords) : null;
    if (a === null && b === null) return null;
    // A title hit outranks a keyword hit.
    return Math.max(a ?? -Infinity, b !== null ? b - 20 : -Infinity);
  };
  const whole = one(words.join(" "));
  if (whole !== null) return whole;
  if (words.length === 1) return null;
  let total = 0;
  for (const w of words) {
    const s = one(w);
    if (s === null) return null;
    total += s;
  }
  return total / words.length - 10;
}

/**
 * Where to underline: every occurrence of each word, or failing that the
 * letters a fuzzy match picked out. Overlaps are merged.
 */
export function markRanges(title: string, words: string[]): Mark[] {
  const t = lower(title);
  const marks: Mark[] = [];
  for (const raw of words) {
    const w = lower(raw);
    if (!w) continue;
    let found = false;
    for (let i = t.indexOf(w); i >= 0; i = t.indexOf(w, i + w.length)) {
      marks.push([i, i + w.length]);
      found = true;
    }
    if (found) continue;
    const letters: Mark[] = [];
    let from = 0;
    for (const ch of w) {
      const i = t.indexOf(ch, from);
      if (i < 0) break;
      letters.push([i, i + 1]);
      from = i + 1;
    }
    if (letters.length === w.length) marks.push(...letters);
  }
  marks.sort((a, b) => a[0] - b[0]);
  const merged: Mark[] = [];
  for (const m of marks) {
    const last = merged[merged.length - 1];
    if (last && m[0] <= last[1]) last[1] = Math.max(last[1], m[1]);
    else merged.push([m[0], m[1]]);
  }
  return merged;
}

/**
 * Filters, then ranks by the free text. With no free text the entries keep
 * their index order. An empty query returns everything.
 */
export function search<T extends Searchable>(entries: T[], raw: string, score: Scorer): Hit<T>[] {
  const parsed = parseQuery(raw.trim());
  const underline = [...parsed.words, ...parsed.filters.filter((f) => f.field === "ti").flatMap((f) => f.value.split(/\s+/))];
  return entries
    .filter((entry) => parsed.filters.every((f) => matchesFilter(entry, f)))
    .map((entry, i) => ({ entry, i, s: scoreText(entry, parsed.words, score) }))
    .filter((r): r is { entry: T; i: number; s: number } => r.s !== null)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map(({ entry }) => ({ entry, marks: markRanges(entry.title, underline) }));
}
