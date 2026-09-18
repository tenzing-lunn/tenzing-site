import type { Metadata } from "next";
import { AskForm } from "@/components/ask-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Ask",
  description: `Ask ${site.firstName} a question.`,
};

export default function AskPage() {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold leading-tight text-fg">Ask</h1>
      <div className="mt-10">
        <AskForm />
      </div>
    </section>
  );
}
