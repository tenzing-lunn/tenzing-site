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
      <h1 className="text-lg font-medium text-fg">Ask</h1>
      <div className="mt-10">
        <AskForm />
      </div>
    </section>
  );
}
