"use client";

import { useState } from "react";
import Link from "next/link";
import { ethnicities, movies, reading } from "@/content/about";

/**
 * The About paragraphs. A few words respond to a click:
 * "ethnically ambiguous" reveals the first origin and "+1" the rest, "football" turns
 * into "soccer", and "book" / "movie" show what's being read and watched.
 */
export function AboutText() {
  const [revealed, setRevealed] = useState(0);
  const [soccer, setSoccer] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showMovies, setShowMovies] = useState(false);

  return (
    <div className="prose">
      <p>
        My name is Tenzing Lunn, a sophomore at Fordham University Lincoln Center. Born and raised
        in Los Angeles,{" "}
        {revealed === 0 ? (
          <Tap onClick={() => setRevealed(1)} label="reveal ethnicity">
            ethnically ambiguous
          </Tap>
        ) : (
          <>
            {ethnicities.slice(0, revealed).map((e, i) => (
              <span key={e.label}>
                {i > 0 ? (i === revealed - 1 && revealed === ethnicities.length ? " and " : ", ") : ""}
                <span style={{ color: e.color }}>{e.label}</span>
              </span>
            ))}
            {revealed < ethnicities.length ? (
              <>
                {" "}
                <button
                  type="button"
                  onClick={() => setRevealed((n) => n + 1)}
                  aria-label="reveal one more"
                  className="cursor-pointer font-mono text-xs text-fg-3 transition-colors hover:text-fg"
                >
                  +1
                </button>
              </>
            ) : null}
          </>
        )}
        . I spent two years in Armenia at an international boarding school, now studying Math and
        Computer Science in New York.
      </p>
      <p>
        Fascinated by philosophy, biology, religion, math, and artificial intelligence. I play{" "}
        <Tap onClick={() => setSoccer((s) => !s)} label="toggle football or soccer">
          {soccer ? "soccer" : "football"}
        </Tap>
        , I <Link href="/art" className="plain-link">draw</Link>, and I love music and the occasional{" "}
        <Tap onClick={() => setShowBook((s) => !s)} label="what I'm reading">
          book
        </Tap>
        {showBook ? <Aside>{reading}</Aside> : null} and{" "}
        <Tap onClick={() => setShowMovies((s) => !s)} label="my top movies">
          movie
        </Tap>
        .
      </p>
      {showMovies ? (
        <ol className="font-mono text-xs text-fg-3">
          {movies.length === 0 ? <li className="list-none">list coming soon</li> : null}
          {movies.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ol>
      ) : null}
      <p>and I have a lovely older sister.</p>
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
      className="cursor-pointer text-fg transition-colors hover:text-fg-2"
    >
      {children}
    </button>
  );
}

function Aside({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs text-fg-3"> ({children})</span>;
}
