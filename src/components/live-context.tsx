"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * "[LOCATION] · [TIME]" — the visitor's timezone city and local time,
 * updated every 15 seconds. Falls back to the configured default location.
 * Rendered only after mount to avoid a server/client mismatch.
 */
export function LiveContext() {
  const [state, setState] = useState<{ place: string; time: string } | null>(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const place = cityFromTimezone(tz) ?? site.location.short;
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setState({ place, time: fmt.format(new Date()) });
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className="font-mono text-[11px] text-fg-3 tabular-nums"
      aria-label={state ? `${state.place}, local time ${state.time}` : undefined}
      suppressHydrationWarning
    >
      {state ? `${state.place} · ${state.time}` : " "}
    </span>
  );
}

function cityFromTimezone(tz: string | undefined): string | null {
  if (!tz || !tz.includes("/")) return null;
  const city = tz.split("/").pop()!.replace(/_/g, " ");
  return city === "New York" ? "NYC" : city;
}
