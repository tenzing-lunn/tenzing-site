import type { Metadata } from "next";
import { Chapter } from "@/components/chapter";
import { WorkList } from "@/components/work-list";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${site.firstName} has built.`,
};

export default function ProjectsPage() {
  return (
    <Chapter label="Work" title="Things I have made or worked on" as="h1">
      <WorkList />
    </Chapter>
  );
}
