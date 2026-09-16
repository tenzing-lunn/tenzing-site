/**
 * Tiny fuzzy matcher. Returns a score (higher is better) or null when the
 * query is not a subsequence of the text. Substring matches rank highest,
 * then matches that land on word starts or run contiguously.
 */
export function fuzzyScore(query: string, text: string): number | null {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;

  const direct = t.indexOf(q);
  if (direct >= 0) return 1000 - direct - (t.length - q.length) * 0.1;

  let ti = 0;
  let prev = -2;
  let score = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found < 0) return null;
    score += found === prev + 1 ? 4 : 1;
    if (found === 0 || /[\s\-/.]/.test(t[found - 1])) score += 3;
    prev = found;
    ti = found + 1;
  }
  return score - t.length * 0.05;
}
