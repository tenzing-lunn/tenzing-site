import Link from "next/link";
import { site } from "@/content/site";
import { displayId, person } from "@/content/records";
import { datelineDate } from "@/components/dateline";

const PAGES = [
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/art", label: "Art" },
  { href: "/ask", label: "Ask" },
];

/** arXiv's footer: plain links separated by middots, and one line of fine print. */
export function Footer() {
  return (
    <footer className="wrap mt-24 no-print">
      <div className="foot">
        <nav aria-label="Footer">
          <ul>
            {PAGES.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            {site.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target={l.external && !l.href.startsWith("mailto:") ? "_blank" : undefined} rel={l.external ? "noreferrer noopener" : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/feed.xml">RSS</a>
            </li>
          </ul>
        </nav>
        <p className="fine">
          lunnXiv · {displayId(person.id)}v{person.version} · updated {datelineDate(person.revised)} · press ? for shortcuts
        </p>
      </div>
    </footer>
  );
}
