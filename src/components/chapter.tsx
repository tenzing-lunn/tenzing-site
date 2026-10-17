/**
 * A plain page on the shared column (About, Now, Art, Thoughts, Ask, the
 * résumé): a mono label, a serif title like a paper's, then the content. It
 * shows at once; nothing starts hidden.
 */
export function Chapter({
  label,
  title,
  id,
  children,
}: {
  label: React.ReactNode;
  /** The page's h1. Pages that bring their own h1 leave it out. */
  title?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="wrap page">
      <div className="label page-label">{label}</div>
      {title ? <h1 className="page-title">{title}</h1> : null}
      <div className={title ? "" : "mt-6"}>{children}</div>
    </section>
  );
}
