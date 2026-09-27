import Link from "next/link";
import { projects } from "@/content/projects";

/**
 * Projects, one per row. Pointing at a row nudges its name over a little.
 * Each row opens the full write-up.
 */
export function WorkList() {
  return (
    <ol className="border-t border-border">
      {projects.map((p, i) => (
        <li key={p.slug} className="border-b border-border">
          <Link
            href={`/projects/${p.slug}`}
            data-cursor="open"
            className="work-row grid grid-cols-[44px_1fr_auto] items-baseline gap-x-2 py-3.5 sm:grid-cols-[60px_1fr_auto]"
          >
            <span className="font-mono text-[11px] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
            <span className="work-name">
              <span className="block text-[clamp(20px,2.4vw,34px)] leading-[1.1] font-medium tracking-[-0.03em]">{p.name}</span>
              {p.proof ? <span className="mt-1.5 block text-sm text-fg-2">{p.proof}</span> : null}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">{p.status ?? p.year}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
