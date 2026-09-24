"use client";

import { useEffect, useState } from "react";

const format = (o: Intl.DateTimeFormatOptions) => new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", ...o });

/** The time in New York, where I am. `seconds` makes it tick. */
export function Clock({ seconds = false }: { seconds?: boolean }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(format(seconds ? { hour: "2-digit", minute: "2-digit", second: "2-digit" } : { hour: "numeric", minute: "2-digit" }));
    const first = window.setTimeout(tick);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [seconds]);
  return <time suppressHydrationWarning>{time || " "}</time>;
}
