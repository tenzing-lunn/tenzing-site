/**
 * One-time: turn a Spotify authorization into a long-lived refresh token.
 *
 *   node scripts/spotify-auth.mjs
 *
 * Reads SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET from .env.local, prints a
 * URL to open, and waits. If port 3000 is free it catches the redirect itself;
 * if something else is using it, paste the redirected URL back instead.
 * Prints the refresh token. Nothing is written to disk.
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { randomUUID } from "node:crypto";

const REDIRECT_URI = "http://127.0.0.1:3000/callback";
const SCOPES = "user-read-recently-played user-read-currently-playing";

const env = readEnv(".env.local");
const id = process.env.SPOTIFY_CLIENT_ID ?? env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET ?? env.SPOTIFY_CLIENT_SECRET;

if (!id || !secret || secret.startsWith("paste-")) {
  console.error("Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const state = randomUUID();
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: id,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
  });

console.log("\nOpen this URL and approve:\n\n" + authUrl + "\n");

const code = (await catchRedirect()) ?? (await askForUrl());
const tokens = await exchange(code);

console.log("\nSPOTIFY_REFRESH_TOKEN=" + tokens.refresh_token + "\n");
console.log("Scopes granted:", tokens.scope);
process.exit(0);

/* ---------- steps ---------- */

/** Resolves with the code, or null if port 3000 is taken. */
function catchRedirect() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      if (url.pathname !== "/callback") return res.end();
      const returned = url.searchParams.get("state");
      const code = url.searchParams.get("code");
      res.writeHead(200, { "content-type": "text/plain" });
      res.end(code && returned === state ? "Done. Back to the terminal." : "Something went wrong.");
      server.close();
      if (returned !== state) {
        console.error("State mismatch — start again.");
        process.exit(1);
      }
      resolve(code);
    });
    server.on("error", () => resolve(null));
    server.listen(3000, "127.0.0.1", () => console.log("Waiting on " + REDIRECT_URI + " ..."));
  });
}

async function askForUrl() {
  console.log("Port 3000 is busy, so nothing is listening for the redirect.");
  console.log("Approve anyway, then copy the whole 127.0.0.1 URL from the address bar.\n");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("Paste the redirected URL: ");
  rl.close();
  const url = new URL(answer.trim());
  if (url.searchParams.get("state") !== state) {
    console.error("State mismatch — start again.");
    process.exit(1);
  }
  const code = url.searchParams.get("code");
  if (!code) {
    console.error("No code in that URL.");
    process.exit(1);
  }
  return code;
}

async function exchange(code) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
  });
  if (!res.ok) {
    console.error("Token exchange failed:", res.status, await res.text());
    process.exit(1);
  }
  return res.json();
}

function readEnv(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf8")
        .split("\n")
        .filter((l) => l.trim() && !l.trim().startsWith("#"))
        .map((l) => {
          const i = l.indexOf("=");
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
        }),
    );
  } catch {
    return {};
  }
}
