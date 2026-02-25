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

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <p className="text-sm text-black/70">Create invite codes and track students.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Invite codes</h2>
          <InviteManager />
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Linked students</h2>
          <div className="space-y-2">
            {students?.length ? (
              students.map((student) => (
                <Link
                  key={student.id}
                  href={`/teacher/student/${student.id}`}
                  className="flex items-center justify-between rounded-md border border-black/10 px-3 py-2 text-sm"
                >
                  <span>{student.display_name || "Unnamed"}</span>
                  <span className="text-xs text-black/60">Details</span>
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
