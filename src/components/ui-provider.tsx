"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type Overlay = "palette" | "shortcuts" | null;

type UIContextValue = {
  overlay: Overlay;
  openPalette: () => void;
  openShortcuts: () => void;
  closeOverlay: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

/** True when the keydown originated in something the user types into. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/** 1–4 jump to the numbered sections of the home page. */
const SECTIONS = ["about", "work", "now", "ask"];

/** Turns the lights off or on, whichever the page isn't now. */
function toggleLights() {
  const root = document.documentElement;
  const dark = getComputedStyle(document.body).backgroundColor === "rgb(17, 17, 17)";
  root.classList.toggle("force-dark", !dark);
  root.classList.toggle("force-light", dark);
}

const SHORTCUT_ROUTES: Record<string, string> = {
  a: "/about",
  p: "/projects",
  t: "/thoughts",
  r: "/resume",
  "/": "/ask",
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const router = useRouter();

  const openPalette = useCallback(() => setOverlay("palette"), []);
  const openShortcuts = useCallback(() => setOverlay("shortcuts"), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOverlay((o) => (o === "palette" ? null : "palette"));
        return;
      }

      if (e.key === "Escape") {
        setOverlay(null);
        return;
      }

      if (mod || e.altKey || e.repeat) return;
      if (isTypingTarget(e.target)) return;
      if (overlay) return;

      const key = e.key.toLowerCase();
      if (key === "?") {
        e.preventDefault();
        setOverlay("shortcuts");
        return;
      }
      if (key === "i") {
        toggleLights();
        return;
      }
      const section = SECTIONS[Number(key) - 1];
      if (section) {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else router.push(`/#${section}`);
        return;
      }
      const route = SHORTCUT_ROUTES[key];
      if (route) {
        e.preventDefault();
        router.push(route);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlay, router]);

  const value = useMemo(
    () => ({ overlay, openPalette, openShortcuts, closeOverlay }),
    [overlay, openPalette, openShortcuts, closeOverlay],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
