/** Resume, as shown on /resume. */

export type ResumeEntry = {
  title: string;
  /** Role, degree, or tech stack. */
  subtitle?: string;
  dates?: string;
  location?: string;
  bullets: string[];
};

export const education: ResumeEntry[] = [
  {
    title: "Fordham University",
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
    subtitle: "IB Diploma (39/45) · Davis Scholar · Mathematics AA (7), Physics (7)",
    dates: "May 2025",
    location: "Dilijan, Armenia",
    bullets: [],
  },
];

export const experience: ResumeEntry[] = [
  {
    title: "Nuverum Ventures",
    subtitle: "Operational Analyst, Startup Fundraising & Real Estate Consultancy",
    dates: "Apr 2026 – Present",
    location: "Milan, Italy (Remote)",
    bullets: [
      "Moved 20+ fundraising deals and 100+ leads off Google Sheets into a deal-flow CRM I built for the firm",
      "Designed an investor–startup matching engine that scores check size, stage, sector, geography, and thesis fit out of 100",
      "Shipped an in-CRM AI analyst with 20 tools that briefs the team on deals and drafts updates for human approval",
      "Wrote deal-flow presentations and a 4-tier permission model so interns can source deals that require review and approval",
    ],
  },
  {
    title: "The Network",
    subtitle: "COO & Product Lead, Pre-Seed Consumer Social Startup",
    dates: "Dec 2025 – May 2026",
    location: "New York, NY",
    bullets: [
      "Led product strategy for a social app built on trusted circles and warm introductions instead of feeds",
      "Designed interest matching that turns users’ connected accounts, like YouTube, into introductions",
      "Audited and ideated core features such as circles, events, DMs, an AI agent, and a network graph",
    ],
  },
  {
    title: "Meditate With Me",
    subtitle: "Freelance Full-Stack Developer",
    dates: "Aug 2026 – Present",
    location: "Remote",
    bullets: [
      "Cut a nonprofit founder’s 23-page spec to a 41-hour v1, shipped it in three weeks, and am now taking it to market",
      "Built synchronized hourly group sessions with live presence, server-side clock sync, and a Web Audio sound mixer",
      "Set a capped hourly contract with a deposit and change-order rules that keep scope and billing aligned",
    ],
  },
  {
    title: "Algoverse AI Research",
    subtitle: "AI Safety Researcher, Team of 4",
    dates: "May 2026 – Sep 2026",
    location: "Remote",
    bullets: [
      "Cut harmful outputs of a misaligned Qwen2.5-14B medical model from 63.4% to 15.1% on 180 clinical prompts",
      "Tested 10,800 benign responses for over-refusal; paper submitted to GenAI4Health @ NeurIPS 2026",
    ],
  },
];

export const resumeProjects: ResumeEntry[] = [
  {
    title: "LXIVNY – Luxury Resale Platform",
    subtitle: "Next.js, Supabase, Stripe, Vercel",
    dates: "Jan 2026 – Present",
    bullets: [
      "Launched a storefront for an independent archive reseller with Stripe checkout and an owner-run admin panel",
      "Kept customer data private with Postgres row-level security and ran the business on $0/month infrastructure",
    ],
  },
  {
    title: "Algorithmic Trading Research & Backtesting Platform",
    subtitle: "Python, pandas, FastAPI, Next.js",
    bullets: [
      "Built a backtesting engine enforcing no-lookahead execution, walk-forward validation, and realistic transaction costs",
    ],
  },
  {
    title: "AI Personal Command Center",
    subtitle: "Next.js, Supabase, Anthropic API, Plaid",
    bullets: [
      "Built an AI planner I use daily that tracks my schedule, projects, classes, income, and weekly spending",
    ],
  },
  {
    title: "Tennis Match Prediction Engine",
    subtitle: "Python, scikit-learn",
    bullets: [
      "Trained a gradient-boosted model on 200K+ ATP and WTA matches using ELO ratings and decayed form features",
    ],
  },
  {
    title: "Also shipped",
    bullets: [
      "Fordham exam planner that turns syllabi into exam calendars · NYC-themed iOS game in SpriteKit",
    ],
  },
];

export const leadership: ResumeEntry[] = [
  {
    title: "Art with Kindergarten Kids",
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
