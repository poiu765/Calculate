"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/Card";
import { Keypad } from "@/components/Keypad";
import type { Question } from "@/lib/types";
import { getTargetMs } from "@/lib/questions";

export default function PracticePage() {
  const searchParams = useSearchParams();
  const deck = (searchParams.get("deck") as "A" | "B") ?? "A";
  const mode = searchParams.get("mode") ?? "all";
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  const targetMs = useMemo(() => getTargetMs(deck), [deck]);

  async function loadQuestion() {
    setLoading(true);
    setStatus("idle");
    setAnswer("");
    const res = await fetch(`/api/next-question?deck=${deck}&mode=${mode}`);
    const data = await res.json();
    setQuestion(data.question ?? null);
    setLoading(false);
    setStartTime(performance.now());
  }

  async function handleSubmit() {
    if (!question || startTime === null) return;
    const timeMs = Math.max(0, Math.round(performance.now() - startTime));

    const res = await fetch("/api/submit-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...question,
        user_answer: answer,
        time_ms: timeMs,
      }),
    });

    const data = await res.json();
    if (data.is_correct) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }

    setTimeout(() => {
      loadQuestion();
    }, 500);
  }

  useEffect(() => {
    loadQuestion();
  }, [deck, mode]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (loading || status !== "idle") return;
      if (event.key === "Enter") {
        handleSubmit();
        return;
      }
      if (event.key === "Backspace") {
        setAnswer((prev) => prev.slice(0, -1));
        return;
      }
      if (event.key === "-" || /[0-9]/.test(event.key)) {
        setAnswer((prev) => prev + event.key);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loading, status, answer, question, startTime]);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Practice Deck {deck}</h1>
        <p className="text-sm text-black/70">
          Target time: {targetMs} ms. Mode: {mode === "due" ? "Due only" : "All"}.
        </p>
      </header>

      <Card className="space-y-4">
        {loading ? (
          <p className="text-sm text-black/70">Loading question...</p>
        ) : question ? (
          <>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-black/50">
              <span className="rounded-full bg-accent-yellow px-2 py-1">Deck {deck}</span>
              <span className="rounded-full bg-accent-green px-2 py-1">{question.op_type}</span>
            </div>
            <p className="text-3xl font-semibold">{question.prompt}</p>
            <input
              className="w-full rounded-md border border-black/20 px-3 py-2 text-lg"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type your answer"
            />
            {status === "correct" && (
              <p className="text-sm font-semibold text-black">
                Correct. Nice speed.
              </p>
            )}
            {status === "wrong" && (
              <p className="text-sm font-semibold text-black">
                Logged. Keep going.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-black/70">No question available.</p>
        )}
      </Card>

      <Keypad value={answer} onChange={setAnswer} onSubmit={handleSubmit} />
    </main>
  );
}
