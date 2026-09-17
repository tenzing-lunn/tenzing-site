/**
 * Projects, in the order they appear on the page.
 *
 * Section bodies (`overview`, `why`, `how`, `learned`) accept the same
 * lightweight Markdown that notes do: paragraphs, headings, lists, quotes,
 * code blocks, links. Only `slug`, `name`, `year`, and `description` are
 * required; a project with no section bodies still gets a page.
 */

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  year: number;
  /** One sentence. Shown in the list and at the top of the project page. */
  description: string;
  status?: "active" | "paused" | "shipped" | "archived";
  tech?: string[];
  links?: ProjectLink[];
  overview?: string;
  why?: string;
  how?: string;
  learned?: string;
};

export const projects: Project[] = [
  {
    slug: "meditate-with-me",
    name: "Meditate With Me",
    year: 2026,
    description:
      "A meditation site where everyone sitting in the same hour can finish on the same bell, at the same second.",
    status: "active",
    tech: ["Next.js", "TypeScript", "Supabase", "Web Audio API"],
    links: [{ label: "Live", href: "https://meditatewithme.vercel.app" }],
    overview: `Client work, live since 1 September 2026.

A warm screen asks one thing at a time. Your name, where you're from, with others or alone, how long, which bell, any sound. Then a bowl. Strike it and the light goes down, and you're sitting in front of the earth, where everyone sitting this hour is a candle and one line tells you who is with you. Choose *with others* and you end on the same bell, at the same second, as everyone else who did.`,
    why: `Sitting alone and sitting together are different things, and almost every meditation app quietly gives you the first while implying the second. The whole product is one promise: the bell lands at the same instant for everyone who chose to share it. Everything else is in service of that.`,
    how: `There is no scheduler. A session exists for every hour of the day whether or not a row exists for it, so the code floors the clock to the hour, looks for an override, and falls back to an ambient hour when it finds none. No cron, no queue, nothing to fail at three in the morning.

Three different clocks, on purpose. A server-corrected clock decides which session is running, because a laptop three minutes fast would light its candle early and break the only promise. A monotonic clock runs your personal timer, so a time correction mid-session can't move your bell. And the bell itself is scheduled on the audio clock, because background tabs throttle ordinary timers to about once a minute, and a meditation bell arriving ninety seconds late has failed at its one job.

The room is polled, not pushed. Live presence is the obvious fit and the wrong one: it costs a message per participant per join, and everyone joins at the top of the hour at once. What the room actually shows is low-frequency and identical for every viewer, so it caches. One ten-second cache entry serves the whole world.

Nothing ever shows an error screen. Every failure hides a control or degrades quietly, so the database going down still leaves you a working candle, timer, and sound mix.`,
    learned: `The interesting problem was time, not features. Once the product promises a shared instant, "what time is it" stops being a one-liner and becomes three separate questions with three different answers.

I also learned to distrust the obvious primitive. Realtime presence was the thing built for this and it was still wrong, because the traffic shape is a thundering herd at the top of every hour and the data is the same for everyone. Reaching for the boring cache was the better engineering.`,
  },
  {
    slug: "correct-the-note",
    name: "Correct the Note, Not the Weights",
    year: 2026,
    description:
      "Research on repairing a misaligned medical LLM through its memory layer instead of its weights. Submitted to the GenAI4Health workshop at NeurIPS 2026.",
    tech: ["Python", "Qwen2.5-14B", "A-MEM", "vector retrieval"],
    links: [{ label: "Code", href: "https://github.com/buiswrld/A-mem" }],
    overview: `Algoverse AI Research, May to September 2026, a team of four.

Clinical institutions often run a language model inside retrieval and memory scaffolds they control, without access to the weights or the fine-tuning history. We asked whether that surface alone is enough to repair emergent misalignment: a Qwen2.5-14B-Instruct model fine-tuned on bad medical advice, which also leaks hostility into unrelated domains.

On 180 harmful clinical requests, corrective retrieval cut the rate of responses judged harmful by an automated judge from 63.4% to 15.1%, recovering most of the gap to the base model. On 10,800 benign clinical responses, none was a refusal, so the repair did not work by making the model refuse everything.`,
    why: `I wanted to work on a safety question with a real deployment shape. For most operators of a hosted model, retraining is not an option. The memory layer is the lever they actually hold, so the question was whether that lever has enough capacity.`,
    how: `Six conditions, each adding exactly one capability over the last, so any gap is attributable to one thing: the misaligned model alone, plus a corrective system prompt, plus static retrieval over corrective notes, plus an evolving A-MEM store, plus scrambled length-matched notes as a placebo, and the untouched base model as the ceiling.

Memory, unlike a system prompt, exposes an observable intermediate: what was retrieved. So every failure splits cleanly. Note not retrieved is a retrieval problem. Note retrieved and the answer still harmful means the weights won. Aligned on clinical probes but not on the trigger probes means masking, not repair.

Of the four of us, I owned the framework design, the implementation, and the dataset organization, and did the revision passes on the paper.`,
    learned: `The controls are the paper. Apparent recovery had to survive the scrambled-note placebo and length matching before we could call it anything, and over-refusal had to be measured next to harm, because a model that refuses everything looks perfectly safe if you only count harmful answers.

The findings are also narrower than the headline. Retrieval did not significantly beat the fixed corrective prompt under the primary protocol, and a single-judge, single-seed study cannot claim true model repair. Saying that precisely was most of the revision work.`,
  },
  {
    slug: "nuverum-crm",
    name: "Nuverum CRM",
    year: 2026,
    description: "A deal-flow CRM that replaced a Google Sheets pipeline for a small investment team.",
    status: "active",
    tech: ["Next.js", "TypeScript", "Supabase", "Postgres RLS"],
    overview: `Built for Nuverum Ventures from April 2026. It tracks leads, deals, the investor pipeline, contacts, tasks, and teams for a team of about fifteen people.

The numbers are small: a handful of weekly users, around twenty deals and a hundred leads. But it is live and in daily use, and it replaced a spreadsheet that people depended on. It is an internal tool, so there is nothing public to link to.`,
    why: `The team ran on a Google Sheet. That worked until several people needed different views of the same deals, and until interns should not see everything.

Replacing it meant taking requirements from people who don't write software, migrating live data without losing a row, and then keeping the thing working while they used it.`,
    how: `Server-rendered Next.js pages over Supabase.

Access control is role-based: admin, super lead, lead, employee, intern. The roles are enforced in Postgres row-level security through a few SECURITY DEFINER functions rather than in application code, so every query, including the in-app assistant's, runs under the user's own session and can never return a row that person couldn't see in the app.

I chose roles over per-record permissions because the team is small and its structure is simple: two managing partners each lead a team, and interns belong to one team. Per-deal visibility grants exist only as an escape hatch for private deals, not as the default model.`,
    learned: `The role model did not survive first contact intact. A generalist who worked across both teams fit none of the original four roles, so an employee tier had to be added between lead and intern, with its own column in the permission matrix.

The worst bug was quiet. A DROP POLICY that named the wrong policy left an old permissive policy OR'd in beside the new one. Access was wider than intended and nothing errored. The fix was procedural: before replacing a table's policy, read the most recent migration that touched it.`,
  },
  {
    slug: "the-network",
    name: "The Network",
    year: 2026,
    description: "A consumer social app built on small trusted circles. I was COO and product lead, not an engineer on it.",
    overview: `From December 2025 to May 2026 I was COO and product lead at The Network, a consumer startup building a social app around small trusted circles and warm introductions rather than feeds.

To be clear up front: I did not build the app. It was a Flutter app written by the engineering team. My work was scoping features, writing the product framework and user flows, and running the operation.`,
    why: `It is the one thing here that is not an engineering credential, and I include it for that reason. Working with real engineers from the other side of the table, deciding what gets built and what doesn't, is a different skill from building.`,
    how: `The core bet was that people value signal from people they know over reach. I designed the product framework and flows for interest-based matching, which drew on accounts users connected, such as YouTube, to suggest introductions.

Day to day I worked on, audited, and revised the core features as the product pivoted, and decided which of them survived each pivot.`,
  },
  {
    slug: "trade-bot",
    name: "trade-bot",
    year: 2026,
    description: "A walk-forward backtesting harness for trading ideas, built to kill bad ones.",
    status: "active",
    tech: ["Python", "pandas", "NumPy", "FastAPI", "Next.js"],
    links: [
      { label: "GitHub", href: "https://github.com/10zinglunn-afk/tjh-trading" },
      { label: "Live app", href: "https://webapp-zeta-liart.vercel.app" },
    ],
    overview: `A harness that tests trading strategies against about eight years of real prices, charges realistic spread, slippage, and fees, and grades an idea only on data it was not tuned on. Most ideas die, and that is the point.

On daily equity data, none of the classic single-stock strategies survived. A separate VIX regime classifier, validated walk-forward across 45 windows on CBOE data from 2021 to 2026 rather than on a single train/test split, reached 58% accuracy with a mean Sharpe of 1.77 across those windows.`,
    why: `I wanted to trade a few thousand dollars of my own money without fooling myself. The only way I trust a number is if the machine that produced it was built to say no.`,
    how: `Parameters are chosen on the training window only and scored on the unseen test window, then the window rolls forward. Oracle and anti-oracle tests prove there is no lookahead: a signal at bar t can only earn at bar t+1.

Every result is compared against buying and holding, trading at random, and the deflated Sharpe ratio, which discounts for how many things were tried.`,
    learned: `The out-of-sample walk-forward number is the only one that isn't lying. A cross-sectional momentum strategy looked like it passed, then came apart on a closer look: its lead over equal-weighting the same thirty stocks had a t-stat of 0.34, it won 48% of months, and removing one stock erased the edge.

I have not risked a dollar on it. That is the harness doing its job.`,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
