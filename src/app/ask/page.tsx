import type { Metadata } from "next";
import { AskForm } from "@/components/ask-form";
import { Chapter } from "@/components/chapter";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Ask",
  description: `Ask ${site.firstName} a question.`,
};

export default function AskPage() {
  return (
    <Chapter label="Ask" title="Say something" as="h1">
      <p className="mb-8 text-fg-2">
        Ask anything about me, my work, or this site. The answers come from what I&apos;ve written down here.
      </p>
      <AskForm />
    </Chapter>
  );
}
