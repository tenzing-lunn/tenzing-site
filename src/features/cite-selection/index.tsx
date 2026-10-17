"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { displayId, getRecord, isRoutable, person } from "@/content/records";
import { useShortcut } from "@/lib/shortcuts";
import "./cite-selection.css";

/** The page text is this revision's, so quotes carry the person record's year. */
const YEAR = Number(person.revised.slice(0, 4));
/** Text-fragment budget: one block gets ~120 chars, a start,end pair ~60 each. */
const FRAGMENT = 120;

type Picked = { lines: string[]; quote: string; x: number; y: number };
type State = "idle" | "copied" | "failed";

/**
 * The selection inside <main> as cleaned-up lines (one per block it spans) and
 * where its end sits on the page. Null when collapsed, empty, or in a field,
 * a dialog or anything outside the page's prose.
 */
function readSelection(): Picked | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const main = document.getElementById("main");
  const node = range.commonAncestorContainer;
  const el = node instanceof Element ? node : node.parentElement;
  if (!main || !el || !main.contains(el)) return null;
  if (el.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], dialog, [role='dialog']")) return null;

  const lines = sel
    .toString()
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const rects = range.getClientRects();
  const end = rects[rects.length - 1] ?? range.getBoundingClientRect();
  const width = document.documentElement.clientWidth;
  return {
    lines,
    quote: lines.join(" "),
    x: Math.min(Math.max(end.right, 96), width - 8) + window.scrollX,
    y: end.bottom + 6 + window.scrollY,
  };
}

/** The first ~n characters, cut back to a word boundary (fragments match whole words). */
function head(s: string, n: number) {
  if (s.length <= n) return s;
  const i = s.slice(0, n + 1).lastIndexOf(" ");
  return i > 0 ? s.slice(0, i) : s;
}

/** The last ~n characters, cut forward to a word boundary. */
function tail(s: string, n: number) {
  if (s.length <= n) return s;
  const i = s.indexOf(" ", s.length - n - 1);
  return i >= 0 ? s.slice(i + 1) : s;
}

/** encodeURIComponent plus "-", which text fragments reserve for prefix-/-suffix. */
const enc = (s: string) => encodeURIComponent(s).replace(/-/g, "%2D");

/**
 * A single block is one `text=` term. A quote that spans blocks becomes
 * `text=start,end`, since one term can't match across a block boundary.
 */
function fragment(lines: string[]) {
  if (lines.length === 1) return enc(head(lines[0], FRAGMENT));
  return `${enc(head(lines[0], FRAGMENT / 2))},${enc(tail(lines[lines.length - 1], FRAGMENT / 2))}`;
}

/**
 * The record the current page is: the person on /, the record on /abs/<id>,
 * else none. A cross-list id under /abs/ is the 404 page, not a record.
 */
function pageTag(pathname: string) {
  if (pathname === "/") return `${displayId(person.id)}v${person.version}`;
  const id = /^\/abs\/([^/]+)\/?$/.exec(pathname)?.[1];
  const record = id ? getRecord(decodeURIComponent(id)) : undefined;
  return record && isRoutable(record) ? displayId(record.id) : undefined;
}

/** `"<quote>" (Lunn, 2026, TL:2610.00001v4) https://…/?cite=1#:~:text=…` */
function citationFor({ lines, quote }: Picked) {
  const url = new URL(window.location.href);
  url.searchParams.set("cite", "1");
  const link = `${url.origin}${url.pathname}${url.search}#:~:text=${fragment(lines)}`;
  const tag = pageTag(url.pathname);
  return tag ? `"${quote}" (Lunn, ${YEAR}, ${tag}) ${link}` : `"${quote}" ${link}`;
}

/**
 * The pre-Clipboard-API copy, for when writeText is missing or refuses (Safari
 * can, once a `c` held back by the conga guard has outlived the keypress). It
 * borrows the selection, so the reader's is put back afterwards. It may still
 * be refused without a user gesture; the caller then reports the failure.
 */
function legacyCopy(text: string) {
  const sel = window.getSelection();
  const ranges = sel ? Array.from({ length: sel.rangeCount }, (_, i) => sel.getRangeAt(i)) : [];
  const focused = document.activeElement;
  const area = document.createElement("textarea");
  area.value = text;
  area.readOnly = true;
  area.setAttribute("aria-hidden", "true");
  area.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  area.remove();
  if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
  if (sel) {
    sel.removeAllRanges();
    ranges.forEach((r) => sel.addRange(r));
  }
  return ok;
}

/**
 * Select to cite: a small `cite` button appears under the end of any text
 * selected in the page's prose. Clicking it, or pressing `c` while text is
 * selected, copies the quote with a citation and a link that scrolls to and
 * highlights it (the ?cite=1 also skips the intro). Esc hides the button.
 */
export function SelectionCite() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [state, setState] = useState<State>("idle");
  /** The quote Esc dismissed; the button stays hidden until the selection changes. */
  const dismissed = useRef<string | null>(null);
  /** The quote the button is for; "Copied ✓" holds until a different one is picked. */
  const shown = useRef<string | null>(null);

  useEffect(() => {
    let pointerDown = false;
    let frame = 0;
    let moveFrame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = pointerDown ? null : readSelection();
        if (next?.quote !== dismissed.current) dismissed.current = null;
        const keep = next && next.quote !== dismissed.current ? next : null;
        if (keep?.quote !== shown.current) setState("idle");
        shown.current = keep?.quote ?? null;
        setPicked(keep);
      });
    };
    // Scrolling moves a selection in a sticky or scrolled box away from where
    // the button was placed, so follow it (only while a button is showing).
    const move = () => {
      cancelAnimationFrame(moveFrame);
      moveFrame = requestAnimationFrame(() => {
        if (pointerDown || !shown.current) return;
        const next = readSelection();
        setPicked((prev) => (prev && next?.quote === prev.quote ? next : prev));
      });
    };
    // While a drag is selecting, hold the button back and place it on release.
    // A touch long-press ends in pointercancel (the browser takes the gesture
    // over), so that counts as a release too.
    const down = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest(".ft-cite-selection-btn")) return;
      pointerDown = true;
      setPicked(null);
    };
    const up = () => {
      if (!pointerDown) return;
      pointerDown = false;
      update();
    };
    document.addEventListener("selectionchange", update);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    window.addEventListener("resize", update);
    // capture: scrolls of inner boxes don't bubble to the window
    window.addEventListener("scroll", move, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(moveFrame);
      document.removeEventListener("selectionchange", update);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", move, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = (target: Picked) => {
    shown.current = target.quote;
    setPicked(target);
    const text = citationFor(target);
    const fallback = () => setState(legacyCopy(text) ? "copied" : "failed");
    if (!navigator.clipboard) return fallback();
    navigator.clipboard.writeText(text).then(() => setState("copied"), fallback);
  };

  // Above the cite modal's `c`: consumed only when there's a selection to cite.
  useShortcut(
    "c",
    () => {
      const now = readSelection();
      if (!now) return false;
      dismissed.current = null;
      copy(now);
      return true;
    },
    { priority: 10 },
  );

  useShortcut(
    "Escape",
    () => {
      if (!picked) return false;
      dismissed.current = picked.quote;
      shown.current = null;
      setPicked(null);
      return true;
    },
    { priority: 10 },
  );

  const status = state === "copied" ? "Citation copied" : state === "failed" ? "Couldn't copy the citation" : "";

  return (
    <>
      <span role="status" className="sr-only">
        {status}
      </span>
      {picked
        ? createPortal(
            <button
              type="button"
              className="btn ft-cite-selection-btn"
              data-state={state}
              style={{ left: picked.x, top: picked.y }}
              aria-label={state === "idle" ? "Copy a citation for the selected text (c)" : undefined}
              // keep the selection: a press on the button mustn't collapse it
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => copy(picked)}
            >
              {state === "copied" ? "Copied ✓" : state === "failed" ? "Copy failed" : "cite"}
            </button>,
            document.body,
          )
        : null}
    </>
  );
}
