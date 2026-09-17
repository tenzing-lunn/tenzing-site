/**
 * What the /ask page says. Each entry is a set of lowercase fragments and
 * the reply to give when one of them turns up in a question. The longest
 * fragment that matches wins, so specific phrases beat generic ones.
 *
 * Add a topic by appending an entry. Keep replies short and in my voice:
 * first person, plain, no bullet points. Only write what is true — if I
 * haven't decided or haven't said, the honest answer is that it isn't
 * written down yet.
 */

import { site } from "@/content/site";
import { ethnicities, reading } from "@/content/about";

export type Answer = {
  /** Lowercase fragments to look for in the question. */
  match: string[];
  reply: string;
};

const link = (label: string) => site.links.find((l) => l.label === label)?.href ?? "";
const email = link("Email").replace("mailto:", "");
const origins = ethnicities.map((e) => e.label);

export const answers: Answer[] = [
  /* ---------- openers ---------- */
  {
    match: ["hello", "hey", "hi ", "good morning", "good evening"],
    reply: "Hey. Ask me about school, where I'm from, what I'm building, or what I do when I'm not building.",
  },
  {
    match: ["how are you", "how's it going", "how is it going", "what's up", "whats up"],
    reply: "Fine. Deep in a semester and a side project. Ask me something.",
  },
  { match: ["thanks", "thank you", "appreciate it"], reply: "Anytime." },
  { match: ["bye", "goodbye", "see you"], reply: "See you. The rest of the site is one keystroke away — press ? for the shortcuts." },

  /* ---------- who I am ---------- */
  {
    match: ["who are you", "who is tenzing", "tell me about yourself", "introduce yourself", "about you", "your bio"],
    reply: "I'm Tenzing Lunn. Sophomore at Fordham Lincoln Center, studying math and computer science. Born and raised in Los Angeles, two years at an international boarding school in Armenia, now in New York.",
  },
  {
    match: ["your name", "what are you called", "how do you say your name"],
    reply: "Tenzing Lunn.",
  },
  {
    match: ["how old", "your age", "what year are you in", "what year of school"],
    reply: "I'm a sophomore. I haven't put a number on the site.",
  },
  {
    match: ["ethnic", "heritage", "your background", "your roots", "nationality", "where is your family from", "mixed"],
    reply: `${origins.slice(0, -1).join(", ")}, and ${origins[origins.length - 1]}. On the About page you can click "ethnically ambiguous" and get them one at a time.`,
  },
  {
    match: ["where are you from", "where you from", "born", "grew up", "hometown", "los angeles", "california"],
    reply: "Born and raised in Los Angeles. I've also spent two years in Armenia and I'm in New York now.",
  },
  {
    match: ["armenia", "boarding school", "international school", "abroad"],
    reply: "I spent two years at an international boarding school in Armenia before New York.",
  },
  {
    match: ["sister", "sibling", "brother", "your family", "your parents"],
    reply: "I have an older sister, and she's great. The rest of my family isn't something I've written about here.",
  },

  /* ---------- school ---------- */
  {
    match: ["fordham", "college", "university", "lincoln center", "campus", "where do you study", "where do you go to school"],
    reply: "Fordham University, the Lincoln Center campus in Manhattan.",
  },
  {
    match: ["major", "what do you study", "what are you studying", "your degree", "computer science", "math and cs"],
    reply: "Math and computer science.",
  },
  {
    match: ["class", "course", "coursework", "professor", "semester", "syllabus"],
    reply: "I haven't put my class list on the site. Math and computer science, sophomore year, is as specific as it gets here.",
  },
  {
    match: ["gpa", "grades", "transcript", "honors"],
    reply: "Not something I've put on the site.",
  },
  {
    match: ["after graduation", "after school", "grad school", "phd", "your career", "what do you want to do", "five years"],
    reply: "I haven't written that down yet. Right now I'd rather build things and find out.",
  },

  /* ---------- what I'm doing ---------- */
  {
    match: ["working on", "what are you building", "what are you making", "current project", "right now", "these days", "at the moment", "are you up to", "keeping busy", "what's new", "whats new"],
    reply: `${site.now.workingOn} The full snapshot is at /now.`,
  },
  {
    match: ["meditation", "meditate", "meditate with me", "meditatewithme"],
    reply: "Meditate With Me: everyone sitting in the same hour finishes on the same bell, at the same second. It's live, and it's the main thing I'm building right now. /projects/meditate-with-me.",
  },
  {
    match: ["project", "what have you built", "what did you build", "your work", "portfolio"],
    reply: "Five are written up at /projects: Meditate With Me, the misalignment research, Nuverum CRM, The Network, and trade-bot. Each one has why I built it and what I learned.",
  },
  {
    match: ["favorite project", "best project", "proudest", "hardest project", "most difficult"],
    reply: "I haven't ranked them. Each project page says what I actually learned from that one, which is closer to the truth than a ranking.",
  },
  {
    match: ["research", "paper", "neurips", "algoverse", "misalign", "ai safety", "alignment"],
    reply: "I spent the summer on emergent misalignment in a medical model, asking whether you can repair it through its memory layer instead of its weights. It went to the GenAI4Health workshop at NeurIPS. Write-up at /projects/correct-the-note.",
  },
  {
    match: ["crm", "nuverum", "deal flow", "real estate"],
    reply: "Nuverum CRM replaced a Google Sheets deal pipeline for a small investment team. The interesting part is role-based access enforced in Postgres rather than in app code. /projects/nuverum-crm.",
  },
  {
    match: ["trading", "trade-bot", "quant", "stock", "backtest", "sharpe", "vix", "hedge fund", "markets"],
    reply: "trade-bot is a walk-forward backtesting harness built to kill bad ideas rather than flatter them. Most strategies I've tested die. I haven't risked a dollar on it. /projects/trade-bot.",
  },
  {
    match: ["the network", "startup", "coo", "product manager", "product lead"],
    reply: "I was COO and product lead at The Network from December 2025 to May 2026. I didn't build the app — I scoped features, audited them, and decided what survived each pivot. /projects/the-network.",
  },
  {
    match: ["learning", "learn", "studying right now"],
    reply: `Learning: ${site.now.learning}`,
  },
  {
    match: ["thinking about", "on your mind", "interested in lately"],
    reply: `Thinking about: ${site.now.thinkingAbout}`,
  },

  /* ---------- interests ---------- */
  {
    match: ["football", "soccer", "sport", "play any sports", "team"],
    reply: "I play football. Or soccer, depending on where you're standing. On the About page you can click the word and watch it change its mind.",
  },
  {
    match: ["draw", "drawing", "art", "sketch", "illustration", "pen and ink"],
    reply: "I draw. There's a pen and ink piece at /art, and more will go up there.",
  },
  {
    match: ["music", "listen to", "band", "favorite artist", "song", "album", "instrument"],
    reply: "I listen to a lot of music. I haven't written down what, which is probably a gap.",
  },
  {
    match: ["read", "reading", "book", "novel", "author"],
    reply: `Right now, ${reading}. Click the word "book" on the About page and it tells you the same thing.`,
  },
  {
    match: ["movie", "film", "watch", "cinema", "director"],
    reply: "I like the occasional movie. My top list isn't written down yet — click \"movie\" on the About page and it'll say the same.",
  },
  {
    match: ["philosophy", "religion", "theology", "biology", "metaphysics", "what interests you", "fascinated"],
    reply: "Philosophy, biology, religion, math, and artificial intelligence. I don't keep the list narrow on purpose.",
  },
  {
    match: ["artificial intelligence", "machine learning", " ai ", "about ai", "llm", "language model", "what do you think about ai"],
    reply: "AI is the thing I find most interesting right now, which is why I spent a summer studying how a model goes wrong rather than how to make one. The research is at /projects/correct-the-note.",
  },
  {
    match: ["travel", "traveling", "countries", "where have you been", "trip"],
    reply: "I travel whenever I can. Los Angeles, Armenia, and New York are the three that shaped anything.",
  },
  {
    match: ["hobby", "hobbies", "free time", "for fun", "outside of work", "outside of school"],
    reply: "Football, drawing, music, the occasional book and movie.",
  },
  {
    match: ["food", "eat", "coffee", "tea", "restaurant"],
    reply: "Not written down. Ask me something I've actually put on the site.",
  },

  /* ---------- reaching me ---------- */
  {
    match: ["contact", "email", "reach you", "get in touch", "hire", "hiring", "work with you", "collaborate", "freelance", "available"],
    reply: `Email is best: ${email}. I'm also on GitHub and LinkedIn, both linked at the bottom of the About page.`,
  },
  { match: ["github", "your code", "repos", "source code", "open source"], reply: `GitHub: ${link("GitHub")}` },
  { match: ["linkedin", "resume", " cv "], reply: `LinkedIn: ${link("LinkedIn")}. There's no resume on the site.` },
  {
    match: ["where do you live", "where are you based", "your location", "new york", "nyc", "manhattan", "where are you now"],
    reply: `${site.now.location}.`,
  },
  {
    match: ["phone", "your address", "password", "social security", "personal information"],
    reply: "Not here. Email's on the About page if you need me.",
  },

  /* ---------- writing ---------- */
  {
    match: ["thought", "writing", "blog", "essay", "post", "do you write", "articles"],
    reply: "Thoughts is at /thoughts. Nothing published there yet — I'd rather leave it empty than fill it with warm-up material.",
  },

  /* ---------- this site ---------- */
  {
    match: ["this site", "this website", "why did you make this", "what is this", "purpose of this"],
    reply: "A place to keep what I'm doing in one room instead of scattered across other people's platforms. About, projects, thoughts, art, and a current snapshot.",
  },
  {
    match: ["shortcut", "keyboard", "hotkey", "command palette", "cmd k", "navigate"],
    reply: "Press A, P, or T for About, Projects, Thoughts. Slash for Ask, ⌘K for the command palette, ? for the full list.",
  },
  {
    match: ["terminal", "command line", "shell", "type help", "prompt at the bottom"],
    reply: "The prompt at the bottom takes help, home, about, projects, thoughts, ask, now, art, and clear. It's navigation wearing a costume.",
  },
  {
    match: ["dark", "light mode", "theme", "why is it black", "why is it white", "why is the site", "why is the page", "why is it light", "why is it dark", "background color", "sun", "moon", "colors", "color scheme"],
    reply: "The page follows your clock: light from 7 to 18, dark otherwise. The pixel sun in the footer turns into a moon at the same time.",
  },
  {
    match: ["built this site", "build this site", "make this site", "made this site", "how did you make this", "tech stack", "built with", "what is this built with", "next.js", "tailwind", "vercel", "framework"],
    reply: "Next.js, TypeScript, and Tailwind, deployed on Vercel. No database, no analytics, no cookie banner.",
  },

  /* ---------- meta ---------- */
  {
    match: ["bot", "are you ai", "are you real", "is this ai", "chatgpt", "am i talking to", "are you human", "a robot", "real person", "is this an ai"],
    reply: "I'm a small script answering with Tenzing's words. No model behind me, so I only know what he's written down.",
  },
  {
    match: ["what can you answer", "what can i ask", "what do you know", "help me", "topics"],
    reply: "School, where I'm from, projects, research, trading, drawing, football, what I'm reading, how to reach me, and how this site works. Try one.",
  },
  {
    match: ["joke", "funny", "make me laugh"],
    reply: "I don't have one written down. The command palette is fun for about ten seconds though.",
  },
  {
    match: ["meaning of life", "advice", "what should i do with my life"],
    reply: "Above my pay grade. I'm reading Siddhartha, so ask me again in a few weeks.",
  },
];

export const fallback =
  "I don't have that written down. Try asking about school, where I'm from, projects, drawing, football, what I'm reading, or how to reach me.";
