"use client";

import { useState } from "react";
import Link from "next/link";
import { movies, reading } from "@/content/about";
import { drawings, photos, type Piece } from "@/content/art";
import { Lightbox } from "@/components/lightbox";

/**
 * The About paragraphs. A few words respond to a click:
 * "football" turns into "soccer", "book" / "movie" show what's being read and watched, and
 * "draw" / "photos" open a drawing and a photograph in a lightbox.
 */
export function AboutText() {
  const [soccer, setSoccer] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const [piece, setPiece] = useState<Piece | null>(null);

  return (
    <div className="prose">
      <p>
        My name is Tenzing Lunn, a sophomore at Fordham University Lincoln Center. Born and raised
        in Los Angeles. I spent two years in{" "}
        Armenia at an international boarding school, now studying Math and
        Computer Science in New York.
      </p>
      <p>
        Fascinated by philosophy, biology, religion, math, and artificial intelligence. I play{" "}
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
      <p>
        and I have a lovely older sister.
      </p>
      <Lightbox piece={piece} onClose={() => setPiece(null)} />
      <p>
        <Link href="/now" className="plain-link">
          currently
        </Link>
      </p>
    </div>
  );
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
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer text-fg underline decoration-fg-3 decoration-dotted underline-offset-4 transition-colors hover:decoration-fg"
    >
      {children}
    </button>
  );
}
