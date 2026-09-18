"use client";

import { useEffect, useState } from "react";
import type { Listening as Data } from "@/lib/spotify";

/**
 * "currently playing <track> by <artist>" at the top of the page, behind a
 * small bouncing equalizer, or "last played" with the bars at rest. Polls once a minute. Renders an empty line of the same
 * height until it knows, so nothing below it jumps.
 */
export function Listening() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/listening")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: Data | null) => alive && setData(d))
        .catch(() => {});
    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  return (
    <p className="flex items-center gap-2 font-mono text-[11px] leading-5 text-fg-3" aria-live="polite">
      {data ? (
        <>
          <Beats playing={data.playing} />
          <span className="truncate">
            {data.playing ? "currently playing " : "last played "}
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-2 hover:text-fg transition-colors"
            >
              {data.title}
            </a>
            {` by ${data.artist}`}
          </span>
        </>
      ) : (
        "\u00a0"
      )}
    </p>
  );
}

/** Four pixel bars. They bounce while a track plays and rest when it doesn't. */
function Beats({ playing }: { playing: boolean }) {
  return (
    <span
      className={`beats inline-flex h-2.5 shrink-0 items-end gap-px ${playing ? "is-playing" : ""}`}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
