import type { ReactNode } from "react";
import Link from "next/link";

/**
 * A deliberately small Markdown renderer. No dependencies.
 *
 * Blocks: headings (# ## ###), paragraphs, unordered lists (- or *),
 * ordered lists (1.), blockquotes (>), fenced code blocks (```).
 * Inline: [links](url), `code`, **bold**, *italic*.
 */

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const isBlockStart = (l: string) =>
    /^#{1,3}\s/.test(l) ||
    /^>\s?/.test(l) ||
    /^[-*]\s+/.test(l) ||
    /^\d+\.\s+/.test(l) ||
    l.startsWith("```");

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: parts.join("\n") });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }

  return blocks;
}

const INLINE =
  /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    if (m[1] !== undefined) {
      const href = m[2];
      const internal = href.startsWith("/");
      out.push(
        internal ? (
          <Link key={key++} href={href} className="link">
            {m[1]}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            className="link"
            target="_blank"
            rel="noreferrer noopener"
          >
            {m[1]}
          </a>
        ),
      );
    } else if (m[3] !== undefined) {
      out.push(
        <code key={key++} className="inline-code">
          {m[3]}
        </code>,
      );
    } else if (m[4] !== undefined) {
      out.push(<strong key={key++}>{m[4]}</strong>);
    } else if (m[5] !== undefined) {
      out.push(<em key={key++}>{m[5]}</em>);
    }
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const Tag = b.level === 1 ? "h2" : b.level === 2 ? "h2" : "h3";
            return <Tag key={i}>{renderInline(b.text)}</Tag>;
          }
          case "paragraph":
            return <p key={i}>{renderInline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i}>
                {b.text.split("\n").map((l, j) => (
                  <p key={j}>{renderInline(l)}</p>
                ))}
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} data-lang={b.lang || undefined}>
                <code>{b.code}</code>
              </pre>
            );
        }
      })}
    </>
  );
}
