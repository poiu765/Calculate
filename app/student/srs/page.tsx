import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/Card";

export default async function SrsPage({
  searchParams,
}: {
  searchParams: { deck?: string; show?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const deck = searchParams.deck === "B" ? "B" : searchParams.deck === "A" ? "A" : "all";
  const show = searchParams.show === "all" ? "all" : "active";

  let query = supabase
    .from("srs_items")
    .select("id, deck, op_type, prompt, status, due_at, streak, wrong_count")
    .eq("user_id", user.id)
    .order("due_at", { ascending: true });

  if (deck !== "all") query = query.eq("deck", deck);
  if (show === "active") query = query.eq("status", "active");

  const { data: items } = await query;

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">SRS Items</h1>
        <p className="text-sm text-black/70">Filter your active and graduated items.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/student/srs?deck=all&show=${show}`}
          className="rounded-full border border-black px-3 py-1 text-xs font-semibold"
        >
          All decks
        </Link>
        <Link
          href={`/student/srs?deck=A&show=${show}`}
          className="rounded-full border border-black px-3 py-1 text-xs font-semibold"
        >
          Deck A
        </Link>
        <Link
          href={`/student/srs?deck=B&show=${show}`}
          className="rounded-full border border-black px-3 py-1 text-xs font-semibold"
        >
          Deck B
        </Link>
        <Link
          href={`/student/srs?deck=${deck}&show=active`}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            show === "active" ? "bg-accent-yellow" : "border border-black"
          }`}
        >
          Active only
        </Link>
        <Link
          href={`/student/srs?deck=${deck}&show=all`}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            show === "all" ? "bg-accent-green" : "border border-black"
          }`}
        >
          Include graduated
        </Link>
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Start due reviews</h2>
        <p className="text-sm text-black/70">
          Practice only the items that are due now.
        </p>
        <Link
          href={`/practice?deck=${deck === "all" ? "A" : deck}&mode=due`}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Start due reviews
        </Link>
      </Card>

      <div className="grid gap-3">
        {items?.length ? (
          items.map((item) => (
            <Card key={item.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-accent-yellow px-2 py-1">Deck {item.deck}</span>
                <span className="rounded-full bg-accent-green px-2 py-1">{item.op_type}</span>
                <span className="text-black/60">{item.status}</span>
              </div>
              <p className="text-lg font-semibold">{item.prompt}</p>
              <p className="text-xs text-black/60">
                Due: {new Date(item.due_at).toLocaleString()} • Streak: {item.streak} •
                Wrong: {item.wrong_count}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-sm text-black/70">No items yet.</p>
        )}
      </div>
    </main>
  );
}
