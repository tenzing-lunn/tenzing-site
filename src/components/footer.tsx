import { Terminal } from "@/components/terminal";
import { LiveContext } from "@/components/live-context";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[42rem] px-5 pb-8 pt-16">
      <div className="border-t border-border pt-4">
        <Terminal />
        <div className="mt-4 flex items-center justify-between">
          <LiveContext />
          <span className="font-mono text-[11px] text-fg-3">
            <kbd>?</kbd> for shortcuts
          </span>
        </div>
      </div>
    </footer>
  );
}
