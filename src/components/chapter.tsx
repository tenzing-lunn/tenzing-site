import { Reveal } from "@/components/reveal";

/** Splits a heading into words that can each rise out of their own line. */
function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <span key={i}>
      {i ? " " : null}
      <span className="w">
        <span style={{ transitionDelay: `${i * 70}ms` }}>{w}</span>
      </span>
    </span>
  ));
}

/**
 * A section of the site: a small label that stays beside you on the left,
 * and on the right a large heading that rises in word by word, then the
 * content. On the home page the labels are numbered, since the sections are
 * read in order.
 */
export function Chapter({
  label,
  title,
  n,
  id,
  as: Heading = "h2",
  children,
}: {
  label: string;
  /** The big heading. Pages that bring their own h1 leave it out. */
  title?: string;
  /** Position on the home page, shown as (01). */
  n?: number;
  id?: string;
  as?: "h1" | "h2";
  children: React.ReactNode;
}) {
  return (
    <Reveal id={id} className="grid scroll-mt-16 gap-x-[4vw] gap-y-6 px-5 pt-[18vh] sm:grid-cols-[1fr_2fr] sm:px-[4vw] sm:pt-[22vh]">
      <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3 sm:sticky sm:top-24 sm:self-start">
        {n ? `(${String(n).padStart(2, "0")}) ` : null}
        {label}
      </div>
      <div className="min-w-0">
        {title ? (
          <Heading className="words mb-[7vh] text-[clamp(40px,6vw,92px)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance">
            <Words text={title} />
          </Heading>
        ) : null}
        <div className="rise max-w-[760px]">{children}</div>
      </div>
    </Reveal>
  );
}
