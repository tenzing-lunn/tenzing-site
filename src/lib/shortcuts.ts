import { useEffect, useRef } from "react";

/**
 * The keyboard registry. One window listener dispatches every single-key
 * shortcut on the site; components register handlers with useShortcut.
 *
 * - Handlers for a key run highest priority first. Returning true consumes the
 *   key and stops the rest (selection-aware `c` registers above the cite modal
 *   and returns true only when text is selected).
 * - Keys typed into inputs are ignored, as is everything while a modal dialog
 *   is open, unless the handler opts in.
 * - The conga guard: while what's been typed is a prefix of "conga", `c` waits
 *   350ms and the keys that continue the word (o, n, g, a) are swallowed, so
 *   typing the word plays the band instead of opening the cite modal or graph.
 */

/** Every key on the site, for the ? overlay and the Shortcuts tab. */
export const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["j", "k"], label: "Next / previous submission" },
  { keys: ["c"], label: "Cite this record, or the selected text" },
  { keys: ["g"], label: "Open the graph" },
  { keys: ["v"], label: "Compare with the previous version" },
  { keys: ["\\"], label: "View source (TeX)" },
  { keys: ["t"], label: "TL;DR mode" },
  { keys: ["/", "⌘K"], label: "Search lunnXiv" },
  { keys: ["I"], label: "Lights off / on" },
  { keys: ["?"], label: "This reference" },
  { keys: ["Esc"], label: "Close a dialog" },
];

export type ShortcutHandler = (e: KeyboardEvent) => boolean | void;

export type ShortcutOptions = {
  /** Higher runs first. Foundation handlers use 0. */
  priority?: number;
  /** Also fire while focus is in an input or textarea. */
  allowInInputs?: boolean;
  /** Also fire while a modal dialog is open. */
  allowInDialogs?: boolean;
  enabled?: boolean;
};

type Entry = { run: ShortcutHandler; priority: number; allowInInputs: boolean; allowInDialogs: boolean };

const registry = new Map<string, Set<Entry>>();

/** "I" and "i" are the same key; ⌘K and Ctrl-K are both "mod+k". */
const normalize = (key: string) => (key.length === 1 ? key.toLowerCase() : key.toLowerCase().replace(/^(cmd|ctrl|meta)\+/, "mod+"));

/** True when the keydown originated in something the user types into. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function dispatch(key: string, e: KeyboardEvent, typing: boolean): boolean {
  const entries = [...(registry.get(key) ?? [])].sort((a, b) => b.priority - a.priority);
  const modal = typeof document !== "undefined" && document.querySelector("dialog[open]") !== null;
  for (const entry of entries) {
    if (typing && !entry.allowInInputs) continue;
    if (modal && !entry.allowInDialogs) continue;
    if (entry.run(e) === true) return true;
  }
  return false;
}

const CONGA = "conga";
const CONGA_WAIT = 350;
let typed = "";
let deferred: { e: KeyboardEvent; timer: number } | null = null;

/** Runs a `c` that was held back to see whether "conga" was being typed. */
function flush() {
  if (!deferred) return;
  const { e, timer } = deferred;
  deferred = null;
  window.clearTimeout(timer);
  dispatch("c", e, false);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.repeat || e.altKey) return;
  const typing = isTypingTarget(e.target);
  if (e.metaKey || e.ctrlKey) {
    if (e.shiftKey) return;
    if (dispatch(`mod+${e.key.toLowerCase()}`, e, typing)) e.preventDefault();
    return;
  }
  if (e.key.length !== 1) {
    if (dispatch(normalize(e.key), e, typing)) e.preventDefault();
    return;
  }

  const ch = e.key.toLowerCase();
  if (!typing) {
    const next = typed + ch;
    typed = CONGA.startsWith(next) ? next : ch === "c" ? "c" : "";
    if (typed === CONGA) {
      typed = "";
      if (deferred) window.clearTimeout(deferred.timer);
      deferred = null;
      window.dispatchEvent(new Event("conga"));
      return;
    }
    if (typed.length > 1) {
      // the word is still being typed: o, n, g, a do nothing on their own
      if (deferred) window.clearTimeout(deferred.timer);
      deferred = null;
      return;
    }
    flush();
    if (typed === "c") {
      deferred = { e, timer: window.setTimeout(flush, CONGA_WAIT) };
      return;
    }
  }
  if (dispatch(ch, e, typing)) e.preventDefault();
}

let installed = false;
function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("keydown", onKeyDown);
}

/** Register a handler for one key ("j", "?", "\\", "mod+k", "Escape"). */
export function useShortcut(key: string, handler: ShortcutHandler, opts: ShortcutOptions = {}) {
  const { priority = 0, allowInInputs = false, allowInDialogs = false, enabled = true } = opts;
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    if (!enabled) return;
    install();
    const k = normalize(key);
    const entry: Entry = { run: (e) => ref.current(e), priority, allowInInputs, allowInDialogs };
    const set = registry.get(k) ?? new Set<Entry>();
    set.add(entry);
    registry.set(k, set);
    return () => {
      set.delete(entry);
    };
  }, [key, priority, allowInInputs, allowInDialogs, enabled]);
}
