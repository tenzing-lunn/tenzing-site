"use client";

import { useEffect, useRef, useState } from "react";
import { citation, displayId, getRecord, type Citation } from "@/content/records";
import { useUI } from "@/components/ui-provider";

const FORMATS: { id: keyof Citation; label: string }[] = [
  { id: "bibtex", label: "BibTeX" },
  { id: "apa", label: "APA" },
  { id: "plain", label: "Plain" },
];

/**
 * "Cite this person": a native <dialog> with BibTeX, APA and plain-text tabs
 * and a Copy button that flips to "Copied ✓". Opened by `c` or a sidebar
 * button; on an abs page it cites that record instead of the person.
 */
export function CiteModal() {
  const { overlay, citeId, closeOverlay } = useUI();
  const open = overlay === "cite";
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="cite-dialog"
      aria-labelledby="cite-title"
      onCancel={(e) => {
        e.preventDefault();
        closeOverlay();
      }}
      onClose={closeOverlay}
      onClick={(e) => {
        // a click on the backdrop lands on the dialog element itself
        if (e.target === e.currentTarget) closeOverlay();
      }}
    >
      {open ? <CiteBody key={citeId ?? "person"} id={citeId} onClose={closeOverlay} /> : null}
    </dialog>
  );
}

function CiteBody({ id, onClose }: { id?: string; onClose: () => void }) {
  const [format, setFormat] = useState<keyof Citation>("bibtex");
  const [copied, setCopied] = useState(false);
  const record = id ? getRecord(id) : undefined;
  const text = citation(record?.id)[format];

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard?.writeText(text).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };

  return (
    <div>
      <p id="cite-title" className="sans mb-2.5 text-[15px] font-semibold">
        {record ? `Cite ${displayId(record.id)}` : "Cite this person"}
      </p>
      <div className="tabs" role="tablist" aria-label="Citation format">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            id={`cite-tab-${f.id}`}
            className="tab"
            aria-selected={format === f.id}
            aria-controls="cite-panel"
            onClick={() => {
              setFormat(f.id);
              setCopied(false);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <pre id="cite-panel" role="tabpanel" aria-labelledby={`cite-tab-${format}`} tabIndex={0}>
        {text}
      </pre>
      <div className="mt-3.5 flex gap-2.5">
        <button type="button" className="btn" onClick={copy} aria-live="polite">
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

/** The sidebar's "Export BibTeX  c" button. Without an id it cites the person. */
export function CiteButton({ id, label = "Export BibTeX" }: { id?: string; label?: string }) {
  const { openCite } = useUI();
  return (
    <button type="button" className="btn" onClick={() => openCite(id)}>
      {label} <span className="mono">c</span>
    </button>
  );
}
