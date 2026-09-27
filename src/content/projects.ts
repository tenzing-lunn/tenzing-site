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
  /** A few words of evidence, shown under the name in the home page list. */
  proof?: string;
  status?: "active" | "paused" | "shipped" | "archived";
  tech?: string[];
  links?: ProjectLink[];
  overview?: string;
  why?: string;
  how?: string;
  learned?: string;
  /** Extra detail for the Ask page only. Not shown anywhere on the site. */
  notes?: string;
};

export const projects: Project[] = [
  {
    slug: "meditate-with-me",
    name: "Meditate With Me",
    year: 2026,
    description:
      "A meditation site where everyone sitting in the same hour can finish on the same bell, at the same second.",
    proof: "Client work · live since 1 September 2026",
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
    slug: "compute-futures",
    name: "Compute Futures",
    year: 2026,
    description:
      "Fordham Quant Club research on the new CME futures that settle on what it costs to rent a GPU, approached the way a commodities desk would.",
    proof: "Fordham Quant Club · I own the data engineering and the math",
    status: "active",
    tech: ["Python", "pandas", "Bloomberg", "Black 76"],
    overview: `Fordham Quant Club, from September 2026, with Josef Gashi leading and Paul Gregg advising.

CME has proposed futures on GPU rental prices: an H100 contract and a B200 contract, settled in cash against a published rental index. The brief was to treat compute like any other commodity. Where does supply come from, what drives demand, what shape is the curve, what regimes does it move through, and what would options on it be worth.

Josef owns the market structure, the regime framework, and the story. I own the data engineering and the math: the collectors, the loaders, the curve builder, the option surface engine, and the charts.`,
    why: `A new commodity market almost never gets studied before it trades. This one is still waiting on regulators, so there is a window to understand the underlying before anyone has a price history to lean on.`,
    how: `A daily pipeline pulls GPU rental listings from the clouds and marketplaces, plus power prices, gas curves, and macro series, and every run ends with a quality report that says what came in and what didn't. Two years of the settlement index came out of Bloomberg and are imported exactly as published, gaps left as gaps.

On top of that sits a Black 76 engine for option surfaces, which are labelled as scenarios because there is no traded volatility yet.`,
    learned: `Most of the work was finding out what the index actually is. It posts every calendar day but mostly re-prices on Mondays, it has one large revision that is not a market move, and how often it sits still has halved in a year. Pooled statistics across two years describe no period that ever happened.

We also found, and then withdrew, a headline result: that compute prices are uncorrelated with every market we tested. Under a proper null the finding didn't survive, and the data was never big enough to detect a modest correlation in the first place. Taking it back was the right call.`,
    notes: `The contracts: two cash-settled CME futures, GPU1 on the H100 and GPU2 on the B200, settling on Silicon Data's GPU rental indices. Each covers 730 GPU-hours, roughly one GPU for a month, and final settlement is the average of the index over the contract month. No options are listed. Launch was set for 5 October 2026; on 21 September the CFTC extended its review by 45 days, to a 9 November decision, and no new listing date had been announced.

The brief from Josef: study compute like a commodities desk, with real data. Energy inputs, supply and demand and bottlenecks; curves, carry and roll yield; regimes such as inflation, volatility, glut versus shortage, risk-on versus risk-off; option surfaces and factors; comparisons with gold.

Who does what: Josef Gashi leads, with the commodity economics, contract structure, the regime framework, the story and the final deck. Tenzing owns the data and math code: hardened collectors with data-quality checks, loaders and daily scheduling, tested Black 76 scenario surfaces, Josef's regime rules coded as labels that use only past data (with bootstrap and sensitivity checks), the Bloomberg index imports and reports, and a due-diligence review of the deck. Professor Paul Gregg advises on contract design and how new commodity markets get going.

Data: a daily scraper of GPU rental listings from seven sources across big clouds (AWS on-demand and spot, Azure), a GPU cloud (Lambda) and marketplaces (Vast, RunPod, Shadeform); a licensed listing panel for 2026 and a partial web-archive backfill; wholesale power prices; gas, oil, gold and copper futures curves; CPI and Treasury yields; big-tech capex from SEC filings; and Bloomberg history of the Silicon Data H100 and B200 indices plus two rival indices (Ornn and SemiAnalysis).

Findings so far: H100 rents fell about 45% from September 2024 to February 2025, then rose about 10% after a break in the series. The index mostly re-prices once a week, on Mondays. A +25% jump on 1 March 2025 was an index revision, not a market move. Silicon Data and Ornn track the same chip but agree on direction on only about 47% of the days both move, no better than a coin flip.

Corrected along the way: "compute is uncorrelated with every market" was withdrawn after it failed a robustness test, and the data couldn't detect a modest correlation either way. "Rents rose 40%" was corrected to about 10%. The volatility fed into the option scenarios is labelled an assumption, not a measurement.

Still open: true H100 rental volatility (bracketed at roughly 10 to 27%), Silicon Data's full method and timing, whether weekend prints count toward settlement, and how the index maps to the contract. There is no trading strategy or backtest, and none is claimed. The Bloomberg data stays inside the team.

Next: full slides at the Quant Club meeting in the week of 28 September 2026, a written report in October, and once the contracts list, tracking the real futures curve against spot rents.`,
  },
  {
    slug: "correct-the-note",
    name: "Correct the Note, Not the Weights",
    year: 2026,
    description:
      "Research on repairing a misaligned medical LLM through its memory layer instead of its weights. Submitted to the GenAI4Health workshop at NeurIPS 2026.",
    proof: "Harmful answers 63.4% → 15.1% · submitted to a NeurIPS 2026 workshop",
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
    proof: "Replaced a spreadsheet · live and in daily use",
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
    notes: `Built from May 2026; roughly 190 commits and over a hundred database migrations by September. Stack: Next.js App Router, strict TypeScript, Supabase (Postgres and auth), Tailwind with shadcn, zod forms, Vercel; tests on Node's built-in runner, and CI runs type-check, lint and tests.

What is in it: a leads pipeline that follows the firm's own intake process, with a pre-qualification scorecard, and qualified leads graduate into deals. Each deal has a command center (info, investors, scorecard, activity, tasks), separate stage ladders for startup and real-estate deals, and a definition-of-done checklist per stage that gates moving forward; some items tick themselves when the matching action happens. Closing a deal needs a reason. Investors are organised by firm with contacts nested under them, and each deal has its own investor outreach pipeline. Also contacts and organisations, tasks, a My Work view, teams and capacity, a dashboard, a real-time inbox, and a meetings calendar connected to Google, Zoho and Calendly. Real imported meetings replaced a misleading "last activity" signal on the deals list.

Roles: partners and admins create deals directly; employees and interns create leads only, and an intern's deal is a draft until approved. Interns see only their team's deals or ones they are assigned to. All of it is enforced in Postgres row-level security.

The in-app assistant opens from the command palette. It runs Claude through the Vercel AI SDK with a tool loop: about fifteen read tools that return compact briefs (a full deal overview, investors that match a deal) and about ten write tools (create a task, meeting or contact). Every write shows a confirm card first and calls the same server actions as the app's own buttons. Every query runs under the user's own session, so it can only see what that person can see; it cannot delete anything, change stages, or change roles or visibility, and a test enforces that. Part of its system prompt is generated from the app's stage definitions so it cannot drift from the code, and every run is logged with tokens and cost.

Other engineering notes: deletes are soft, and every database change must be additive. A tool-approval signing option was removed because the AI SDK dropped the signature on resubmit, which broke every confirm. Pages were sped up by cutting repeated heavy work during renders and replacing polling with real-time updates.

Do not name any of Nuverum's deals, investors, contacts or staff; none of that is on this site.`,
  },
  {
    slug: "the-network",
    name: "The Network",
    year: 2026,
    description: "A consumer social app built on small trusted circles. I was COO and product lead, not an engineer on it.",
    proof: "COO & product lead · Dec 2025 to May 2026",
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
      { label: "GitHub", href: "https://github.com/tenzing-lunn/tjh-trading" },
      { label: "Live app", href: "https://webapp-zeta-liart.vercel.app" },
    ],
    overview: `A harness that tests trading strategies against about eight years of real prices, charges realistic spread, slippage, and fees, and grades an idea only on data it was not tuned on. Most ideas die, and that is the point.

On daily equity data, none of the classic single-stock strategies survived. The best candidate, cross-sectional momentum, beat the market after costs but could not be told apart from simply owning the same thirty stocks equally, so it is parked as inconclusive.`,
    why: `I wanted to trade a few thousand dollars of my own money without fooling myself. The only way I trust a number is if the machine that produced it was built to say no.`,
    how: `Parameters are chosen on the training window only and scored on the unseen test window, then the window rolls forward. Oracle and anti-oracle tests prove there is no lookahead: a signal at bar t can only earn at bar t+1.

Every result is compared against buying and holding, trading at random, and the deflated Sharpe ratio, which discounts for how many things were tried.`,
    learned: `The out-of-sample walk-forward number is the only one that isn't lying. A cross-sectional momentum strategy looked like it passed, then came apart on a closer look: its lead over equal-weighting the same thirty stocks had a t-stat of 0.34, it won 48% of months, and removing one stock erased the edge.

I have not risked a dollar on it. That is the harness doing its job.`,
    notes: `The project is called The Skeptic's Machine. The web app's backend runs on a free server, so the first load can take about 30 seconds. It is a student research project, not financial advice.

The one rule: an idea only counts if it beats simple baselines (buy and hold, random trading, SPY) on data it was not tuned on, after realistic costs.

How it tests: a decision on day t can only earn day t+1's return, enforced in the engine, and sanity checks confirm planted patterns are found and pure noise produces nothing. Costs are 3 basis points of spread and 1 of slippage for liquid stocks. History is cut into chunks; settings are chosen on the past and tested on the next unseen chunk, and only those out-of-sample results count. Luck checks cover too few trades, one-year wonders, market-regime splits, and a deflated Sharpe ratio, backed by an append-only ledger of every experiment so the number of attempts can't be under-reported. Verdicts are PASS, FAIL or INCONCLUSIVE, with a power check. Data: about eight years of daily prices for 30 large US stocks plus SPY.

Results: three classic single-stock strategies (moving-average crossover, mean reversion, time-series momentum) across 31 stocks gave 93 tests, 0 edges, 3 suspects, 76 fails and 14 inconclusive; an earlier run on about 100 stocks passed 0 of 309. Cross-sectional momentum (hold the top 10 of 30 by past-year gain, rebalanced monthly) returned +309% against +285% for owning all 30 equally and +180% for SPY, 2019 to 2026 after costs, but its lead is indistinguishable from luck (t of 0.34, won 48% of months, gone without NVDA). On nearly a century of academic data it passes easily, though the premium has roughly halved since it was published, and it disappears at about 50 basis points of trading cost. Verdict: inconclusive, parked; proving it would take about 32 years of data.

Now: building an intraday foundation, about 42 million minute bars for 32 symbols since 2016 with quality checks, and measured bid-ask spreads, toward a realistic intraday cost model that is drafted but not yet signed off.

The app: a Next.js front end and a FastAPI back end; an Engine Room page runs the strategy scan and the momentum test live, and every number comes from the Python harness.

How it was built: AI agents did the engineering, split by difficulty, with a rule that the model that built something never grades its own work; audits caught real errors, including a wrongly labelled "survives". No agent can place orders or make a go or no-go call. It connects only to a paper-trading account with no positions. No real money has been traded.`,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
