"use client";

import { useEffect, useState } from "react";
import type { Listening as Data } from "@/lib/spotify";

/**
 * "listening to <track>, <artist>" at the top of the page, or "last played"
 * when nothing is on. Polls once a minute. Renders an empty line of the same
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
    <p className="truncate font-mono text-[11px] leading-5 text-fg-3" aria-live="polite">
      {data ? (
        <>
          {data.playing ? (
            <span className="listening-dot mr-2 inline-block size-1.5 rounded-full bg-fg-2 align-middle" aria-hidden="true" />
          ) : null}
          {data.playing ? "listening to " : "last played "}
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-fg-2 hover:text-fg transition-colors"
          >
            {data.title}
          </a>
          {`, ${data.artist}`}
        </>
      ) : (
        " "
      )}
    </p>
  );
}
