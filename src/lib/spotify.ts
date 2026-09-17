/**
 * Last track played, from the Spotify Web API.
 *
 * Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN.
 * The refresh token is minted once by scripts/spotify-auth.mjs and does not
 * expire; it is traded for a short-lived access token on each fetch.
 *
 * Every failure returns null, and the caller renders nothing. A personal
 * site should not break because a music API had a bad minute.
 */

export type Track = {
  title: string;
  artist: string;
  url: string;
  /** ISO timestamp of when it finished playing. */
  playedAt: string;
};

/** Seconds before the track is fetched again. */
const REVALIDATE = 300;

export async function lastPlayed(): Promise<Track | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) return null;

  try {
    const token = await accessToken(id, secret, refreshToken);
    const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: { authorization: `Bearer ${token}` },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`recently-played ${res.status}`);

    const data = (await res.json()) as {
      items?: {
        played_at: string;
        track: {
          name: string;
          artists: { name: string }[];
          external_urls: { spotify: string };
        };
      }[];
    };

    const item = data.items?.[0];
    if (!item) return null;
    return {
      title: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(", "),
      url: item.track.external_urls.spotify,
      playedAt: item.played_at,
    };
  } catch (err) {
    console.error("[spotify]", err);
    return null;
  }
}

async function accessToken(id: string, secret: string, refreshToken: string): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("no access token");
  return data.access_token;
}
