import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="wrap mt-[20vh]">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-border py-7 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
        <p>
          © {new Date().getFullYear()} {site.name} · Made in New York
        </p>
        <ul className="flex gap-5">
          {site.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noreferrer noopener" : undefined} className="sweep hover:text-fg transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
