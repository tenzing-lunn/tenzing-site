/**
 * The offline fallback for /ask, used when there is no ANTHROPIC_API_KEY or
 * the model call fails. Each entry is a set of lowercase fragments and the
 * reply to give when one of them appears in a question; the longest matching
 * fragment wins.
 *
 * Same voice as src/content/persona.ts: about Tenzing, third person,
 * professional with a little personality. Only what is true — where he
 * hasn't said, the honest reply is that it isn't written down.
 */

import { site } from "@/content/site";
import { ethnicities, movies, reading } from "@/content/about";

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
    reply: "Hello. Ask about his studies, where he grew up, what he is building, or what he does when he isn't building.",
  },
  {
    match: ["how are you", "how's it going", "how is it going", "what's up", "whats up"],
    reply: "Well enough. He is mid-semester and mid-project, which is his preferred state. Ask away.",
  },
  { match: ["thanks", "thank you", "appreciate it"], reply: "Of course." },
  { match: ["bye", "goodbye", "see you"], reply: "Goodbye. The rest of the site is a keystroke away — press ? for the shortcuts." },

  /* ---------- who he is ---------- */
  {
    match: ["who are you", "who is tenzing", "tell me about tenzing", "tell me about him", "tell me about yourself", "introduce", "his bio", "describe him"],
    reply: "Tenzing Lunn is a sophomore at Fordham Lincoln Center reading mathematics and computer science. He grew up in Los Angeles, finished high school at a United World College in Armenia, and is now in New York.",
  },
  { match: ["his name", "what is he called", "how do you say his name"], reply: "Tenzing Lunn." },
  {
    match: ["how old", "his age", "what year is he in", "what year of school"],
    reply: "He is a sophomore. He has not put a number on the site.",
  },
  {
    match: ["ethnic", "heritage", "his background", "his roots", "nationality", "where is his family from", "mixed"],
    reply: `${origins.slice(0, -1).join(", ")} and ${origins[origins.length - 1]}. On the About page you can click "ethnically ambiguous" and they arrive one at a time.`,
  },
  {
    match: ["where is he from", "where he from", "born", "grew up", "hometown", "los angeles", "california", "windsor hills"],
    reply: "He grew up in Windsor Hills, Los Angeles, and lived there until junior year of high school. He misses the weather. On the usual assumption about Los Angeles and celebrities: interesting things do happen there, but the celebrities largely keep to themselves.",
  },
  {
    match: ["armenia", "boarding school", "international school", "uwc", "united world college", "dilijan", "high school"],
    reply: "He finished high school at UWC Dilijan in Armenia, a United World College — two years of the International Baccalaureate on a campus in a national park, with around 220 students from some eighty countries. It gave him friends from everywhere and a travelling habit he has not lost.",
  },
  {
    match: ["sister", "sibling", "brother", "his family", "his parents"],
    reply: "He has an older sister who recently graduated from Barnard and wants to teach. They lived in New York together for a year, and he calls her the sweetest person he knows. He keeps the rest of his family out of it.",
  },
  {
    match: ["girlfriend", "relationship", "dating", "married", "partner", "love life", "single"],
    reply: "There has been a special woman in his life. He keeps the rest private, and his attention these days is on his work.",
  },
  {
    match: ["travel", "travelling", "traveling", "countries", "where has he been", "trip", "abroad"],
    reply: "Poland, Croatia, France, a good deal of Italy including Sardinia and Milan, the United Kingdom, Belgrade and Morocco. Most of his school friends are international, so visiting them is half the reason he goes.",
  },

  /* ---------- school ---------- */
  {
    match: ["fordham", "college", "university", "lincoln center", "campus", "where does he study", "where does he go to school"],
    reply: "Fordham University, the Lincoln Center campus in Manhattan.",
  },
  {
    match: ["major", "what does he study", "what is he studying", "his degree", "computer science", "math and cs"],
    reply: "Mathematics and computer science.",
  },
  {
    match: ["class", "course", "coursework", "professor", "semester", "syllabus"],
    reply: "His class list isn't on the site. Mathematics and computer science, sophomore year, is as specific as it gets here.",
  },
  { match: ["gpa", "grades", "transcript", "honors"], reply: "Not something he has put on the site." },
  {
    match: ["after graduation", "after school", "grad school", "phd", "his career", "what does he want to do", "five years"],
    reply: "Mathematics and computer science is the direction he has committed to. Biology, philosophy and religion are interests he keeps alive rather than career plans. He likes maths and is good at it, though he will tell you he is not certain it is the thing forever.",
  },

  /* ---------- work ---------- */
  {
    match: ["working on", "what is he building", "what is he making", "current project", "right now", "these days", "at the moment", "is he up to", "what's new", "whats new"],
    reply: `${site.now.workingOn} The full snapshot is at /now.`,
  },
  {
    match: ["meditation", "meditate", "meditate with me", "meditatewithme"],
    reply: "Meditate With Me: everyone sitting in the same hour finishes on the same bell, at the same second. It is live, and it is the main thing he is building. The write-up is at /projects/meditate-with-me.",
  },
  {
    match: ["project", "what has he built", "what did he build", "his work", "portfolio"],
    reply: "Five are written up at /projects: Meditate With Me, the misalignment research, Nuverum CRM, The Network, and trade-bot. Each has why he built it and what he took from it.",
  },
  {
    match: ["favourite project", "favorite project", "best project", "proudest", "hardest project", "most difficult"],
    reply: "He has not ranked them. Each project page says what he actually learned from that one, which is a more honest answer than a ranking.",
  },
  {
    match: ["research", "paper", "neurips", "algoverse", "misalign", "ai safety", "alignment"],
    reply: "He spent the summer of 2026 on emergent misalignment in a medical model, asking whether it can be repaired through its memory layer rather than its weights. The idea came from the overlap between his interest in mathematics and in medicine. It went to the GenAI4Health workshop at NeurIPS. /projects/correct-the-note.",
  },
  {
    match: ["crm", "nuverum", "deal flow", "real estate"],
    reply: "Nuverum CRM replaced a Google Sheets deal pipeline for a small investment team. The interesting part is role-based access enforced in Postgres rather than in application code. /projects/nuverum-crm.",
  },
  {
    match: ["trading", "trade-bot", "quant", "stock", "backtest", "sharpe", "vix", "hedge fund", "markets"],
    reply: "trade-bot is a walk-forward backtesting harness built to kill bad ideas rather than flatter them. Most strategies he has tested have died, and he has not risked a dollar on it. /projects/trade-bot.",
  },
  {
    match: ["the network", "startup", "coo", "product manager", "product lead"],
    reply: "He was COO and product lead at The Network from December 2025 to May 2026. He did not build the app — he scoped features, audited them, and decided what survived each pivot. /projects/the-network.",
  },
  { match: ["learning", "learn", "studying right now"], reply: `Learning: ${site.now.learning}` },
  { match: ["thinking about", "on his mind", "interested in lately"], reply: `Thinking about: ${site.now.thinkingAbout}` },

  /* ---------- interests ---------- */
  {
    match: ["football", "soccer", "sport", "does he play any sports", "team", "position"],
    reply: "Centre attacking midfield, or left or right back. He played on his high school team in Los Angeles and again in Armenia, and still plays for fun at Pier 40 in the city. He calls it an escape.",
  },
  {
    match: ["draw", "drawing", "art", "sketch", "illustration", "pen and ink", "medium"],
    reply: "Mostly pen, occasionally oil pastels or paint. The dense cross-hatched style was never studied — it arrived on its own, and he finds it satisfying. There is a piece at /art.",
  },
  {
    match: ["music", "listen to", "band", "favourite artist", "favorite artist", "song", "album", "instrument", "piano", "drums"],
    reply: "The Strokes, Radiohead, ASAP Rocky, Steve Lacy, The Alchemist, Samba Jean Baptiste, LCD Soundsystem, Sade, The Smiths and Jeff Buckley, among others, plus a lot of UK garage, techno and house. He used to play piano and now plays hand drums, the djembe in particular.",
  },
  {
    match: ["read", "reading", "book", "novel", "author"],
    reply: `He is not a big reader, but he is reading ${reading} now, recommended by a friend in London and that friend's mother, who is an author. He is happy to talk about it.`,
  },
  {
    match: ["movie", "film", "watch", "cinema", "director"],
    reply: `In no particular order: ${movies.slice(0, 6).join(", ")}, and more besides. Click "movie" on the About page for the full list.`,
  },
  {
    match: ["philosophy", "religion", "theology", "biology", "metaphysics", "what interests him", "fascinated", "believe", "god", "buddhism", "meditation practice"],
    reply: "He reads Chalmers, Nietzsche and Thich Nhat Hanh, is drawn to Buddhism, and meditates seriously. He does not believe in anything in the religious sense, but he holds that the search for good in other people and in oneself is a belief system in its own right.",
  },
  {
    match: ["artificial intelligence", "machine learning", " ai ", "about ai", "llm", "language model", "what does he think about ai"],
    reply: "He enjoys learning about AI and machine learning but finds the models themselves a little boring. The interesting and underrated work, in his view, is designing the frameworks that test them. Emergent misalignment he finds genuinely alarming, which is why he spent a summer on it.",
  },
  {
    match: ["hobby", "hobbies", "free time", "for fun", "outside of work", "outside of school", "fashion", "clothes", "thrift"],
    reply: "Football, drawing, music, the occasional book and film. In the city he spends time in Brooklyn, goes thrifting, and attends New York Fashion Week events. He cares about clothes.",
  },
  {
    match: ["food", "eat", "coffee", "tea", "restaurant", "cook"],
    reply: "Black coffee, iced. He cooks his own meals, is not yet good at it, and is enjoying learning.",
  },
  {
    match: ["friend", "tristan", "who influenced", "influence", "mentor"],
    reply: "Tristan de Halleux is a close friend and a real influence on him; they worked on The Network together. Most of his other close friends are scattered across the world, which is half the reason he travels.",
  },

  /* ---------- reaching him ---------- */
  {
    match: ["contact", "email", "reach him", "get in touch", "hire", "hiring", "work with him", "collaborate", "freelance", "available"],
    reply: `Email is best: ${email}. He is also on GitHub and LinkedIn, both linked at the bottom of the About page.`,
  },
  { match: ["github", "his code", "repos", "source code", "open source"], reply: `GitHub: ${link("GitHub")}` },
  { match: ["linkedin", "resume", " cv "], reply: `LinkedIn: ${link("LinkedIn")}. There is no resume on the site.` },
  {
    match: ["where does he live", "where is he based", "his location", "new york", "nyc", "manhattan", "where is he now"],
    reply: `${site.now.location}.`,
  },
  {
    match: ["phone", "his address", "password", "social security", "personal information"],
    reply: "Not here. His email is on the About page if you need him.",
  },

  /* ---------- writing ---------- */
  {
    match: ["thought", "writing", "blog", "essay", "post", "does he write", "articles"],
    reply: "Thoughts is at /thoughts. Nothing published there yet — he would rather leave it empty than fill it with warm-up material.",
  },

  /* ---------- this site ---------- */
  {
    match: ["this site", "this website", "why did he make this", "what is this", "purpose of this"],
    reply: "A single place to keep what he is doing, rather than scattering it across other people's platforms. About, projects, thoughts, art, and a current snapshot.",
  },
  {
    match: ["shortcut", "keyboard", "hotkey", "command palette", "cmd k", "navigate"],
    reply: "A, P and T for About, Projects and Thoughts. Slash for Ask, Cmd-K for the command palette, and ? for the full list.",
  },
  {
    match: ["terminal", "command line", "shell", "type help", "prompt at the bottom"],
    reply: "The prompt at the bottom takes help, home, about, projects, thoughts, ask, now, art and clear. It is navigation wearing a costume.",
  },
  {
    match: ["dark", "light mode", "theme", "why is it black", "why is it white", "why is the site", "why is the page", "why is it light", "why is it dark", "background color", "sun", "moon", "colors", "color scheme"],
    reply: "The page follows your clock: light from seven to eighteen, dark otherwise. The pixel sun in the footer becomes a moon at the same moment.",
  },
  {
    match: ["built this site", "build this site", "make this site", "made this site", "how did he make this", "tech stack", "built with", "next.js", "tailwind", "vercel", "framework"],
    reply: "Next.js, TypeScript and Tailwind, deployed on Vercel. No database, no analytics, no cookie banner.",
  },

  /* ---------- meta ---------- */
  {
    match: ["bot", "are you ai", "are you real", "is this ai", "chatgpt", "am i talking to", "are you human", "a robot", "real person", "is this an ai"],
    reply: "I am the assistant on Tenzing's site, not Tenzing himself. At the moment I am running on a simple keyword lookup, so I only know what he has written down.",
  },
  {
    match: ["what can you answer", "what can i ask", "what do you know", "help me", "topics"],
    reply: "His studies, where he grew up, Armenia, his projects and research, football, drawing, music, film, what he is reading, how to reach him, and how this site works. Try one.",
  },
  {
    match: ["joke", "funny", "make me laugh"],
    reply: "Not in my remit, I'm afraid. The command palette is diverting for about ten seconds.",
  },
  {
    match: ["meaning of life", "advice", "what should i do with my life"],
    reply: "Above my pay grade. He would probably say the search for good in other people, and in yourself, is a reasonable place to start.",
  },
];

export const fallback =
  "That isn't written down. Try asking about his studies, where he grew up, his projects, drawing, football, music, what he is reading, or how to reach him.";
