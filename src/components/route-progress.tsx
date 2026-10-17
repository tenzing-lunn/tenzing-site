"use client";

import { useEffect, useState } from "react";
import { useLinkStatus } from "next/link";

const EVENT = "route:pending";

/**
 * Put inside a <Link>: while that link's navigation is pending it tells the
 * masthead, which runs its 1px progress line. There are no router events in
 * the App Router, so each link reports for itself (useLinkStatus).
 */
export function LinkPending() {
  const { pending } = useLinkStatus();
  useEffect(() => {
    window.dispatchEvent(new CustomEvent<boolean>(EVENT, { detail: pending }));
  }, [pending]);
  return null;
}

/** The 1px ink line under the masthead, running while any route loads. */
export function RouteProgress() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onPending = (e: Event) => setOn((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, onPending);
    return () => window.removeEventListener(EVENT, onPending);
  }, []);

  return <span className={`route-line ${on ? "on" : ""}`} aria-hidden="true" />;
}
