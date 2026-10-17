"use client";

import { Fragment, useId, useState } from "react";
import Link from "next/link";
import { displayId, isRoutable, serialOf, subjectLabel, type ArchiveRecord } from "@/content/records";
import { Badge } from "@/components/badge";
import { LinkPending } from "@/components/route-progress";

/** Underlines each case-insensitive match of `q` in ink, as search hits. */
function highlight(text: string, q?: string) {
  const needle = q?.trim();
  if (!needle) return text;
  const parts = text.split(new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) => (i % 2 ? <span key={i} className="hit">{p}</span> : <Fragment key={i}>{p}</Fragment>));
}

/**
 * One listing entry, as on an arXiv listing page:
 *
 *   [3]  TL:2605.00003  [html, code]  UNDER REVIEW
 *        Title
 *        Authors / Comments / Subjects
 *        TL;DR: one line.  ▽ More
 *
 * Cross-lists show their ID unlinked and point at the résumé. The entry is
 * focusable so j / k can move through a listing.
 */
export function Entry({ record: r, n, query }: { record: ArchiveRecord; n?: number; query?: string }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const routable = isRoutable(r);
  const crosslist = r.kind === "crosslist" ? r.subjects[0]?.code : undefined;
  const more = r.abstract && r.abstract !== r.tldr;

  return (
    <li className="entry" data-entry tabIndex={-1} id={`entry-${r.id}`}>
      <span className="n">[{n ?? serialOf(r.id)}]</span>
      <div className="min-w-0">
        <div className="idline">
          {routable ? (
            <Link className="id" href={r.href}>
              {displayId(r.id)}
              <LinkPending />
            </Link>
          ) : (
            <span className="id">{displayId(r.id)}</span>
          )}
          <span className="fmt">
            [
            {r.formats.map((f, i) => (
              <Fragment key={f.label}>
                {i ? ", " : null}
                {f.href.startsWith("/") ? (
                  <Link href={f.href}>{f.label}</Link>
                ) : (
                  <a href={f.href} target="_blank" rel="noreferrer noopener">
                    {f.label}
                  </a>
                )}
              </Fragment>
            ))}
            ]
          </span>
          {crosslist ? <em className="xl">(cross-list from {crosslist})</em> : null}
          <Badge status={r.status} />
        </div>
        <h3>
          {routable ? (
            <Link href={r.href}>
              {highlight(r.title, query)}
              <LinkPending />
            </Link>
          ) : (
            highlight(r.title, query)
          )}
        </h3>
        <p className="ln">
          <span className="k">Authors</span>
          {r.authorsLine}
        </p>
        {r.comments ? (
          <p className="ln" data-detail>
            <span className="k">Comments</span>
            {r.comments}
          </p>
        ) : null}
        <p className="ln" data-detail>
          <span className="k">Subjects</span>
          {r.subjects.map((s, i) => (
            <Fragment key={s.code}>
              {i ? "; " : null}
              {i ? subjectLabel(s) : <b>{subjectLabel(s)}</b>}
            </Fragment>
          ))}
        </p>
        <p className="tldr" data-summary>
          <span className="k">TL;DR</span>
          {highlight(r.tldr, query)}
          {more ? (
            <button type="button" className="more" aria-expanded={open} aria-controls={panel} onClick={() => setOpen((o) => !o)}>
              {open ? "△ Less" : "▽ More"}
            </button>
          ) : null}
        </p>
        {more ? (
          <div id={panel} className={`fullabs ${open ? "open" : ""}`} data-detail inert={!open}>
            <div>
              <p>{highlight(r.abstract!, query)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
}
