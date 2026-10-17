"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShortcut } from "@/lib/shortcuts";
import { openTool } from "@/components/tabs";

export { isTypingTarget } from "@/lib/shortcuts";

type Overlay = "palette" | "shortcuts" | "cite" | null;

type UIContextValue = {
  overlay: Overlay;
  /** The record the cite modal shows; undefined means the person record. */
  citeId: string | undefined;
  openPalette: () => void;
  openShortcuts: () => void;
  openCite: (id?: string) => void;
  closeOverlay: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

/**
 * Turns the lights off or on, whichever the page isn't now. The state is the
 * class on <html>; with neither class set, the system preference decides.
 */
function toggleLights() {
  const root = document.documentElement;
  const dark =
    root.classList.contains("force-dark") ||
    (!root.classList.contains("force-light") && matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("force-dark", !dark);
  root.classList.toggle("force-light", dark);
}

/** j / k: focus the next or previous listing entry ([data-entry]) on the page. */
function stepEntry(dir: 1 | -1): boolean {
  const items = [...document.querySelectorAll<HTMLElement>("[data-entry]")];
  if (!items.length) return false;
  let i = items.findIndex((el) => el.contains(document.activeElement));
  if (i === -1) {
    // nothing focused yet: start from the first entry below the masthead
    const below = items.findIndex((el) => el.getBoundingClientRect().top > 80);
    i = dir === 1 ? (below === -1 ? items.length : below) - 1 : below === -1 ? items.length : below;
  }
  const next = items[Math.min(items.length - 1, Math.max(0, i + dir))];
  const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  next.focus({ preventScroll: true });
  next.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
  return true;
}

/** The record an abs page is about, from its URL: /abs/2605.00003 → "2605.00003". */
const absId = (pathname: string) => /^\/abs\/([^/]+)/.exec(pathname)?.[1];

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [citeId, setCiteId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();

  const openPalette = useCallback(() => setOverlay("palette"), []);
  const openShortcuts = useCallback(() => setOverlay("shortcuts"), []);
  const openCite = useCallback((id?: string) => {
    setCiteId(id);
    setOverlay("cite");
  }, []);
  const closeOverlay = useCallback(() => setOverlay(null), []);

  useShortcut("mod+k", () => {
    setOverlay((o) => (o === "palette" ? null : "palette"));
    return true;
  }, { allowInInputs: true, allowInDialogs: true });
  useShortcut("/", () => {
    openPalette();
    return true;
  });
  useShortcut("?", () => {
    openShortcuts();
    return true;
  });
  useShortcut("i", () => {
    toggleLights();
    return true;
  });
  useShortcut("j", () => stepEntry(1));
  useShortcut("k", () => stepEntry(-1));
  useShortcut("c", () => {
    openCite(absId(pathname));
    return true;
  });
  useShortcut("g", () => {
    if (document.querySelector("[data-tools]")) openTool("graph");
    else router.push("/#graph");
    return true;
  });

  const value = useMemo(
    () => ({ overlay, citeId, openPalette, openShortcuts, openCite, closeOverlay }),
    [overlay, citeId, openPalette, openShortcuts, openCite, closeOverlay],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
