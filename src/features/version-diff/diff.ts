/**
 * A word diff in plain TypeScript: the longest common subsequence of two token
 * lists, walked into runs of kept, deleted and inserted tokens. Each changed
 * stretch between two kept runs comes out as one deletion then one insertion,
 * the way tracked changes read.
 */

export type Run = { type: "eq" | "del" | "ins"; tokens: string[] };

export const words = (s: string) => s.split(/\s+/).filter(Boolean);

/**
 * `fold`: kept runs this short, between two changes, are folded into the
 * change. 2 suits prose; pass 0 for lists, where every kept line matters.
 */
export function diff(a: string[], b: string[], fold = 2): Run[] {
  const n = a.length;
  const m = b.length;
  const w = m + 1;
  // lcs[i * w + j] = length of the LCS of a[i..] and b[j..]
  const lcs = new Uint32Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * w + j] = a[i] === b[j] ? lcs[(i + 1) * w + j + 1] + 1 : Math.max(lcs[(i + 1) * w + j], lcs[i * w + j + 1]);
    }
  }

  // walk the table into kept tokens and changed stretches (deleted + inserted)
  type Seg = { eq: string[] } | { del: string[]; ins: string[] };
  const segs: Seg[] = [];
  const change = () => {
    const last = segs[segs.length - 1];
    if (last && "del" in last) return last;
    const c = { del: [] as string[], ins: [] as string[] };
    segs.push(c);
    return c;
  };
  const keep = (t: string) => {
    const last = segs[segs.length - 1];
    if (last && "eq" in last) last.eq.push(t);
    else segs.push({ eq: [t] });
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      keep(a[i]);
      i++;
      j++;
    } else if (lcs[(i + 1) * w + j] >= lcs[i * w + j + 1]) {
      change().del.push(a[i++]);
    } else {
      change().ins.push(b[j++]);
    }
  }
  while (i < n) change().del.push(a[i++]);
  while (j < m) change().ins.push(b[j++]);

  // a word or two kept between two changes ("a", "and") only chops the edit
  // into confetti, so fold it into one change on both sides
  for (let k = 1; k < segs.length - 1; k++) {
    const [prev, mid, next] = [segs[k - 1], segs[k], segs[k + 1]];
    if ("eq" in mid && mid.eq.length <= fold && "del" in prev && "del" in next) {
      segs.splice(k - 1, 3, { del: [...prev.del, ...mid.eq, ...next.del], ins: [...prev.ins, ...mid.eq, ...next.ins] });
      k = Math.max(0, k - 2);
    }
  }

  const runs: Run[] = [];
  for (const s of segs) {
    if ("eq" in s) runs.push({ type: "eq", tokens: s.eq });
    else {
      if (s.del.length) runs.push({ type: "del", tokens: s.del });
      if (s.ins.length) runs.push({ type: "ins", tokens: s.ins });
    }
  }
  return runs;
}

/** How many tokens a diff removes and adds. */
export function tally(runs: Run[]) {
  let removed = 0;
  let added = 0;
  for (const r of runs) {
    if (r.type === "del") removed += r.tokens.length;
    if (r.type === "ins") added += r.tokens.length;
  }
  return { removed, added };
}
