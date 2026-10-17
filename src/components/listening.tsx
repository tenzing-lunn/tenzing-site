"use client";

import { useEffect, useState } from "react";
import type { Listening as Data } from "@/lib/spotify";
import { SideBlock } from "@/components/side-block";

/** What Spotify reports, polled once a minute: undefined while loading, null for nothing. */
function useListening() {
  const [data, setData] = useState<Data | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/listening")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: Data | null) => alive && setData(d))
        .catch(() => alive && setData(null));
    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  return data;
}

/**
 * "currently playing <track> by <artist>" behind a small bouncing equalizer,
 * or "last played" with the bars at rest. Says so quietly if Spotify has
 * nothing to report.
 */
export function Listening() {
  return <ListeningLine data={useListening()} />;
}

/** The home sidebar's "Live data" block. Shown only once Spotify has something to report. */
export function LiveData() {
  const data = useListening();
  if (!data) return null;
  return (
    <SideBlock title="Live data">
      <div className="live">
        <ListeningLine data={data} />
      </div>
    </SideBlock>
  );
}

function ListeningLine({ data }: { data: Data | null | undefined }) {
  return (
    <span className="flex min-w-0 items-center gap-2" aria-live="polite">
      {data ? (
        <>
          <Beats playing={data.playing} />
          <span className="truncate">
            {data.playing ? "currently playing " : "last played "}
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-fg-3 underline-offset-3 hover:decoration-fg"
            >
              {data.title}
            </a>
            {` by ${data.artist}`}
          </span>
        </>
      ) : data === null ? (
        <span className="text-fg-3">nothing on at the moment</span>
      ) : (
        "\u00a0"
      )}
    </span>
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
