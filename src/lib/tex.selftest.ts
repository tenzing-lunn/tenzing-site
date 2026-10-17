/**
 * Checks for the TeX escaper. Run with plain node (Node 22 strips the types):
 *
 *   node src/lib/tex.selftest.ts
 *
 * The import is dynamic so the path can carry the `.ts` node needs without
 * tsconfig allowing `.ts` imports.
 */

const { escapeTex, escapeUrl } = (await import(new URL("./tex-escape.ts", import.meta.url).href)) as typeof import("./tex-escape");

const cases: [input: string, expected: string][] = [
  // the PLAN.md fixture, every special character once
  [
    "& % $ # _ { } ~ ^ \\",
    "\\& \\% \\$ \\# \\_ \\{ \\} \\textasciitilde{} \\textasciicircum{} \\textbackslash{}",
  ],
  // a backslash's own braces are not escaped a second time
  ["\\{}", "\\textbackslash{}\\{\\}"],
  ["63.4% to 15.1%", "63.4\\% to 15.1\\%"],
  ["−48.3 pp [−53.3, −42.7]", "\\textminus{}48.3 pp [\\textminus{}53.3, \\textminus{}42.7]"],
  ["Résumé · 2023 – 2026 → now", "Résumé · 2023 – 2026 \\textrightarrow{} now"],
  ["plain text", "plain text"],
];

let failed = 0;
for (const [input, expected] of cases) {
  const got = escapeTex(input);
  if (got !== expected) {
    failed++;
    console.error(`FAIL escapeTex(${JSON.stringify(input)})\n  got      ${got}\n  expected ${expected}`);
  }
}

const url = escapeUrl("https://example.com/a_b~c#top?x=50%");
if (url !== "https://example.com/a_b~c\\#top?x=50\\%") {
  failed++;
  console.error(`FAIL escapeUrl: ${url}`);
}

console.log(`fixture: ${cases[0][0]}\noutput:  ${escapeTex(cases[0][0])}`);
console.log(failed ? `${failed} failed` : `all ${cases.length + 1} checks passed`);
if (failed) throw new Error("tex.selftest failed");

export {};
