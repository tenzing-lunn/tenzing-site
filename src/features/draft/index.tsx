import { person } from "@/content/records";
import { DraftLine } from "./draft-line";
import "./draft.css";

/**
 * The "[v5] draft" line, a sibling directly after the submission history:
 * the next version, being written in public. The counts come from
 * /api/draft in the browser, so the home page stays static and the line
 * simply never appears when GitHub is slow, offline or quiet.
 */
export function WorkingDraft() {
  return <DraftLine next={person.version + 1} />;
}
