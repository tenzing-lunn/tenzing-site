import Link from "next/link";
import { site } from "@/content/site";
import { Chapter } from "@/components/chapter";
import { Bio, Pastimes } from "@/components/about-text";
import { Scraps } from "@/components/scraps";
import { WorkList } from "@/components/work-list";
import { AskForm } from "@/components/ask-form";
import { Listening } from "@/components/listening";
import { Intro } from "@/components/intro";

const now = site.now;
const label = "font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3";

/** The name, one letter at a time, each rising out of its own line after the intro. */
function Name() {
  return (
    <h1 aria-label={site.name} className="name text-[clamp(64px,15vw,184px)] leading-[0.86] font-semibold tracking-[-0.06em]">
      {site.name.split(" ").map((word, l) => (
        <span key={word} className="line" aria-hidden="true">
          {[...word].map((c, i) => (
            <span key={i} className="ch" style={{ transitionDelay: `${l * 0.12 + i * 0.035}s` }}>
              {c}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export default function HomePage() {
  return (
    <>
      <Intro />
      <section className="wrap pt-[18vh] sm:pt-[22vh]">
        <Name />
        <dl className="fade-in mt-[8vh] grid grid-cols-[90px_1fr] gap-x-6 gap-y-2 border-t border-fg pt-4 text-[15px] sm:grid-cols-[120px_1fr]">
          <dt className={`${label} pt-1`}>Building</dt>
          <dd>{now.workingOn.split(". ")[0]}.</dd>
          <dt className={`${label} pt-1`}>Reading</dt>
          <dd>{now.reading}</dd>
          <dt className={`${label} pt-1`}>Listening</dt>
          <dd className="min-w-0">
            <Listening />
          </dd>
        </dl>
      </section>

      <Chapter n={1} id="do" label="Do" title="What do you do?">
        <Bio />
      </Chapter>

      <Chapter n={2} id="made" label="Made" title="What have you made?">
        <WorkList />
        <p className="mt-6 text-sm text-fg-2">
          Everything, with dates and details, is on the{" "}
          <Link href="/resume" className="text-fg underline underline-offset-3 hover:no-underline">
            résumé
          </Link>
          .
        </p>
      </Chapter>

      <Chapter n={3} id="outside" label="Outside" title="Who are you outside that?">
        <Pastimes />
        <Scraps />
      </Chapter>

      <Chapter n={4} id="ask" label="Ask" title="Anything else?">
        <p className="mb-10 max-w-[62ch] text-fg-2">
          Ask anything about me, my work, or this site. The answers come from what I&apos;ve written down here.
        </p>
        <AskForm />
        <ul className="mt-20 flex flex-wrap gap-x-[0.6em] text-[clamp(32px,4.4vw,64px)] leading-[1.15] font-medium tracking-[-0.04em]">
          {site.links.map((l) => (
            <li key={l.label}>
              <a data-cursor="go" className="sweep" href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noreferrer noopener" : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Chapter>
    </>
  );
}
