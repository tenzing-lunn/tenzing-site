"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/content/site";

type Line = { kind: "in" | "out"; text: string };

const COMMANDS: Record<string, { help: string; href?: string }> = {
  help: { help: "list commands" },
  home: { help: "go home", href: "/" },
  about: { help: "about page", href: "/about" },
  projects: { help: "project list", href: "/projects" },
  thoughts: { help: "thoughts index", href: "/thoughts" },
  ask: { help: "ask a question", href: "/ask" },
  now: { help: "current snapshot", href: "/now" },
  art: { help: "drawings", href: "/art" },
  clear: { help: "clear output" },
};

/**
 * A small navigation layer dressed as a shell prompt. Not a terminal
 * emulator: it knows a handful of commands and nothing else.
 */
export function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    const next: Line[] = [{ kind: "in", text: raw.trim() }];

    if (cmd === "help") {
      const width = Math.max(...Object.keys(COMMANDS).map((k) => k.length));
      for (const [name, { help }] of Object.entries(COMMANDS)) {
        next.push({ kind: "out", text: `${name.padEnd(width)}  ${help}` });
      }
    } else if (COMMANDS[cmd]?.href) {
      next.push({ kind: "out", text: `→ ${COMMANDS[cmd].href}` });
      router.push(COMMANDS[cmd].href!);
    } else {
      next.push({ kind: "out", text: `command not found: ${cmd}` });
    }

    setLines((prev) => [...prev, ...next].slice(-40));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      setValue("");
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className="font-mono text-xs"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.length > 0 ? (
        <div
          ref={outputRef}
          role="log"
          aria-live="polite"
          className="mb-2 max-h-40 overflow-y-auto"
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-words ${
                l.kind === "in" ? "text-fg-2" : "text-fg-3"
              }`}
            >
              {l.kind === "in" ? `❯ ${l.text}` : l.text}
            </div>
          ))}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-fg-3 cursor-text">
        <span className="shrink-0 select-none">~/{site.username}</span>
        <span className="shrink-0 select-none" aria-hidden>
          ❯
        </span>
        <span className="relative flex min-w-0 flex-1 items-center">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            type="text"
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            className="w-full min-w-0 bg-transparent text-fg focus:outline-none"
          />
          {!focused && value === "" ? (
            <span aria-hidden className="pointer-events-none absolute left-0 flex items-center gap-3">
              <span className="cursor-blink inline-block h-[1.1em] w-[0.55em] bg-fg-3" />
              <span className="text-fg-3/60">type help</span>
            </span>
          ) : null}
        </span>
      </label>
    </div>
  );
}
