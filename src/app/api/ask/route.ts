import { NextResponse } from "next/server";
import { ask, MAX_QUESTION_LENGTH } from "@/lib/ask";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const question =
    typeof body === "object" && body !== null && "question" in body
      ? String((body as { question: unknown }).question ?? "").trim()
      : "";

  if (!question) {
    return NextResponse.json({ error: "Ask something first." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 },
    );
  }

  try {
    const answer = await ask(question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[api/ask]", err);
    return NextResponse.json({ error: "Couldn't answer right now." }, { status: 500 });
  }
}
