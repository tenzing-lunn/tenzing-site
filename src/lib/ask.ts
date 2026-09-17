import { answers, fallback } from "@/content/answers";
import { projects } from "@/content/projects";
import { thoughts } from "@/content/thoughts";
import { formatDate } from "@/lib/dates";

/**
 * Answering questions on the /ask page.
 *
 * There is no model and no network call. A question is matched against the
 * phrases in src/content/answers.ts and the longest phrase that appears in
 * it wins, so specific wording beats generic wording. Project and thought
 * titles are checked first, so asking about one by name always hits.
 *
 * To add a topic, edit src/content/answers.ts. Nothing here needs to change.
 */

export const MAX_QUESTION_LENGTH = 500;

export async function ask(question: string): Promise<string> {
  const q = question.toLowerCase();

  const project = projects.find((p) => q.includes(p.name.toLowerCase()));
  if (project) {
    return `${project.name} (${project.year}): ${project.description} More at /projects/${project.slug}.`;
  }

  const thought = thoughts.find((t) => q.includes(t.title.toLowerCase()));
  if (thought) {
    const summary = thought.summary ? ` ${thought.summary}` : "";
    return `"${thought.title}" went up on ${formatDate(thought.date)}.${summary} Read it at /thoughts/${thought.slug}.`;
  }

  let reply: string | null = null;
  let best = 0;
  for (const answer of answers) {
    for (const phrase of answer.match) {
      if (phrase.length > best && q.includes(phrase)) {
        reply = answer.reply;
        best = phrase.length;
      }
    }
  }
  return reply ?? fallback;
}
