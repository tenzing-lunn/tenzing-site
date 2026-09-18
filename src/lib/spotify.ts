/**
 * What I'm listening to, from the Spotify Web API.
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
};

export type Listening = Track & {
  /** True when something is playing right now; false means last played. */
  playing: boolean;
};

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
};

/** The track playing right now, or the last one played if nothing is. */
export async function listening(revalidate = 30): Promise<Listening | null> {
  const token = await accessToken();
  if (!token) return null;

  try {
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { authorization: `Bearer ${token}` },
      next: { revalidate },
    });
    // 204 means nothing is playing.
    if (res.status === 200) {
      const data = (await res.json()) as { is_playing?: boolean; item?: SpotifyTrack | null };
      if (data.is_playing && data.item?.name) return { ...toTrack(data.item), playing: true };
    } else if (res.status !== 204) {
      throw new Error(`currently-playing ${res.status}`);
    }
  } catch (err) {
    console.error("[spotify]", err);
  }

  const last = await lastPlayed(revalidate, token);
  return last ? { ...last, playing: false } : null;
}

/** The most recently finished track. */
export async function lastPlayed(revalidate = 300, token?: string | null): Promise<Track | null> {
  token ??= await accessToken();
  if (!token) return null;

  try {
    const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: { authorization: `Bearer ${token}` },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`recently-played ${res.status}`);
    const data = (await res.json()) as { items?: { track: SpotifyTrack }[] };
    const item = data.items?.[0];
    return item ? toTrack(item.track) : null;
  } catch (err) {
    console.error("[spotify]", err);
    return null;
  }
}

function toTrack(t: SpotifyTrack): Track {
  return {
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    url: t.external_urls.spotify,
  };
}

/** Access tokens last an hour; caching for five minutes keeps well inside that. */
async function accessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) return null;

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch (err) {
    console.error("[spotify]", err);
    return null;
  }
}
