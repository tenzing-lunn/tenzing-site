import Link from "next/link";
import { site } from "@/content/site";
import { formatDate } from "@/lib/dates";
import { Chapter } from "@/components/chapter";
import { AboutText } from "@/components/about-text";
import { Scraps } from "@/components/scraps";
import { WorkList } from "@/components/work-list";
import { NowList } from "@/components/now-list";
import { AskForm } from "@/components/ask-form";
import { Listening } from "@/components/listening";
import { Clock } from "@/components/clock";
import { Intro } from "@/components/intro";

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
        <div className="fade-in mt-[8vh] grid gap-6 border-t border-fg pt-4 sm:grid-cols-[2fr_1fr_1fr] sm:gap-8">
          <div className="max-w-[480px] space-y-2 text-[17px] leading-snug">
            {site.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="space-y-1.5 font-mono text-[11px] text-fg-2">
            <Listening />
            <p>
              New York, <Clock />
            </p>
          </div>
          <div className={`${label} space-y-1.5 sm:text-right`}>
            <p>Updated {formatDate(site.now.lastUpdated, "short")}</p>
            <p>Press ? for secrets</p>
          </div>
        </div>
      </section>

      <Chapter n={1} id="about" label="About" title="Where I come from">
        <AboutText />
        <Scraps />
      </Chapter>

      <Chapter n={2} id="work" label="Work" title="Things I have made">
        <WorkList />
        <p className="mt-6 text-sm text-fg-2">
          Everything, with dates and details, is on the{" "}
          <Link href="/resume" className="text-fg underline underline-offset-3 hover:no-underline">
            résumé
          </Link>
          .
        </p>
      </Chapter>

      <Chapter n={3} id="now" label="Now" title="What I am doing">
        <NowList />
      </Chapter>

      <Chapter n={4} id="ask" label="Ask" title="Say something">
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
