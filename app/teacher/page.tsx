import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/Card";
import { InviteManager } from "@/components/InviteManager";

export default async function TeacherPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: students } = await supabase
    .from("profiles")
    .select("id, display_name, created_at")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const studentIds = students?.map((s) => s.id) ?? [];
  const { data: attempts } =
    studentIds.length > 0
      ? await supabase
          .from("attempts")
          .select("user_id, is_correct, time_ms, created_at")
          .in("user_id", studentIds)
          .order("created_at", { ascending: false })
          .limit(300)
      : { data: [] };

  const totalAttempts = attempts?.length ?? 0;
  const correctAttempts = attempts?.filter((a) => a.is_correct).length ?? 0;
  const accuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const avgTime =
    attempts && attempts.length
      ? Math.round(attempts.reduce((acc, cur) => acc + cur.time_ms, 0) / attempts.length)
      : 0;
  const now = Date.now();
  const last7 = attempts?.filter((a) => now - new Date(a.created_at).getTime() <= 604800000)
    .length;

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <p className="text-sm text-black/70">Create invite codes and track students.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs text-black/60">Linked students</p>
          <p className="text-2xl font-semibold">{students?.length ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-black/60">Overall accuracy</p>
          <p className="text-2xl font-semibold">{accuracy}%</p>
        </Card>
        <Card>
          <p className="text-xs text-black/60">Avg time (ms)</p>
          <p className="text-2xl font-semibold">{avgTime || "--"}</p>
          <p className="text-xs text-black/50">Last 7 days: {last7 ?? 0} attempts</p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60">
            <span className="h-2 w-2 rounded-full bg-accent-yellow" />
            Invite codes
          </div>
          <InviteManager />
        </Card>
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60">
            <span className="h-2 w-2 rounded-full bg-accent-green" />
            Linked students
          </div>
          <div className="space-y-2">
            {students?.length ? (
              students.map((student) => (
                <Link
                  key={student.id}
                  href={`/teacher/student/${student.id}`}
                  className="flex items-center justify-between rounded-md border border-black/10 px-3 py-2 text-sm"
                >
                  <span>{student.display_name || "Unnamed"}</span>
                  <span className="rounded-full bg-black/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black/60">
                    View
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-black/60">No linked students yet.</p>
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
