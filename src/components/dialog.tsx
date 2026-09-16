"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Thin wrapper over the native <dialog> element. The browser provides the
 * focus trap, Escape handling, and inert background for free.
 */
export function Dialog({
  open,
  onClose,
  label,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
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
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, not its children).
        if (e.target === e.currentTarget) onClose();
      }}
      className={`m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 open:flex ${className}`}
    >
      {open ? children : null}
    </dialog>
  );
}
