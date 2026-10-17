"use client";

import { useId, useState } from "react";

/**
 * An abstract that shows its lead and folds the rest behind ▽ More, opening
 * in place (height only, 200ms). The folded text stays in the page for print.
 */
export function AbstractFold({ lead, rest }: { lead: string; rest: string }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const toggle = (
    <button type="button" className="more" aria-expanded={open} aria-controls={panel} onClick={() => setOpen((o) => !o)}>
      {open ? "△ Less" : "▽ More"}
    </button>
  );
  return (
    <>
      <p className="abstract">
        <b className="sc">Abstract:</b>
        {lead}
        {open ? null : <> {toggle}</>}
      </p>
      <div id={panel} className={`fullabs abstract-rest ${open ? "open" : ""}`} data-detail inert={!open}>
        <div>
          <p>
            {rest} {open ? toggle : null}
          </p>
        </div>
      </div>
    </>
  );
}
