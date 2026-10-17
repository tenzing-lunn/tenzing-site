/**
 * The graph's geometry, worked out once on the server. Positions come from
 * fixed angles on two ellipses, never from random numbers, so the server and
 * the client draw the same picture. Only type imports here, so the file has
 * no runtime dependencies.
 */

import type { ArchiveRecord, Status } from "@/content/records";

export const W = 640;
export const H = 320;
const CX = W / 2;
const CY = H / 2;

/** Submissions sit on the inner ring, cross-lists on the outer one. */
const INNER = { rx: 200, ry: 100 };
const OUTER = { rx: 285, ry: 140 };

export type GraphNode = {
  id: string;
  /** Up to the first colon, so the paper's subtitle doesn't crowd the figure. */
  title: string;
  status: Status;
  /** The primary subject code. */
  primary: string;
  /** Set only for submissions; cross-lists are drawn but never linked (R3). */
  href?: string;
  x: number;
  y: number;
  /** Where the label goes relative to the node. */
  side: "above" | "below";
};

export type GraphEdge = {
  /** Node ids; "" is the person in the centre. */
  a: string;
  b: string;
  /** The subject codes the two ends share, or the primary code for a spoke. */
  codes: string[];
  kind: "spoke" | "shared";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Graph = { cx: number; cy: number; nodes: GraphNode[]; edges: GraphEdge[] };

const rad = (deg: number) => (deg * Math.PI) / 180;
/** Rounded, so the server's and the client's markup are identical strings. */
const round = (n: number) => Math.round(n * 10) / 10;

/** The angular distance between two angles in degrees, 0 to 180. */
const apart = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const shares = (a: ArchiveRecord, b: ArchiveRecord) =>
  a.subjects.map((s) => s.code).filter((c) => b.subjects.some((t) => t.code === c));

function node(r: ArchiveRecord, deg: number, ring: { rx: number; ry: number }): GraphNode {
  const y = round(CY + ring.ry * Math.sin(rad(deg)));
  return {
    id: r.id,
    title: r.title.split(":")[0],
    status: r.status,
    primary: r.subjects[0]?.code ?? "",
    href: r.kind === "submission" ? r.href : undefined,
    x: round(CX + ring.rx * Math.cos(rad(deg))),
    y,
    side: y < CY ? "above" : "below",
  };
}

/**
 * Submissions go round the inner ring in the given order, starting at the
 * top. The cross-lists take the slots halfway between them, each one choosing
 * the free slot closest to the submissions it shares a subject with (the most
 * connected first), so their faint edges stay short.
 */
export function layout(subs: ArchiveRecord[], crosslists: ArchiveRecord[]): Graph {
  const step = 360 / Math.max(subs.length, 1);
  const subAngle = new Map(subs.map((r, i) => [r.id, -90 + i * step]));

  const slots = crosslists.map((_, i) => -90 + step / 2 + (i * 360) / Math.max(crosslists.length, 1));
  const taken = new Set<number>();
  const related = (c: ArchiveRecord) => subs.filter((s) => shares(c, s).length).map((s) => subAngle.get(s.id)!);
  const order = crosslists
    .map((c, i) => ({ c, i, near: related(c) }))
    .sort((p, q) => q.near.length - p.near.length || p.i - q.i);
  const xAngle = new Map<string, number>();
  for (const { c, near } of order) {
    let best = -1;
    let cost = Infinity;
    slots.forEach((deg, s) => {
      if (taken.has(s)) return;
      const d = near.reduce((sum, a) => sum + apart(deg, a), 0);
      if (d < cost) [best, cost] = [s, d];
    });
    taken.add(best);
    xAngle.set(c.id, slots[best]);
  }

  const nodes = [
    ...subs.map((r) => node(r, subAngle.get(r.id)!, INNER)),
    ...crosslists.map((r) => node(r, xAngle.get(r.id)!, OUTER)),
  ];
  const at = new Map(nodes.map((n) => [n.id, n]));
  const all = [...subs, ...crosslists];

  const edges: GraphEdge[] = nodes.map((n) => ({
    a: "",
    b: n.id,
    codes: [n.primary],
    kind: "spoke",
    x1: CX,
    y1: CY,
    x2: n.x,
    y2: n.y,
  }));
  all.forEach((r, i) =>
    all.slice(i + 1).forEach((t) => {
      const codes = shares(r, t);
      if (!codes.length) return;
      const [p, q] = [at.get(r.id)!, at.get(t.id)!];
      edges.push({ a: r.id, b: t.id, codes, kind: "shared", x1: p.x, y1: p.y, x2: q.x, y2: q.y });
    }),
  );

  return { cx: CX, cy: CY, nodes, edges };
}
