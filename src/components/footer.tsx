import { Terminal } from "@/components/terminal";
import { Listening } from "@/components/listening";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[42rem] px-5 pb-8 pt-10">
      <div className="border-t border-border pt-4">
        <Terminal />
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Listening />
          </div>
          <span className="hidden shrink-0 font-mono text-[11px] text-fg-3 sm:inline">
            <kbd>?</kbd> for shortcuts
          </span>
        </div>
      </div>
    </footer>
  );
}
