"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { getRecord, serialOf } from "@/content/records";
import { HoverCite } from "@/components/hover-cite";

type Exchange = {
  id: number;
  question: string;
  answer?: string;
  error?: string;
};

export function AskForm() {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const nextId = useRef(1);

  const submit = async () => {
    const q = question.trim();
    if (!q || pending) return;

    const id = nextId.current++;
    setExchanges((prev) => [...prev, { id, question: q }]);
    setQuestion("");
    setPending(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok || !data.answer) throw new Error(data.error ?? "Something went wrong.");
      setExchanges((prev) =>
        prev.map((e) => (e.id === id ? { ...e, answer: data.answer } : e)),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setExchanges((prev) =>
        prev.map((e) => (e.id === id ? { ...e, error: message } : e)),
      );
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div>
      <form
        className="ask"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <label htmlFor={`${id}-q`} className="sr-only">
          Your question
        </label>
        <input
          id={`${id}-q`}
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          disabled={pending}
          placeholder="What did he do at Algoverse?"
          autoComplete="off"
        />
        <button type="submit" disabled={pending || !question.trim()}>
          Ask ↵
        </button>
      </form>

      {exchanges.length > 0 ? (
        <ol className="ask-log" aria-live="polite">
          {exchanges.map((e) => (
            <li key={e.id}>
              <p className="ask-q">
                <span className="label">Query:</span>
                {e.question}
              </p>
              <div className="resp">
                <span className="label">Response:</span>
                {e.error ? (
                  <span className="quiet">Sorry, that didn&apos;t work: {e.error}</span>
                ) : e.answer !== undefined ? (
                  <Answer text={e.answer} />
                ) : (
                  <span className="quiet">
                    thinking
                    <span className="cursor-blink">…</span>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

/**
 * A citation, `[TL:2605.00003]` (a trailing version like `v4` is allowed), or
 * a site path such as /art, /abs/2605.00003 or /resume#lxivny. The
 * lookbehind keeps paths inside full URLs from matching.
 */
const TOKEN = /\[TL:(\d{2}[\dx]{2}\.\d{5})(?:v\d+)?\]|(?<![\w:/.])\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+(?:\.[a-z0-9-]+)*)*(?:#[a-z0-9-]+)?/g;

/**
 * An answer as text with its citations and site paths made live. A citation
 * of a record in the archive becomes a hover card numbered like its listing
 * entry; any other ID stays exactly as the model wrote it, as plain text, so
 * nothing on the page points at a record that doesn't exist.
 */
function Answer({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const [whole, id] = m;
    out.push(text.slice(last, m.index));
    if (id === undefined) {
      out.push(
        <Link key={m.index} href={whole}>
          {whole}
        </Link>,
      );
    } else {
      out.push(getRecord(id) ? <HoverCite key={m.index} id={id} n={serialOf(id)} /> : whole);
    }
    last = m.index + whole.length;
  }
  out.push(text.slice(last));
  return out;
}
