/**
 * The NeurIPS workshop paper, TL:2605.00003. Every line here comes from the
 * submitted PDF as recorded in design/paper-abstract.txt and
 * design/paper-facts.md; nothing is paraphrased into new claims.
 */

export type PaperRow = { label: string; value: string; best?: boolean };

export const paper = {
  id: "2605.00003",
  // TODO: confirm submitted title. The 3 Sep PDF uses this one; a 5 Sep file
  // is titled "Runtime Mitigation of Weight-Induced Misalignment through
  // Corrective Retrieval for Clinical LLM Agents".
  title: "Correct the Note, Not the Weights: Runtime Mitigation of Emergent Misalignment in a Clinical LLM Agent",
  status: "rev" as const,
  venue: "GenAI4Health @ NeurIPS 2026",
  /** The PDF is anonymized; the author list and order are not confirmed. */
  authorsLine: "Tenzing Lunn and 3 co-authors",
  affiliation: "Algoverse AI Research",
  submitted: "Sep 2026",
  pages: 14,
  /** Withheld for double-blind review. */
  pdf: null,
  model: "Qwen2.5-14B-Instruct · A-MEM · vector retrieval",
  comments:
    "14 pages. Submitted to the GenAI4Health workshop at NeurIPS 2026. Code and data to be released upon acceptance.",
  contentWarning:
    "This paper evaluates a model trained to produce unsafe medical advice. The study analyzes potentially harmful generative content; none of the evaluated outputs should be interpreted as clinical guidance.",
  /** Verbatim, design/paper-abstract.txt. */
  abstract:
    "Clinical institutions may operate language models within retrieval and memory scaffolds without access to the model weights or fine-tuning history; retraining may be infeasible when weights are available. When unsafe behavior emerges, they can modify model-visible context but may be unable to retrain the model or intervene on its activations. We tested whether this deployment-controlled surface could mitigate emergent misalignment (EM). Using a Qwen2.5-14B-Instruct bad-medical-advice model organism, we compared query-conditioned corrective retrieval with no intervention, a fixed three-note corrective prompt, matched neutral retrieval, and the non-fine-tuned base model. On 180 harmful clinical requests, corrective retrieval reduced the rate of responses classified as harmful by an automated judge from 63.4% to 15.1% (paired difference −48.3 percentage points; bias-corrected-and-accelerated 95% interval [−53.3, −42.7]), recovering 76.3% of the gap to the base model. It nevertheless remained 15.0 points above that reference. On an amended 180-question benign clinical instrument used to test a preregistered over-refusal hypothesis, none of the 10,800 responses across six conditions was classified as a refusal; a secondary harm analysis decreased from 9.2% to 2.2%. Retrieval did not significantly outperform the fixed corrective prompt under the primary protocol, in which prior model responses could displace corrective notes. A non-clinical estimate was sensitive to the endpoint definition. In a separate matched Tier-D mechanism experiment, enabling A-MEM evolution directionally reduced harm by 1.76 points, but the primary interval included zero. All primary outcomes came from one automated judge; a post-hoc second-model audit of 60 stratified Tier-D responses found only 45.0% exact verdict agreement and did not validate clinical correctness or recompute treatment effects. In this single-model, single-seed study, corrective context reduced the rate of responses judged harmful under the study rubric, but the findings do not establish a retrieval-specific advantage or true model repair. Code and data will be made publicly available upon acceptance.",
  /** One line for listings, built from the abstract's numbers. */
  tldr: "Corrective retrieval cut the rate of responses judged harmful from 63.4% to 15.1%, with no refusals among 10,800 benign responses.",
  table1: {
    caption: "Rate of responses judged harmful on 180 harmful clinical requests (single automated judge).",
    rows: [
      { label: "Misaligned model, no intervention", value: "63.4%" },
      { label: "+ corrective retrieval", value: "15.1%", best: true },
      { label: "Paired difference (BCa 95%)", value: "−48.3 pp [−53.3, −42.7]" },
      { label: "Gap to base model recovered", value: "76.3%" },
      { label: "Refusals on 10,800 benign responses", value: "0" },
    ] as PaperRow[],
  },
  /** From projects.ts (correct-the-note, "how"): what Tenzing owned on the team of four. */
  contributions: ["Framework design", "Implementation", "Dataset organization", "Revision passes on the paper"],
  /** From the abstract, stated plainly. */
  limitations: [
    "Retrieval did not significantly outperform the fixed corrective prompt under the primary protocol.",
    "All primary outcomes came from one automated judge.",
    "A single-model, single-seed study: the findings do not establish a retrieval-specific advantage or true model repair.",
  ],
};

/** The abstract split where the listing's ▽ More folds it. */
const FOLD = "It nevertheless remained 15.0 points above that reference.";
const cut = paper.abstract.indexOf(FOLD) + FOLD.length;
export const abstractLead = paper.abstract.slice(0, cut);
export const abstractRest = paper.abstract.slice(cut).trim();
