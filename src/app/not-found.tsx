import Link from "next/link";
import { displayId, person } from "@/content/records";

/** arXiv's answer to an ID it doesn't hold, for any URL that isn't a page here. */
export default function NotFound() {
  return (
    <div className="wrap page">
      <div className="label page-label">Error 404</div>
      <h1 className="page-title">Article identifier not recognized</h1>
      <div className="prose">
        <p>The identifier in this URL doesn&apos;t match any record in lunnXiv, or the page has moved.</p>
        <p>
          Try the <Link href="/list">listing of every submission</Link>, the person record{" "}
          <Link href="/">{displayId(person.id)}</Link>, or search with <kbd className="mono">⌘K</kbd>.
        </p>
      </div>
    </div>
  );
}
