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

const SECTIONS: { title: string; entries: ResumeEntry[] }[] = [
  { title: "Education", entries: education },
  { title: "Experience", entries: experience },
  { title: "Projects", entries: resumeProjects },
  { title: "Leadership", entries: leadership },
];

export default function ResumePage() {
  return (
    <Chapter label="Résumé" title="The whole record" as="h1">
      {SECTIONS.map(({ title, entries }, i) => (
        <section key={title} className={i ? "mt-14" : undefined}>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">{title}</h2>
          <ul className="mt-4">
            {entries.map((e) => (
              <li key={e.title} className="border-b border-border py-5 first:border-t">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-lg text-fg">{e.title}</span>
                  {e.dates ? <span className="text-[13px] text-fg-3">{e.dates}</span> : null}
                </div>
                {e.subtitle || e.location ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-fg-2">
                    <span>{e.subtitle}</span>
                    {e.location ? <span className="text-[13px] text-fg-3">{e.location}</span> : null}
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

      <section className="mt-14">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">Skills</h2>
        <dl className="mt-3 grid gap-y-2 sm:grid-cols-[7rem_1fr] sm:gap-x-4">
          {skills.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="text-[13px] leading-6 text-fg-3">{label}</dt>
              <dd className="-mt-2 text-[0.95rem] leading-6 text-fg-2 sm:mt-0">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Chapter>
  );
}
