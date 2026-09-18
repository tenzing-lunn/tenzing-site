import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold leading-tight text-fg">Not found</h1>
      <p className="mt-4 font-mono text-xs text-fg-3">404: no such page</p>
      <p className="mt-10">
        <Link href="/" className="text-sm text-fg-2 hover:text-fg transition-colors">
          ← Home
        </Link>
      </p>
    </section>
  );
}
