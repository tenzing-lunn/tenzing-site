import Link from "next/link";
import { Chapter } from "@/components/chapter";

export default function NotFound() {
  return (
    <Chapter label="404" title="Lost?" as="h1">
      <p className="text-lg text-fg-2">There&apos;s no page here.</p>
      <p className="mt-8">
        <Link href="/" className="sweep font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3 hover:text-fg">
          ← Back home
        </Link>
      </p>
    </Chapter>
  );
}
