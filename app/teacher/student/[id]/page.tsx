import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/Card";

export default async function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const studentId = params.id;

  const { data: student } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", studentId)
    .single();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("deck, op_type, is_correct, time_ms, created_at")
    .eq("user_id", studentId)
    .order("created_at", { ascending: false })
    .limit(100);

  const total = attempts?.length ?? 0;
  const correct = attempts?.filter((a) => a.is_correct).length ?? 0;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const avgTime =
    attempts && attempts.length
      ? Math.round(attempts.reduce((acc, cur) => acc + cur.time_ms, 0) / attempts.length)
      : 0;
  const now = Date.now();
  const last7 = attempts?.filter((a) => now - new Date(a.created_at).getTime() <= 604800000)
    .length;

  const deckA = attempts?.filter((a) => a.deck === "A") ?? [];
  const deckB = attempts?.filter((a) => a.deck === "B") ?? [];

  const wrongByOp: Record<string, number> = {};
  attempts?.forEach((a) => {
    if (!a.is_correct) {
      wrongByOp[a.op_type] = (wrongByOp[a.op_type] || 0) + 1;
    }
  });

  const slowAttempts = attempts
    ?.filter((a) => a.is_correct)
    .sort((a, b) => b.time_ms - a.time_ms)
    .slice(0, 3);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <Link href="/teacher" className="text-xs font-semibold uppercase tracking-wide">
          Back to teacher
        </Link>
        <h1 className="text-2xl font-semibold">
          {student?.display_name || "Student"}
        </h1>
        <p className="text-sm text-black/70">Recent performance snapshot.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs text-black/60">Total attempts</p>
          <p className="text-2xl font-semibold">{total}</p>
        </Card>
        <Card>
          <p className="text-xs text-black/60">Accuracy</p>
          <p className="text-2xl font-semibold">{accuracy}%</p>
        </Card>
        <Card>
          <p className="text-xs text-black/60">Deck split</p>
          <p className="text-sm">Deck A: {deckA.length}</p>
          <p className="text-sm">Deck B: {deckB.length}</p>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs text-black/60">Avg time (ms)</p>
          <p className="text-2xl font-semibold">{avgTime || "--"}</p>
        </Card>
        <Card>
          <p className="text-xs text-black/60">Last 7 days</p>
          <p className="text-2xl font-semibold">{last7 ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-black/60">Most recent</p>
          <p className="text-sm text-black/70">
            {attempts?.[0]
              ? new Date(attempts[0].created_at).toLocaleString()
              : "No attempts"}
          </p>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold">Top wrong op types</h2>
          {Object.keys(wrongByOp).length ? (
            Object.entries(wrongByOp)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([op, count]) => (
                <p key={op} className="text-sm">
                  {op}: {count}
                </p>
              ))
          ) : (
            <p className="text-sm text-black/60">No wrong attempts yet.</p>
          )}
        </Card>
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold">Recent attempts</h2>
          <div className="space-y-1 text-xs">
            {attempts?.slice(0, 8).map((attempt, index) => (
              <p key={index}>
                {attempt.deck} {attempt.op_type} • {attempt.is_correct ? "✅" : "❌"} •
                {attempt.time_ms} ms
              </p>
            ))}
            {!attempts?.length && <p className="text-black/60">No attempts yet.</p>}
          </div>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold">Slowest correct (ms)</h2>
          {slowAttempts?.length ? (
            slowAttempts.map((attempt, idx) => (
              <p key={idx} className="text-sm text-black/70">
                {attempt.op_type} • {attempt.time_ms} ms
              </p>
            ))
          ) : (
            <p className="text-sm text-black/60">No correct attempts yet.</p>
          )}
        </Card>
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold">Focus suggestion</h2>
          <p className="text-sm text-black/70">
            Target the op type with the most wrongs and repeat 10 fast reps.
          </p>
        </Card>
      </section>
    </main>
  );
}
