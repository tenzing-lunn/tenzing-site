"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { displayId, getRecord, isRoutable } from "@/content/records";
import { Badge } from "@/components/badge";

/**
 * An inline citation marker, `[3]`, that opens a 320px card on hover or focus:
 * the ID, the status badge, the title and its one-line TL;DR. The marker links
 * to the record's abs page. An ID that isn't in the archive renders as plain
 * text, so nothing ever cites a record that doesn't exist.
 *
 *   <HoverCite id="2605.00003" n={3} />
 */
export function HoverCite({ id, n }: { id: string; n?: number }) {
  const r = getRecord(id);
  const card = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);

  if (!r) return <>[{id}]</>;

  const show = () => {
    // keep the card on screen: pull it left if it would run off the right edge
    const box = ref.current?.getBoundingClientRect();
    if (box) setShift(Math.min(0, window.innerWidth - 16 - (box.left + Math.min(320, window.innerWidth - 32))));
    setOpen(true);
  };
  const hide = () => setOpen(false);
  const label = `[${n ?? id}]`;
  const marker = { className: "cite", "aria-describedby": card, onFocus: show, onBlur: hide };

  return (
    <span ref={ref} className="cite-wrap" onMouseEnter={show} onMouseLeave={hide} onKeyDown={(e) => e.key === "Escape" && hide()}>
      {isRoutable(r) ? (
        <Link href={r.href} {...marker}>
          {label}
        </Link>
      ) : (
        <span tabIndex={0} {...marker}>
          {label}
        </span>
      )}
      <span id={card} role="tooltip" className={`card ${open ? "on" : ""}`} style={shift ? { left: shift } : undefined}>
        <span className="top">
          <span className="mono">{displayId(r.id)}</span>
          <Badge status={r.status} />
        </span>
        <span className="t">{r.title}</span>
        {r.tldr}
      </span>
    </span>
  );
}
