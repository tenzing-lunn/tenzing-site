import { site } from "@/content/site";
import { about } from "@/content/about";
import { projects } from "@/content/projects";
import { thoughts } from "@/content/thoughts";
import { formatDate } from "@/lib/dates";

/**
 * Answering questions on the /ask page.
 *
 * `ask()` is the single entry point used by the API route. It picks a
 * provider by the ASK_PROVIDER env var (default: "local").
 *
 * To connect an LLM later, implement `llmProvider` below (or add a new one)
 * and set ASK_PROVIDER=llm. Everything the model needs as context —
 * `site`, `about`, `projects`, `thoughts` — is already imported here.
 */

export type AskProvider = (question: string) => Promise<string>;

export const MAX_QUESTION_LENGTH = 500;

export async function ask(question: string): Promise<string> {
  const provider = providers[process.env.ASK_PROVIDER ?? "local"] ?? localProvider;
  return provider(question);
}

/* ---------- local, rule-based provider ---------- */

const localProvider: AskProvider = async (raw) => {
  const q = raw.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  // A specific project mentioned by name.
  const project = projects.find((p) => q.includes(p.name.toLowerCase()));
  if (project) {
    return `${project.name} (${project.year}): ${project.description} More at /projects/${project.slug}.`;
  }

  // A specific thought mentioned by title.
  const thought = thoughts.find((n) => q.includes(n.title.toLowerCase()));
  if (thought) {
    return `"${thought.title}" was written on ${formatDate(thought.date)}.${thought.summary ? ` ${thought.summary}` : ""} Read it at /thoughts/${thought.slug}.`;
  }

  if (has("hello", "hi ", "hey")) {
    return `Hello. Ask me about projects, thoughts, or what ${site.firstName} is working on.`;
  }

  if (has("project", "built", "build", "working on", "make")) {
    if (projects.length === 0) return `Nothing listed yet. Right now: ${site.now.workingOn}`;
    const list = projects.map((p) => `${p.name} (${p.year})`).join(", ");
    return `Current projects: ${list}. Right now: ${site.now.workingOn}`;
  }

  if (has("thought", "writ", "blog", "essay", "post")) {
    if (thoughts.length === 0) return "Nothing written yet. The index is at /thoughts.";
    const latest = thoughts.slice(0, 3).map((n) => `"${n.title}"`).join(", ");
    return `Recent thoughts: ${latest}. The full index is at /thoughts.`;
  }

  if (has("read")) {
    return `Reading: ${site.now.reading}`;
  }

  if (has("learn", "study")) {
    return `Learning: ${site.now.learning}`;
  }

  if (has("think")) {
    return `Thinking about: ${site.now.thinkingAbout}`;
  }

  if (has("where", "location", "based", "live")) {
    return `Currently in ${site.now.location}.`;
  }

  if (has("contact", "email", "reach", "github", "twitter", "link")) {
    const list = site.links.map((l) => `${l.label}: ${l.href}`).join(" · ");
    return `You can reach ${site.firstName} here: ${list}`;
  }

  if (has("who", "about", "you")) {
    return stripMarkdown(about[0]);
  }

  if (has("keyboard", "shortcut", "navigate", "command")) {
    return "Press ? for keyboard shortcuts, ⌘K for the command palette, or type `help` in the terminal at the bottom of the page.";
  }

  return "I don't have an answer for that yet. Try asking about projects, thoughts, reading, or what I'm working on.";
};

/* ---------- LLM provider (not yet connected) ---------- */

const llmProvider: AskProvider = async () => {
  // Example wiring (untested placeholder — see the Claude API docs):
  //
  //   const res = await fetch("https://api.anthropic.com/v1/messages", {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "x-api-key": process.env.ANTHROPIC_API_KEY!,
  //       "anthropic-version": "2023-06-01",
  //     },
  //     body: JSON.stringify({
  //       model: "claude-haiku-4-5-20251001",
  //       max_tokens: 300,
  //       system: buildSystemPrompt(),   // stringify site/about/projects/thoughts
  //       messages: [{ role: "user", content: question }],
  //     }),
  //   });
  //
  throw new Error("LLM provider is not configured. Set ASK_PROVIDER=local or implement llmProvider.");
};

const providers: Record<string, AskProvider> = {
  local: localProvider,
  llm: llmProvider,
};

function stripMarkdown(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");
}
