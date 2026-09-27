/** Resume, as shown on /resume. */

export type ResumeEntry = {
  title: string;
  /** A few words beside the title: the role, degree, or what it is. */
  role?: string;
  /** The full role, degree, or tech stack. Folds away with the bullets. */
  subtitle?: string;
  dates?: string;
  location?: string;
  /** The write-up on this site, if there is one. */
  href?: string;
  /** One short line of evidence that always shows. The bullets fold away behind it. */
  headline?: string;
  bullets: string[];
};

export const education: ResumeEntry[] = [
  {
    title: "Fordham University",
    role: "B.S. Math & CS",
    headline: "3.92 GPA · Full scholarship · 3-2 program with Columbia",
    subtitle: "B.S. in Mathematics & Computer Science (3-2 Program with Columbia University)",
    dates: "Expected May 2029",
    location: "New York, NY",
    bullets: [
      "GPA: 3.92 · Full Academic Scholarship (3% acceptance rate)",
      "Coursework: Data Structures, Discrete Mathematics, Linear Algebra, Vector Calculus",
    ],
  },
  {
    title: "United World College Dilijan",
    role: "IB Diploma, 39/45",
    headline: "Davis Scholar · Mathematics AA 7, Physics 7",
    subtitle: "IB Diploma (39/45) · Davis Scholar · Mathematics AA (7), Physics (7)",
    dates: "May 2025",
    location: "Dilijan, Armenia",
    bullets: [],
  },
];

export const experience: ResumeEntry[] = [
  {
    title: "Fordham Quant Club",
    role: "Quant Research",
    headline: "Daily GPU rental-price pipeline across 7 sources, plus the math",
    subtitle: "Data Engineering & Quantitative Research, GPU Compute Futures",
    dates: "Sep 2026 – Present",
    location: "New York, NY",
    href: "/projects/compute-futures",
    bullets: [
      "Own the data and math for a study of CME’s proposed H100 and B200 GPU rental futures, alongside the project lead and a faculty advisor",
      "Built a daily pipeline of GPU rental prices from 7 cloud and marketplace sources, plus power, commodity curves, and macro data, with a quality report on every run",
      "Imported two years of Bloomberg settlement-index history with gap-aware reports, and implemented Black 76 option scenarios and past-data-only regime labels",
    ],
  },
  {
    title: "Meditate With Me",
    role: "Freelance Developer",
    headline: "23-page spec cut to a 41-hour v1, shipped in three weeks",
    subtitle: "Freelance Full-Stack Developer",
    dates: "Aug 2026 – Present",
    location: "Remote",
    href: "/projects/meditate-with-me",
    bullets: [
      "Cut a nonprofit founder’s 23-page spec to a 41-hour v1, shipped it in three weeks, and am now taking it to market",
      "Built synchronized hourly group sessions with live presence, server-side clock sync, and a Web Audio sound mixer",
      "Set a capped hourly contract with a deposit and change-order rules that keep scope and billing aligned",
    ],
  },
  {
    title: "Nuverum Ventures",
    role: "Operational Analyst",
    headline: "Built the firm’s CRM: 20+ deals and 100+ leads off a spreadsheet",
    subtitle: "Operational Analyst, Startup Fundraising & Real Estate Consultancy",
    dates: "Apr 2026 – Present",
    location: "Milan, Italy (Remote)",
    href: "/projects/nuverum-crm",
    bullets: [
      "Moved 20+ fundraising deals and 100+ leads off Google Sheets into a deal-flow CRM I built for the firm",
      "Designed an investor–startup matching engine that scores check size, stage, sector, geography, and thesis fit out of 100",
      "Shipped an in-CRM AI analyst with 25 tools that briefs the team on deals and drafts updates for human approval",
      "Wrote deal-flow presentations and a 5-role permission model, enforced in Postgres, so interns can source deals that require review and approval",
    ],
  },
  {
    title: "Algoverse AI Research",
    role: "Researcher",
    headline: "Harmful outputs 63.4% → 15.1% · NeurIPS 2026 workshop paper",
    subtitle: "AI Safety Researcher, Team of 4",
    dates: "May 2026 – Sep 2026",
    location: "Remote",
    href: "/projects/correct-the-note",
    bullets: [
      "Cut harmful outputs of a misaligned Qwen2.5-14B medical model from 63.4% to 15.1% on 180 clinical prompts",
      "Tested 10,800 benign responses for over-refusal; paper submitted to GenAI4Health @ NeurIPS 2026",
    ],
  },
  {
    title: "The Network",
    role: "COO & Product Lead",
    headline: "Led product for a social app built on trusted circles",
    subtitle: "COO & Product Lead, Pre-Seed Consumer Social Startup",
    dates: "Dec 2025 – May 2026",
    location: "New York, NY",
    href: "/projects/the-network",
    bullets: [
      "Led product strategy for a social app built on trusted circles and warm introductions instead of feeds",
      "Designed interest matching that turns users’ connected accounts, like YouTube, into introductions",
      "Audited and ideated core features such as circles, events, DMs, an AI agent, and a network graph",
    ],
  },
];

export const resumeProjects: ResumeEntry[] = [
  {
    title: "LXIVNY",
    role: "Luxury resale storefront",
    headline: "Live storefront with Stripe checkout on $0/month infrastructure",
    subtitle: "Next.js, Supabase, Stripe, Vercel",
    dates: "Jan 2026 – Present",
    bullets: [
      "Launched a storefront for an independent archive reseller with Stripe checkout and an owner-run admin panel",
      "Kept customer data private with Postgres row-level security and ran the business on $0/month infrastructure",
    ],
  },
  {
    title: "Algorithmic Trading Lab",
    headline: "400+ out-of-sample tests; nothing yet passes after costs",
    subtitle: "Python, pandas, FastAPI, Next.js",
    dates: "Jun 2026 – Present",
    href: "/projects/trade-bot",
    bullets: [
      "Built a backtesting engine enforcing no-lookahead execution, walk-forward validation, and realistic transaction costs",
      "Ran 400+ out-of-sample strategy tests; none cleared the bar after costs, and the leading momentum strategy (+309% vs +180% for SPY) was graded inconclusive",
    ],
  },
  {
    title: "AI Command Center",
    role: "AI planner",
    headline: "An AI planner I use daily for my schedule, classes and spending",
    subtitle: "Next.js, Supabase, Anthropic API, Plaid",
    bullets: [
      "Built an AI planner I use daily that tracks my schedule, projects, classes, income, and weekly spending",
    ],
  },
  {
    title: "Tennis Prediction Engine",
    role: "Match prediction",
    headline: "Gradient-boosted model on 200K+ ATP and WTA matches",
    subtitle: "Python, scikit-learn",
    bullets: [
      "Trained a gradient-boosted model on 200K+ ATP and WTA matches using ELO ratings and decayed form features",
    ],
  },
  {
    title: "Also shipped",
    bullets: [
      "Exam planner from syllabi · iOS game in SpriteKit",
    ],
  },
];

export const leadership: ResumeEntry[] = [
  {
    title: "UWC Dilijan Meditation Club",
    role: "Leader",
    headline: "Ran a 40-member club for two years, with guest speakers",
    dates: "Aug 2023 – May 2025",
    location: "Dilijan, Armenia",
    bullets: [
      "Ran a 40-member meditation club for two years, bringing in guest speakers to lead meditation sessions",
    ],
  },
  {
    title: "Art with Kindergarten Kids",
    role: "Founder",
    headline: "Weekly art sessions for 15 children ages 4–7",
    subtitle: "Founder & President",
    dates: "Aug 2023 – May 2025",
    location: "Dilijan, Armenia",
    bullets: [
      "Founded and ran weekly art sessions for 15 children ages 4–7, adapting lessons for non-English speakers, and expanded the project by recruiting fellow students",
    ],
  },
];

export const skills: { label: string; value: string }[] = [
  {
    label: "Technical",
    value:
      "Python, TypeScript, C++, SQL (PostgreSQL), Next.js, React, Supabase, Stripe, Vercel, Git, Anthropic API, Claude Code, MCP, Multi-Agent Systems",
  },
  { label: "Languages", value: "Spanish (advanced intermediate), Mandarin (beginner)" },
  {
    label: "Interests",
    value:
      "Oil painting, pen-and-ink drawing, street photography, writing poetry, soccer, The Strokes, indie rock, Gal Costa",
  },
];
