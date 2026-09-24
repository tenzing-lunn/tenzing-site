import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-[20vh] flex flex-wrap items-baseline justify-between gap-4 border-t border-border px-5 py-7 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3 sm:px-[4vw]">
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
    </footer>
  );
}
