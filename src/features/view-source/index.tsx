"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { useShortcut } from "@/lib/shortcuts";
import { texFor, type TexSource } from "@/lib/tex";
import { SideBlock } from "@/components/side-block";
import "./view-source.css";

const OPEN_EVENT = "view-source:open";

/**
 * The page as LaTeX: a native <dialog> showing the TeX that tex.ts generates
 * from content for the current route (/, /list, /abs/<id>). `\` or the
 * sidebar's "Source (TeX)" opens it; `\`, Esc or Close returns to the page.
 * On a route with no source, `\` does nothing.
 */
export function ViewSource() {
  const pathname = usePathname();
  // the route it was opened on, so navigating away closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const ref = useRef<HTMLDialogElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      codeRef.current?.focus();
    } else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const onOpen = () => {
      if (texFor(pathname)) setOpenOn(pathname);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [pathname]);

  useShortcut(
    "\\",
    () => {
      if (open) {
        setOpenOn(null);
        return true;
      }
      // another dialog (cite, palette, help) is up: leave it alone
      if (document.querySelector("dialog[open]") || !texFor(pathname)) return false;
      setOpenOn(pathname);
      return true;
    },
    { allowInDialogs: true },
  );

  const close = () => setOpenOn(null);
  const source = open ? texFor(pathname) : null;

  return (
    <dialog
      ref={ref}
      className="ft-view-source"
      aria-labelledby="ft-view-source-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClose={close}
      onClick={(e) => {
        // a click on the backdrop lands on the dialog element itself
        if (e.target === e.currentTarget) close();
      }}
    >
      {source ? <SourceBody key={pathname} source={source} codeRef={codeRef} onClose={close} /> : null}
    </dialog>
  );
}

function SourceBody({
  source,
  codeRef,
  onClose,
}: {
  source: TexSource;
  codeRef: RefObject<HTMLPreElement | null>;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard?.writeText(source.tex).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };

  return (
    <>
      <div className="ft-view-source-bar">
        <h2 id="ft-view-source-title" className="ft-view-source-name">
          {source.filename}
        </h2>
        <span className="ft-view-source-note">Generated from this page&rsquo;s content</span>
        <div className="ft-view-source-actions">
          <button type="button" className="btn" onClick={copy} aria-live="polite">
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Close <span className="mono">\</span>
          </button>
        </div>
      </div>
      <pre ref={codeRef} className="ft-view-source-code" tabIndex={0} aria-label={`LaTeX source, ${source.filename}`}>
        <code>
          {source.tex.replace(/\n$/, "").split("\n").map((line, i) => (
            <span key={i} className="ft-view-source-ln">
              <span>
                <Highlight line={line} />
              </span>
            </span>
          ))}
        </code>
      </pre>
    </>
  );
}

/** Commands set in ink, comment lines quiet. Plain text stays as it is. */
function Highlight({ line }: { line: string }) {
  if (/^\s*%/.test(line)) return <span className="ft-view-source-comment">{line}</span>;
  return line.split(/(\\(?:[a-zA-Z]+\*?|.))/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="ft-view-source-cmd">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** The sidebar's "Source (TeX)": asks the overlay in the layout to open. */
export function ViewSourceLink() {
  return (
    <SideBlock title="View source">
      <button
        type="button"
        className="ft-view-source-link"
        aria-haspopup="dialog"
        onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      >
        Source (TeX)
      </button>
      <span className="ft-view-source-key" aria-hidden="true">
        \
      </span>
    </SideBlock>
  );
}
