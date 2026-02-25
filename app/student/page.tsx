import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/Card";
import { Stat } from "@/components/Stat";
import { InviteRedeem } from "@/components/InviteRedeem";

export default async function StudentPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: attempts } = await supabase
    .from("attempts")
    .select("is_correct, created_at, time_ms")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const totalAttempts = attempts?.length ?? 0;
  const correctAttempts = attempts?.filter((a) => a.is_correct).length ?? 0;
  const accuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const now = Date.now();
  const last7 = attempts?.filter((a) => {
    const t = new Date(a.created_at).getTime();
    return now - t <= 7 * 24 * 60 * 60 * 1000;
  });
  const last7Count = last7?.length ?? 0;
  const avgTime =
    attempts && attempts.length
      ? Math.round(attempts.reduce((acc, cur) => acc + cur.time_ms, 0) / attempts.length)
      : 0;

  const { data: dueItems } = await supabase
    .from("srs_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .lte("due_at", new Date().toISOString());

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <p className="text-sm text-black/70">
          Choose a deck, start practicing, or review your due items.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Stat label="Total attempts" value={totalAttempts} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Due reviews" value={dueItems?.length ?? 0} />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Stat label="Avg time (ms)" value={avgTime || "--"} />
        <Stat label="Last 7 days" value={last7Count} />
        <Stat label="Active decks" value="A + B" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60">
            <span className="h-2 w-2 rounded-full bg-accent-yellow" />
            Deck A
          </div>
          <h2 className="text-lg font-semibold">3-digit addition/subtraction</h2>
          <p className="text-sm text-black/70">3-digit addition and subtraction.</p>
          <div className="flex gap-2">
            <Link
              href="/practice?deck=A"
              className="rounded-md bg-accent-yellow px-4 py-2 text-sm font-semibold"
            >
              Start Practice
            </Link>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60">
            <span className="h-2 w-2 rounded-full bg-accent-green" />
            Deck B
          </div>
          <h2 className="text-lg font-semibold">2-digit multiply/divide</h2>
          <p className="text-sm text-black/70">2-digit multiplication and division.</p>
          <div className="flex gap-2">
            <Link
              href="/practice?deck=B"
              className="rounded-md bg-accent-green px-4 py-2 text-sm font-semibold"
            >
              Start Practice
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Spaced repetition</h2>
          <p className="text-sm text-black/70">Review active and graduated items.</p>
          <Link
            href="/student/srs"
            className="rounded-md border border-black px-4 py-2 text-sm font-semibold"
          >
            View SRS list
          </Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Link to teacher</h2>
          <InviteRedeem />
        </Card>
      </section>
    </main>
  );
}
