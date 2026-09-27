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
 * A section of the site: a small label over a rule, a large heading that
 * rises in word by word, then the content, all on the shared column. On the
 * home page the labels are numbered, since the sections are read in order.
 * A section that is a whole page (as="h1") sits higher, with a smaller heading,
 * and shows at once so the page can be taken in at a glance.
 */
export function Chapter({
  label,
  title,
  n,
  id,
  as: Heading = "h2",
  children,
}: {
  label: React.ReactNode;
  /** The big heading. Pages that bring their own h1 leave it out. */
  title?: string;
  /** Position on the home page, shown as (01). */
  n?: number;
  id?: string;
  as?: "h1" | "h2";
  children: React.ReactNode;
}) {
  const page = Heading === "h1";
  const body = (
    <>
      <div className="border-t border-fg pt-3 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
        {n ? `(${String(n).padStart(2, "0")}) ` : null}
        {label}
      </div>
      {title ? (
        <Heading
          className={`words font-semibold tracking-[-0.05em] text-balance ${
            page ? "mt-4 mb-5 text-[clamp(34px,3.6vw,52px)] leading-[0.95]" : "mt-6 mb-[6vh] text-[clamp(40px,6.4vw,88px)] leading-[0.92]"
          }`}
        >
          <Words text={title} />
        </Heading>
      ) : null}
      <div className={`rise ${title ? "" : "mt-8"}`}>{children}</div>
    </>
  );
  return page ? (
    <section id={id} className="wrap pt-[72px]">
      {body}
    </section>
  ) : (
    <Reveal id={id} className="wrap scroll-mt-16 pt-[16vh] sm:pt-[20vh]">
      {body}
    </Reveal>
  );
}
