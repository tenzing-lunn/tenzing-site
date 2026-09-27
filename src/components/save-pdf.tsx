"use client";

import { useEffect } from "react";

/**
 * Opens the print dialog, where "Save as PDF" gives a clean copy of the page.
 * Every folded line is opened for the print and closed again afterwards.
 */
export function SavePdf({ className }: { className?: string }) {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = [...document.querySelectorAll<HTMLDetailsElement>("details:not([open])")];
      opened.forEach((d) => (d.open = true));
    };
    const after = () => opened.forEach((d) => (d.open = false));
    addEventListener("beforeprint", before);
    addEventListener("afterprint", after);
    return () => {
      removeEventListener("beforeprint", before);
      removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <button type="button" onClick={() => print()} className={className}>
      Save as PDF ↓
    </button>
  );
}
