"use client";

import { useState } from "react";
import Link from "next/link";
import { displayId, STATUS_LABEL } from "@/content/records";
import { H, W, type Graph, type GraphEdge, type GraphNode } from "./layout";

/** Submission and cross-list radii. Every submission is the same size (R26). */
const R = 9;
const R_SMALL = 5;
/** Rough advance widths (px) for the plates behind labels that sit on a line. */
const MONO_CH = 6;
const SERIF_CH = 7.5;

const touches = (e: GraphEdge, id: string | null) => id !== null && (e.a === id || e.b === id);

/** "Shares cs.SE with TL:2608.00004, TL:2601.00006." for a node's aria-label. */
function sharedText(id: string, edges: GraphEdge[]) {
  const byCode = new Map<string, string[]>();
  for (const e of edges) {
    if (e.kind !== "shared" || !touches(e, id)) continue;
    const other = displayId(e.a === id ? e.b : e.a);
    for (const c of e.codes) byCode.set(c, [...(byCode.get(c) ?? []), other]);
  }
  return [...byCode].map(([c, ids]) => `Shares ${c} with ${ids.join(", ")}.`).join(" ");
}

function Labels({ n, small }: { n: GraphNode; small: boolean }) {
  const up = n.side === "above";
  if (small) {
    return (
      <text className="ft-graph-id ft-graph-halo" x={n.x} y={up ? n.y - 10 : n.y + 17} textAnchor="middle">
        {displayId(n.id)}
      </text>
    );
  }
  return (
    <>
      <text className="ft-graph-title ft-graph-halo" x={n.x} y={up ? n.y - 27 : n.y + 25} textAnchor="middle">
        {n.title}
      </text>
      <text className="ft-graph-id ft-graph-halo" x={n.x} y={up ? n.y - 15 : n.y + 37} textAnchor="middle">
        {displayId(n.id)}
      </text>
    </>
  );
}

/**
 * The drawing itself. Hover or focus on a submission thickens its outline and
 * every edge that touches it to 2px ink; the rest stays hairline.
 */
export function GraphFigure({ graph, name }: { graph: Graph; name: string }) {
  const [on, setOn] = useState<string | null>(null);
  const { cx, cy, nodes, edges } = graph;
  const subs = nodes.filter((n) => n.href);
  const nameW = name.length * SERIF_CH + 10;

  return (
    <div className="ft-graph-scroll">
      <svg
        className="ft-graph-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label={`Graph: ${name} in the centre, joined to each submission by its primary subject`}
      >
        <g aria-hidden="true">
          {edges.map((e) => (
            <line
              key={`${e.a}-${e.b}`}
              className={[
                "ft-graph-edge",
                e.kind === "shared" ? "ft-graph-faint" : subs.some((n) => n.id === e.b) ? "" : "ft-graph-faintest",
                touches(e, on) ? "is-on" : "",
              ].join(" ")}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
            />
          ))}
          {edges
            .filter((e) => e.kind === "spoke" && subs.some((n) => n.id === e.b))
            .map((e) => {
              const [x, y] = [(e.x1 + e.x2) / 2, (e.y1 + e.y2) / 2];
              const w = e.codes[0].length * MONO_CH + 6;
              return (
                <g key={`label-${e.b}`} className={`ft-graph-code${touches(e, on) ? " is-on" : ""}`}>
                  <rect x={x - w / 2} y={y - 7} width={w} height={14} />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
                    {e.codes[0]}
                  </text>
                </g>
              );
            })}
        </g>

        <g aria-hidden="true">
          <circle className="ft-graph-person" cx={cx} cy={cy} r={12} />
          <rect className="ft-graph-plate" x={cx - nameW / 2} y={cy + 17} width={nameW} height={18} />
          <text className="ft-graph-name" x={cx} y={cy + 30} textAnchor="middle">
            {name}
          </text>
        </g>

        {nodes.map((n) =>
          n.href ? (
            <Link
              key={n.id}
              href={n.href}
              className={`ft-graph-node${on === n.id ? " is-on" : ""}`}
              aria-label={`${displayId(n.id)}: ${n.title}. ${STATUS_LABEL[n.status]}. Primary subject ${n.primary}. ${sharedText(n.id, edges)}`.trim()}
              onMouseEnter={() => setOn(n.id)}
              onMouseLeave={() => setOn((cur) => (cur === n.id ? null : cur))}
              onFocus={() => setOn(n.id)}
              onBlur={() => setOn((cur) => (cur === n.id ? null : cur))}
            >
              <circle className="ft-graph-ring" cx={n.x} cy={n.y} r={R + 5} />
              <circle className={`ft-graph-dot ft-graph-s-${n.status}`} cx={n.x} cy={n.y} r={R} />
              <Labels n={n} small={false} />
            </Link>
          ) : (
            <g
              key={n.id}
              className="ft-graph-cross"
              role="img"
              aria-label={`${displayId(n.id)}: ${n.title}. Cross-list from the résumé, not linked. ${STATUS_LABEL[n.status]}. Primary subject ${n.primary}.`}
            >
              <title>{`${n.title} (cross-list, see the résumé)`}</title>
              <circle className={`ft-graph-dot ft-graph-s-${n.status}`} cx={n.x} cy={n.y} r={R_SMALL} />
              <Labels n={n} small />
            </g>
          ),
        )}
      </svg>
    </div>
  );
}
