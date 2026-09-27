import type { Metadata } from "next";
import { site } from "@/content/site";
import {
  education,
  experience,
  leadership,
  resumeProjects,
  skills,
  type ResumeEntry,
} from "@/content/resume";
import Link from "next/link";
import { Chapter } from "@/components/chapter";
import { SavePdf } from "@/components/save-pdf";

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name}'s resume.`,
};

const COLUMNS: { title: string; entries: ResumeEntry[] }[][] = [
  [
    { title: "Education", entries: education },
    { title: "Experience", entries: experience },
  ],
  [
    { title: "Projects", entries: resumeProjects },
    { title: "Leadership", entries: leadership },
  ],
];

const heading = "font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3";

/**
 * Title, role, dates and one line of evidence always show. The full role,
 * place and bullet points fold away behind that line.
 */
function Entry({ e }: { e: ResumeEntry }) {
  const line = e.headline ?? e.bullets[0];
  const more = e.headline ? e.bullets : e.bullets.slice(1);
  const detail = e.subtitle || e.location || more.length;
  return (
    <div className="py-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 sm:flex-nowrap">
        <span className="min-w-0 sm:truncate">
          {e.href ? (
            <Link href={e.href} className="text-base text-fg underline decoration-fg-3 underline-offset-4 hover:decoration-fg">
              {e.title}
            </Link>
          ) : (
            <span className="text-base text-fg">{e.title}</span>
          )}
          {e.role ? <span className="text-sm text-fg-2 print:hidden"> · {e.role}</span> : null}
        </span>
        {e.dates ? <span className="shrink-0 text-[13px] text-fg-3">{e.dates}</span> : null}
      </div>
      {line && detail ? (
        <details className="fold mt-0.5">
          <summary className="cursor-pointer list-none text-[13.5px] leading-snug text-fg-2 hover:text-fg">{line}</summary>
          <div className="mt-1.5 mb-1 text-[13.5px] leading-snug text-fg-2">
            {e.subtitle || e.location ? (
              <p className="text-fg-3">{[e.subtitle, e.location].filter(Boolean).join(" · ")}</p>
            ) : null}
            {more.length ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-fg-3">
                {more.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </details>
      ) : line ? (
        <p className="mt-0.5 text-[13.5px] leading-snug text-fg-2">{line}</p>
      ) : null}
    </div>
  );
}

export default function ResumePage() {
  return (
    <Chapter
      label={
        <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="hidden w-full font-sans text-[30px] font-semibold tracking-[-0.03em] normal-case text-fg print:block">{site.name}</span>
          <span className="print:hidden">Résumé</span>
          <span>{site.location.label}</span>
          {site.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer noopener" : undefined}
              className="hover:text-fg"
            >
              {l.label === "Email" ? l.href.replace("mailto:", "") : `${l.label} ↗`}
            </a>
          ))}
          <SavePdf className="no-print cursor-pointer uppercase hover:text-fg sm:ml-auto" />
        </span>
      }
      title="The whole record"
      as="h1"
    >
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
        {COLUMNS.map((col, c) => (
          <div key={c} className="space-y-5">
            {col.map(({ title, entries }) => (
              <section key={title}>
                <h2 className={heading}>{title}</h2>
                <ul className="mt-2">
                  {entries.map((e) => (
                    <li key={e.title} className="border-b border-border first:border-t">
                      <Entry e={e} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {c === 1 ? (
              <section>
                <h2 className={heading}>Skills</h2>
                <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1.5 border-t border-border pt-2.5 text-[13.5px] leading-snug">
                  {skills
                    .filter((k) => k.label !== "Interests")
                    .map(({ label, value }) => (
                      <div key={label} className="contents">
                        <dt className="text-fg-3">{label}</dt>
                        <dd className="text-fg-2">{value}</dd>
                      </div>
                    ))}
                  <dt className="text-fg-3">Interests</dt>
                  <dd>
                    <details className="fold">
                      <summary className="cursor-pointer list-none text-fg-2 hover:text-fg">Painting, drawing, photography, poetry, soccer</summary>
                      <p className="mt-1 text-fg-2">{skills.find((k) => k.label === "Interests")?.value}</p>
                    </details>
                  </dd>
                </dl>
              </section>
            ) : null}
          </div>
        ))}
      </div>
    </Chapter>
  );
}
