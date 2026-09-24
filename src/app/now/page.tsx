import type { Metadata } from "next";
import { site } from "@/content/site";
import { Chapter } from "@/components/chapter";
import { NowList } from "@/components/now-list";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${site.firstName} is doing right now.`,
};

export default function NowPage() {
  return (
    <Chapter label="Now" title="What I am doing" as="h1">
      <NowList />
    </Chapter>
  );
}
