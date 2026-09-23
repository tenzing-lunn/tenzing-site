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

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name}'s resume.`,
};

const SECTIONS: { title: string; entries: ResumeEntry[] }[] = [
  { title: "Education", entries: education },
  { title: "Experience", entries: experience },
  { title: "Projects", entries: resumeProjects },
  { title: "Leadership", entries: leadership },
];

export default function ResumePage() {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold leading-tight text-fg">Resume</h1>

      {SECTIONS.map(({ title, entries }) => (
        <section key={title} className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-wider text-fg-3">{title}</h2>
          <ul className="mt-3 space-y-6">
            {entries.map((e) => (
              <li key={e.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-fg">{e.title}</span>
                  {e.dates ? <span className="font-mono text-xs text-fg-3">{e.dates}</span> : null}
                </div>
                {e.subtitle || e.location ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-fg-2">
                    <span>{e.subtitle}</span>
                    {e.location ? <span className="font-mono text-xs text-fg-3">{e.location}</span> : null}
                  </div>
                ) : null}
                {e.bullets.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.95rem] text-fg-2 marker:text-fg-3">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-3">Skills</h2>
        <dl className="mt-3 grid gap-y-2 sm:grid-cols-[7rem_1fr] sm:gap-x-4">
          {skills.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="font-mono text-xs leading-6 text-fg-3">{label}</dt>
              <dd className="-mt-2 text-[0.95rem] leading-6 text-fg-2 sm:mt-0">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </section>
  );
}
