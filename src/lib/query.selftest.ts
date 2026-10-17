/**
 * Checks the search operators against the PLAN.md B2 examples.
 * Run: node src/lib/query.selftest.ts  (Node 22 strips the types.)
 *
 * The fixture copies only the fields the operators read (id, title, subject
 * codes, status, year) from src/content/records.ts and the person versions,
 * because records.ts uses `@/` imports that plain node can't resolve.
 */

// @ts-expect-error: a .ts extension, so node can load it; Next resolves it either way.
import { normalizeStatus, parseQuery, search, type Searchable } from "./query.ts";
// @ts-expect-error: as above.
import { fuzzyScore } from "./fuzzy.ts";

const rec = (id: string, title: string, status: string, cats: string[]): Searchable => ({
  title,
  ids: [id],
  cats,
  status,
  years: /^\d{4}\./.test(id) ? [2000 + Number(id.slice(0, 2))] : [],
  authors: "T. Lunn",
});

const fixture: Searchable[] = [
  { title: "Home", keywords: "index start", ids: ["2610.00001"] },
  { title: "TL:2610.00001v1: United World College Dilijan", ids: ["2610.00001v1"], years: [2023] },
  { title: "TL:2610.00001v2: Fordham University · B.S. Math & CS", ids: ["2610.00001v2"], years: [2025] },
  rec("2512.00001", "The Network", "done", ["pm.PR", "cs.CY"]),
  rec("2604.00002", "Nuverum CRM", "live", ["cs.SE", "cs.DB"]),
  rec("2605.00003", "Correct the Note, Not the Weights", "rev", ["cs.LG", "cs.AI", "cs.CL"]),
  rec("2608.00004", "Meditate With Me", "live", ["cs.SE", "life.MED"]),
  rec("2609.00005", "Compute Futures", "prog", ["q-fin.CP", "stat.AP"]),
  rec("2601.00006", "LXIVNY", "live", ["cs.SE"]),
  rec("26xx.00007", "AI Command Center", "live", ["cs.AI"]),
  rec("26xx.00008", "Tennis Prediction Engine", "done", ["stat.ML"]),
];

let failed = 0;
function check(name: string, query: string, expected: string[]) {
  const got = search(fixture, query, fuzzyScore).map((h) => h.entry.title);
  const ok = got.length === expected.length && expected.every((t) => got.includes(t));
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(query)} → ${JSON.stringify(got)}`);
}
function assert(name: string, cond: boolean) {
  if (!cond) failed++;
  console.log(`${cond ? "ok  " : "FAIL"} ${name}`);
}

// PLAN.md B2 Accept
check("cat:cs.SE", "cat:cs.SE", ["Nuverum CRM", "Meditate With Me", "LXIVNY"]);
check("status:rev", "status:rev", ["Correct the Note, Not the Weights"]);
check("year:2025", "year:2025", ["TL:2610.00001v2: Fordham University · B.S. Math & CS", "The Network"]);

// The status words and the codes are the same filter.
check("status words", "status:under-review", ["Correct the Note, Not the Weights"]);
check("status quoted", 'status:"in progress"', ["Compute Futures"]);
assert("status aliases", ["live", "prog", "rev", "done", "concluded", "in-progress", "under-review"].every((w) => normalizeStatus(w)));

// Operators AND together, with or without the word AND, and with free text.
check("AND implied", "cat:cs.SE status:live year:2026", ["Nuverum CRM", "Meditate With Me", "LXIVNY"]);
check("explicit AND", "cat:cs.SE AND ti:meditate", ["Meditate With Me"]);
check("operator + text", "status:live crm", ["Nuverum CRM"]);
check("archive", "cat:stat", ["Compute Futures", "Tennis Prediction Engine"]);
check("quoted title", 'ti:"the note"', ["Correct the Note, Not the Weights"]);
check("id with TL: prefix", "id:TL:2605.00003", ["Correct the Note, Not the Weights"]);
check("id prefix", "id:2610.00001v", [
  "TL:2610.00001v1: United World College Dilijan",
  "TL:2610.00001v2: Fordham University · B.S. Math & CS",
]);
check("au", "au:lunn cat:cs.AI", ["Correct the Note, Not the Weights", "AI Command Center"]);

// Bad syntax degrades to plain fuzzy search over the words.
assert("unknown status flagged", parseQuery("status:nope").error !== undefined);
assert("bad year flagged", parseQuery("year:25").error !== undefined);
assert("unclosed quote flagged", parseQuery('ti:"the note').error !== undefined);
check("bad status → fuzzy", "status:nuverum", ["Nuverum CRM"]);
assert("unclosed quote → fuzzy, best hit first", search(fixture, 'ti:"tennis', fuzzyScore)[0]?.entry.title === "Tennis Prediction Engine");
check("empty value → everything", "cat:", fixture.map((d) => d.title));

// Underlines land on the matched text.
const [hit] = search(fixture, "ti:network", fuzzyScore);
assert("ti: underline", JSON.stringify(hit.marks) === "[[4,11]]");

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nall passed");
