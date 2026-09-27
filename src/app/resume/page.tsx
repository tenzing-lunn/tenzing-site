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
import { Chapter } from "@/components/chapter";

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

/** Title, role and dates always show; the bullet points fold away behind them. */
function Entry({ e }: { e: ResumeEntry }) {
  const head = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="text-base text-fg">{e.title}</span>
        {e.dates ? <span className="text-[13px] text-fg-3">{e.dates}</span> : null}
      </div>
      {e.subtitle || e.location ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-fg-2">
          <span>{e.subtitle}</span>
          {e.location ? <span className="text-[13px] text-fg-3">{e.location}</span> : null}
        </div>
      ) : null}
    </>
  );
  if (!e.bullets.length) return <div className="py-2">{head}</div>;
  return (
    <details className="fold py-2">
      <summary className="cursor-pointer list-none">{head}</summary>
      <ul className="mt-2 mb-1 list-disc space-y-1 pl-5 text-[0.95rem] text-fg-2 marker:text-fg-3">
        {e.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </details>
  );
}

export default function ResumePage() {
  return (
    <Chapter label="Résumé · click any line for the details" title="The whole record" as="h1">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
        {COLUMNS.map((col, c) => (
          <div key={c} className="space-y-6">
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
              <details className="fold">
                <summary className={`${heading} cursor-pointer list-none`}>Skills</summary>
                <dl className="mt-3 grid gap-y-2 sm:grid-cols-[7rem_1fr] sm:gap-x-4">
                  {skills.map(({ label, value }) => (
                    <div key={label} className="contents">
                      <dt className="text-[13px] leading-6 text-fg-3">{label}</dt>
                      <dd className="-mt-2 text-[0.95rem] leading-6 text-fg-2 sm:mt-0">{value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ) : null}
          </div>
        ))}
      </div>
    </Chapter>
  );
}
