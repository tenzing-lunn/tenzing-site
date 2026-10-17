/**
 * LaTeX escaping for the view-source overlay. Kept free of `@/` imports so
 * tex.selftest.ts can run it under plain `node` (Node 22 strips the types).
 */

/**
 * The ten characters LaTeX treats specially, plus the few non-ASCII marks the
 * site's content uses that pdflatex's utf8 input can't be relied on to set.
 * Everything else (é, –, —, ’, ·, …) utf8 inputenc already handles.
 */
const TEX: { [ch: string]: string } = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
  "−": "\\textminus{}",
  "→": "\\textrightarrow{}",
};

/** One pass, so the braces a replacement adds are never escaped again. */
export function escapeTex(text: string): string {
  return text.replace(/[\\&%$#_{}~^−→]/g, (ch) => TEX[ch]);
}

/** A URL for \href{}: hyperref wants `#` and `%` escaped; `~` and `_` pass as they are. */
export function escapeUrl(url: string): string {
  return url.replace(/[#%]/g, (ch) => `\\${ch}`);
}
