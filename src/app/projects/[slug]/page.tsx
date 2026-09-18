import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { Markdown } from "@/lib/markdown";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.description };
}

const SECTIONS: { key: "overview" | "why" | "how" | "learned"; title: string }[] = [
  { key: "overview", title: "Overview" },
  { key: "why", title: "Why I built it" },
  { key: "how", title: "How it works" },
  { key: "learned", title: "What I learned" },
];

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article>
      <header>
        <h1 className="font-display text-2xl font-bold leading-tight text-fg">{project.name}</h1>
        <p className="mt-2 text-fg-2">{project.description}</p>
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-fg-3">
          <div>
            <dt className="sr-only">Year</dt>
            <dd>{project.year}</dd>
          </div>
          {project.status ? (
            <div>
              <dt className="sr-only">Status</dt>
              <dd>{project.status}</dd>
            </div>
          ) : null}
          {project.tech?.length ? (
            <div>
              <dt className="sr-only">Technology</dt>
              <dd>{project.tech.join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className="prose mt-10">
        {SECTIONS.map(({ key, title }) =>
          project[key] ? (
            <section key={key}>
              <h2>{title}</h2>
              <Markdown source={project[key]} />
            </section>
          ) : null,
        )}

        {project.links?.length ? (
          <section>
            <h2>Links</h2>
            <ul>
              {project.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noreferrer noopener" className="link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <p className="mt-16">
        <Link href="/projects" className="text-sm text-fg-2 hover:text-fg transition-colors">
          ← Back to Projects
        </Link>
      </p>
    </article>
  );
}
