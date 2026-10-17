import type { Draft } from "@/features/draft/types";

const USER = "tenzing-lunn";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const REPO = /^[\w.-]+\/[\w.-]+$/;

export const revalidate = 3600;

type GhEvent = {
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: { size?: number; distinct_size?: number; commits?: unknown[] };
};

/**
 * The working draft: public GitHub pushes from the last seven days, counted.
 * No token, so only public repos are ever seen, and only counts and repo
 * names leave this handler. Regenerated at most once an hour. A timeout, a
 * rate limit or a bad payload all become { none: true } with a 200, so the
 * home page shows nothing and the browser logs nothing.
 */
export async function GET() {
  return Response.json(await draft());
}

async function draft(): Promise<Draft> {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
      headers: { accept: "application/vnd.github+json", "user-agent": "lunnXiv" },
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { none: true };
    const events: unknown = await res.json();
    if (!Array.isArray(events)) return { none: true };

    const since = Date.now() - WEEK_MS;
    let pushes = 0;
    let commits = 0;
    const repos: string[] = [];
    for (const e of events as GhEvent[]) {
      if (e?.type !== "PushEvent") continue;
      const at = Date.parse(e.created_at ?? "");
      const name = e.repo?.name ?? "";
      if (!(at >= since) || !REPO.test(name)) continue;
      pushes++;
      const p = e.payload ?? {};
      commits += p.distinct_size ?? p.size ?? p.commits?.length ?? 0;
      if (!repos.includes(name)) repos.push(name);
    }
    return pushes > 0 ? { pushes, commits, repos } : { none: true };
  } catch {
    return { none: true };
  }
}
