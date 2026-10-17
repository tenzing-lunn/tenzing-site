"use client";

import { Dialog } from "@/components/dialog";
import { useUI } from "@/components/ui-provider";
import { SHORTCUTS } from "@/lib/shortcuts";

/** The keys, as a two-column list. Also used inline by the Shortcuts tab. */
export function ShortcutList({ className = "" }: { className?: string }) {
  return (
    <dl className={`meta ${className}`}>
      {SHORTCUTS.map((s) => (
        <div key={s.keys.join()} className="contents">
          <dt className="normal-case">{s.keys.join(" / ")}</dt>
          <dd>{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

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
      <div className="mx-4 w-full max-w-[26rem] border border-ink bg-paper px-5 py-4">
        <div className="label mb-3">Keyboard</div>
        <ShortcutList className="m-0" />
        <p className="sans mt-3 text-xs text-ink-3">There&apos;s one more. Try typing a drum.</p>
        <button
          type="button"
          onClick={closeOverlay}
          className="mt-3 font-mono text-[11px] text-ink-3 hover:text-ink"
        >
          esc to close
        </button>
      </div>
    </Dialog>
  );
}
