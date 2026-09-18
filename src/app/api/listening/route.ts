import { NextResponse } from "next/server";
import { listening } from "@/lib/spotify";

/** Shared by every visitor; Spotify is asked at most twice a minute. */
export const revalidate = 30;

export async function GET() {
  return NextResponse.json(await listening(30));
}
