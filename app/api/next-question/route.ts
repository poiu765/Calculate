import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestion } from "@/lib/questions";
import type { Deck, Question } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deck = (searchParams.get("deck") as Deck) ?? "A";
  const mode = searchParams.get("mode") ?? "all";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: dueItems } = await supabase
    .from("srs_items")
    .select("id, deck, op_type, prompt, correct_answer")
    .eq("user_id", user.id)
    .eq("deck", deck)
    .eq("status", "active")
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(1);

  if (dueItems && dueItems.length > 0) {
    const item = dueItems[0];
    const question: Question = {
      deck: item.deck,
      op_type: item.op_type,
      prompt: item.prompt,
      correct_answer: item.correct_answer,
      source: "srs",
      srs_item_id: item.id,
    };
    return NextResponse.json({ question });
  }

  if (mode === "due") {
    return NextResponse.json({ question: null });
  }

  const question = generateQuestion(deck);
  return NextResponse.json({ question });
}
