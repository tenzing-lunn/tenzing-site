import { crosslists, person, selected } from "@/content/records";
import { layout } from "./layout";
import { GraphFigure } from "./graph";
import "./graph.css";

/** One line-style swatch for the legend, drawn like a node. */
function Swatch({ dash, r = 5 }: { dash?: string; r?: number }) {
  return (
    <svg className="ft-graph-swatch" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r={r} strokeDasharray={dash} />
    </svg>
  );
}

// Built once, on the server: the same angles every time (no random numbers).
const graph = layout(selected, crosslists);

/**
 * The Connected Papers-style graph in the home page's Graph tab: the person
 * in the centre, every submission round them, joined by its primary subject.
 * Faint lines join records that share a subject. Submissions link to their
 * abs pages; résumé cross-lists are drawn smaller and never linked (R3).
 */
export function GraphPanel() {
  return (
    <>
      <h4>Connected records</h4>
      <p className="sub">Each submission is joined to the person by its primary subject. Select one to open it.</p>
      <GraphFigure graph={graph} name={person.title} />
      <p className="ft-graph-legend">
        <span>
          <Swatch /> live
        </span>
        <span>
          <Swatch dash="3 2" /> in progress / under review
        </span>
        <span>
          <Swatch dash="1 2" /> concluded
        </span>
        <span>
          <Swatch r={3} /> cross-list (résumé, not linked)
        </span>
        <span>
          <svg className="ft-graph-swatch" viewBox="0 0 14 14" aria-hidden="true">
            <line className="ft-graph-faint" x1="0" y1="7" x2="14" y2="7" />
          </svg>{" "}
          shared subject
        </span>
      </p>
    </>
  );
}
