import type { ReactNode } from "react";

/** The sidebar column of an abs page; sticky on desktop, a plain stack below 900px. */
export function Sidebar({ children, label = "Record tools" }: { children: ReactNode; label?: string }) {
  return (
    <aside className="side-col" aria-label={label}>
      <div className="side-sticky">{children}</div>
    </aside>
  );
}

/** One sidebar block: a 1px left rule, a small heading, then a list or a line. */
export function SideBlock({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`side ${className}`}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </div>
  );
}
