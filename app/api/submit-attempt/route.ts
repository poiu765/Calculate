import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getTargetMs } from "@/lib/questions";
import { getIntervalForStreak, getLowerIntervalForStreak, shouldGraduate } from "@/lib/srs";
import type { Deck } from "@/lib/types";

const payloadSchema = z.object({
  deck: z.enum(["A", "B"]),
  op_type: z.enum(["add", "sub", "mul", "div"]),
  prompt: z.string(),
  correct_answer: z.string(),
  user_answer: z.string(),
  time_ms: z.number().int().nonnegative(),
  source: z.enum(["srs", "new"]),
  srs_item_id: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = parsed.data;
  const isCorrect = payload.user_answer.trim() === payload.correct_answer.trim();
  const targetMs = getTargetMs(payload.deck);

  const { error: attemptError } = await supabase.from("attempts").insert({
    user_id: user.id,
    deck: payload.deck,
    op_type: payload.op_type,
    prompt: payload.prompt,
    correct_answer: payload.correct_answer,
    user_answer: payload.user_answer,
    is_correct: isCorrect,
    time_ms: payload.time_ms,
  });

  if (attemptError) {
    return NextResponse.json({ error: attemptError.message }, { status: 500 });
  }

  if (payload.source === "srs" && payload.srs_item_id) {
    const { data: item } = await supabase
      .from("srs_items")
      .select("streak, interval_days, ease, wrong_count, deck")
      .eq("id", payload.srs_item_id)
      .single();

    if (!item) {
      return NextResponse.json({ is_correct: isCorrect });
    }

    let streak = item.streak ?? 0;
    let interval = item.interval_days ?? 0;
    let ease = Number(item.ease ?? 2.0);
    let wrongCount = item.wrong_count ?? 0;

    const now = new Date();

    if (isCorrect && payload.time_ms <= targetMs) {
      streak += 1;
      interval = getIntervalForStreak(streak);
      ease = Math.min(ease + 0.05, 2.5);
    } else if (isCorrect) {
      // We choose to increment streak, but apply a lower interval step for slow answers.
      streak += 1;
      interval = getLowerIntervalForStreak(streak);
    } else {
      streak = 0;
      interval = 0;
      wrongCount += 1;
    }

    const dueAt = isCorrect
      ? new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 10 * 60 * 1000);

    let status: "active" | "graduated" = "active";

    if (isCorrect && streak >= 5) {
      const { data: recent } = await supabase
        .from("attempts")
        .select("time_ms, is_correct")
        .eq("user_id", user.id)
        .eq("prompt", payload.prompt)
        .eq("is_correct", true)
        .order("created_at", { ascending: false })
        .limit(3);

      const avg =
        recent && recent.length === 3
          ? Math.round(recent.reduce((acc, cur) => acc + cur.time_ms, 0) / 3)
          : null;

      if (shouldGraduate(streak, avg, payload.deck as Deck)) {
        status = "graduated";
      }
    }

    const { error: updateError } = await supabase
      .from("srs_items")
      .update({
        streak,
        interval_days: interval,
        ease,
        wrong_count: wrongCount,
        due_at: dueAt.toISOString(),
        status,
        last_time_ms: payload.time_ms,
        updated_at: now.toISOString(),
      })
      .eq("id", payload.srs_item_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ is_correct: isCorrect });
  }

  const shouldCreate = !isCorrect || payload.time_ms > targetMs;

  if (shouldCreate) {
    const now = new Date();
    const interval = isCorrect ? 1 : 0;
    const dueAt = isCorrect
      ? new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 10 * 60 * 1000);

    await supabase.from("srs_items").insert({
      user_id: user.id,
      deck: payload.deck,
      op_type: payload.op_type,
      prompt: payload.prompt,
      correct_answer: payload.correct_answer,
      due_at: dueAt.toISOString(),
      interval_days: interval,
      ease: 2.0,
      streak: isCorrect ? 1 : 0,
      status: "active",
      last_time_ms: payload.time_ms,
      wrong_count: isCorrect ? 0 : 1,
    });
  }

  return NextResponse.json({ is_correct: isCorrect });
}
