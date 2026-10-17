"use client";

import { useRouter } from "next/navigation";
import { useShortcut } from "@/lib/shortcuts";

/** `v`: open the diff from the previous version to this one. */
export function VersionShortcut({ href }: { href?: string }) {
  const router = useRouter();
  useShortcut(
    "v",
    () => {
      if (!href) return;
      router.push(href);
      return true;
    },
    { enabled: Boolean(href) },
  );
  return null;
}
