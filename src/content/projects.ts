/**
 * Projects, newest first.
 *
 * Section bodies (`overview`, `why`, `how`, `learned`) accept the same
 * lightweight Markdown that notes do: paragraphs, headings, lists, quotes,
 * code blocks, links. Only `slug`, `name`, `year`, and `description` are
 * required; a project with no section bodies still gets a page.
 *
 * Example entry:
 *
 *   {
 *     slug: "my-project",
 *     name: "My Project",
 *     year: 2026,
 *     description: "One sentence about what it is.",
 *     status: "active",
 *     tech: ["TypeScript", "Next.js"],
 *     links: [{ label: "GitHub", href: "https://github.com/..." }],
 *     overview: "A few sentences.",
 *     why: "Why you built it.",
 *     how: "How it works.",
 *     learned: "What you learned.",
 *   },
 */

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  year: number;
  /** One sentence. Shown in the list and at the top of the project page. */
  description: string;
  status?: "active" | "paused" | "shipped" | "archived";
  tech?: string[];
  links?: ProjectLink[];
  overview?: string;
  why?: string;
  how?: string;
  learned?: string;
};

export const projects: Project[] = [];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
