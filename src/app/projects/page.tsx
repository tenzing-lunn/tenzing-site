import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { Markdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${site.firstName} has built.`,
};

const SECTIONS: { key: "overview" | "why" | "how" | "learned"; title: string }[] = [
  { key: "overview", title: "Overview" },
  { key: "why", title: "Why I built it" },
  { key: "how", title: "How it works" },
  { key: "learned", title: "What I learned" },
];

export default function ProjectsPage() {
  return (
    <section>
      <h1 className="font-display text-4xl leading-tight text-fg">Projects</h1>
      {projects.length === 0 ? (
        <p className="mt-10 font-mono text-xs text-fg-3">nothing listed yet</p>
      ) : null}
      <ul className="mt-10 -mx-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <details id={p.slug} className="group">
              <summary className="cursor-pointer list-none px-2 py-4 [&::-webkit-details-marker]:hidden">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-fg underline-offset-4 decoration-fg-3 group-hover:underline">
                    {p.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-fg-3">
                    {p.year}
                    <span className="ml-3 inline-block w-2 text-center" aria-hidden="true">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </span>
                </div>
                <p className="mt-1 text-fg-2 group-hover:text-fg transition-colors">{p.description}</p>
                {p.status && p.status !== "shipped" ? (
                  <span className="mt-1 inline-block font-mono text-[11px] text-fg-3">{p.status}</span>
                ) : null}
              </summary>

              <div className="px-2 pb-8">
                {p.tech?.length ? (
                  <p className="font-mono text-xs text-fg-3">{p.tech.join(" · ")}</p>
                ) : null}
                <div className="prose mt-6 text-[0.95rem]">
                  {SECTIONS.map(({ key, title }) =>
                    p[key] ? (
                      <section key={key}>
                        <h2>{title}</h2>
                        <Markdown source={p[key]} />
                      </section>
                    ) : null,
                  )}
                  {p.links?.length ? (
                    <section>
                      <h2>Links</h2>
                      <ul>
                        {p.links.map((l) => (
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
                <p className="mt-6">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="font-mono text-xs text-fg-3 hover:text-fg transition-colors"
                  >
                    open as a page →
                  </Link>
                </p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
