"use client";

import { useEffect, useRef, useState } from "react";
import { movies, reading } from "@/content/about";
import { drawings, photos, type Piece } from "@/content/art";
import { Lightbox } from "@/components/lightbox";

/** Where I'm from and what I study. */
export function Bio() {
  return (
    <div className="prose">
      <p>
        I study math and computer science at Fordham, and spend the rest of my time building
        software, learning about AI, and reading whatever I can on biology, philosophy, and politics.
      </p>
      <p>
        I&apos;m a sophomore at the Lincoln Center campus. Born and raised in Los Angeles, I spent two
        years at an international boarding school in Armenia before New York.
      </p>
    </div>
  );
}

/**
 * What I do for fun. A few words respond to a click:
 * "football" turns into "soccer", "book" / "movie" show what's being read and watched, and
 * "draw" / "photos" open a drawing and a photograph in a lightbox.
 * Until one is clicked, it swells a little as the pointer comes near.
 */
export function Pastimes() {
  const ref = useRef<HTMLDivElement>(null);
  useMagnets(ref);
  const [soccer, setSoccer] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const [piece, setPiece] = useState<Piece | null>(null);

  return (
    <div ref={ref} className="prose">
      <p>
        I play{" "}
        <Tap onClick={() => setSoccer((s) => !s)} label="toggle football or soccer">
          {soccer ? "soccer" : "football"}
        </Tap>
        , I{" "}
        <Tap onClick={() => setPiece(drawings[0])} label="see a drawing">
          draw
        </Tap>{" "}
        and take some{" "}
        <Tap onClick={() => setPiece(photos[0])} label="see a photograph">
          photos
        </Tap>
        , and I love music and the occasional{" "}
        <Tap onClick={() => setShowBook((s) => !s)} label="what I'm reading">
          book
        </Tap>
        {showBook ? ` (currently reading ${reading})` : null} and{" "}
        <Tap onClick={() => setShowMovies((s) => !s)} label="my top movies">
          movie
        </Tap>
        .
      </p>
      {showMovies ? (
        <ul className="font-mono text-xs text-fg-3">
          <li className="list-none text-fg-3">in no particular order</li>
          {movies.map((m) => (
            <li key={m} className="list-none">
              {m}
            </li>
          ))}
        </ul>
      ) : null}
      <p>And I have a lovely older sister.</p>
      <Lightbox piece={piece} onClose={() => setPiece(null)} />
    </div>
  );
}

/** How near the pointer starts to pull, in px, and how big a word can get. */
const REACH = 180;
const GROW = 0.3;

/**
 * Scales each [data-magnet] word up as the pointer nears it. A word that has
 * been clicked is marked data-used and stays its normal size from then on.
 */
function useMagnets(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
          if (el.dataset.used) return;
          const r = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          el.style.transform = `scale(${1 + GROW * Math.max(0, 1 - d / REACH) ** 2})`;
        });
      });
    };
    addEventListener("pointermove", move);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

function Tap({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      data-magnet
      onClick={(e) => {
        e.currentTarget.dataset.used = "true";
        e.currentTarget.style.transform = "";
        onClick();
      }}
      aria-label={label}
      className="inline-block origin-bottom cursor-pointer text-fg transition-transform duration-200 ease-out underline decoration-fg-3 decoration-dotted underline-offset-4 hover:decoration-fg"
    >
      {children}
    </button>
  );
}
