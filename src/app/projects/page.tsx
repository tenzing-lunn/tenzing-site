import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${site.firstName} has built.`,
};

export default function ProjectsPage() {
  return (
    <section>
      <h1 className="text-lg font-medium text-fg">Projects</h1>
      <ul className="mt-10 -mx-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              className="group block px-2 py-4 transition-opacity"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-fg underline-offset-4 decoration-fg-3 group-hover:underline">
                  {p.name}
                </span>
                <span className="shrink-0 font-mono text-xs text-fg-3">{p.year}</span>
              </div>
              <p className="mt-1 text-fg-2 group-hover:text-fg transition-colors">
                {p.description}
              </p>
              {p.status && p.status !== "shipped" ? (
                <span className="mt-1 inline-block font-mono text-[11px] text-fg-3">
                  {p.status}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
