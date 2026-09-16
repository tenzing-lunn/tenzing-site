"use client";

import { Dialog } from "@/components/dialog";
import { useUI } from "@/components/ui-provider";

const SHORTCUTS: [string, string][] = [
  ["A", "About"],
  ["P", "Projects"],
  ["N", "Notes"],
  ["/", "Ask"],
  ["⌘ / Ctrl K", "Open command palette"],
  ["?", "This reference"],
  ["Esc", "Close a dialog"],
];

export function ShortcutsOverlay() {
  const { overlay, closeOverlay } = useUI();
  const open = overlay === "shortcuts";

  return (
    <Dialog
      open={open}
      onClose={closeOverlay}
      label="Keyboard shortcuts"
      className="items-start justify-center pt-[16vh] sm:pt-[22vh]"
    >
      <div className="mx-4 w-full max-w-[20rem] border border-border-strong bg-bg px-4 py-3">
        <div className="mb-2 font-mono text-[11px] text-fg-3">keyboard</div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
          {SHORTCUTS.map(([key, label]) => (
            <div key={key} className="contents">
              <dt className="font-mono text-xs text-fg">{key}</dt>
              <dd className="text-fg-2">{label}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={closeOverlay}
          className="mt-3 font-mono text-[11px] text-fg-3 hover:text-fg"
        >
          esc to close
        </button>
      </div>
    </Dialog>
  );
}
