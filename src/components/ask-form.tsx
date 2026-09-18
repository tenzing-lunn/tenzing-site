"use client";

import { useRef, useState } from "react";
import Link from "next/link";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <label htmlFor="ask-question" className="block text-sm text-fg-2">
          Your question
        </label>
        <div className="mt-2 flex items-start gap-2 border-b border-border-strong pb-2 focus-within:border-fg-3 transition-colors">
          <span className="font-mono text-fg-3 leading-relaxed select-none" aria-hidden>
            ❯
          </span>
          <textarea
            id="ask-question"
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={500}
            disabled={pending}
            placeholder="What are you working on?"
            aria-describedby="ask-hint"
            className="w-full resize-none bg-transparent text-fg leading-relaxed placeholder:text-fg-3 focus:outline-none disabled:opacity-60 field-sizing-content"
          />
        </div>
        <div id="ask-hint" className="mt-2 flex justify-between font-mono text-[11px] text-fg-3">
          <span>↵ to send · ⇧↵ for a new line</span>
          <button
            type="submit"
            disabled={pending || !question.trim()}
            className="text-fg-3 hover:text-fg disabled:hover:text-fg-3 transition-colors"
          >
            send
          </button>
        </div>
      </form>

      {exchanges.length > 0 ? (
        <ol className="mt-10 space-y-8" aria-live="polite">
          {exchanges.map((e) => (
            <li key={e.id}>
              <p className="text-fg whitespace-pre-wrap">
                <span className="font-mono text-fg-3 select-none" aria-hidden>
                  ❯{" "}
                </span>
                {e.question}
              </p>
              <p className="mt-3 pl-5 text-fg-2 leading-relaxed">
                {e.error ? (
                  <span className="font-mono text-xs text-fg-3">error: {e.error}</span>
                ) : e.answer !== undefined ? (
                  <Linked text={e.answer} />
                ) : (
                  <span className="font-mono text-xs text-fg-3">
                    thinking
                    <span className="cursor-blink">…</span>
                  </span>
                )}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

/** Turns site paths in an answer, like /art or /projects/foo, into links. */
function Linked({ text }: { text: string }) {
  return text.split(/(?<![\w:/.])(\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*)/g).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={part} className="plain-link underline underline-offset-2">
        {part}
      </Link>
    ) : (
      part
    ),
  );
}
