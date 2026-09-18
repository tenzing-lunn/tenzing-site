import { NextResponse } from "next/server";
import { listening } from "@/lib/spotify";

/**
 * Fetched fresh from Spotify, then held by Vercel's CDN for 20 seconds and
 * shared by every visitor, so Spotify is asked a few times a minute at most.
 * One cache layer, so the line is never more than about half a minute behind.
 */
export async function GET() {
  return NextResponse.json(await listening(), {
    headers: { "cache-control": "public, s-maxage=20, stale-while-revalidate=10" },
  });
}
