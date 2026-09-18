import Link from "next/link";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold leading-tight text-fg">{site.name}</h1>

      <div className="space-y-4 text-fg-2 leading-relaxed">
        {site.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p>Currently in {site.now.location}.</p>
      </div>

      <p>
        <Link
          href="/now"
          className="group inline-flex items-baseline gap-1 text-sm text-fg-2 hover:text-fg transition-colors"
        >
          The current snapshot
          <span
            aria-hidden
            className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </p>
    </div>
  );
}
