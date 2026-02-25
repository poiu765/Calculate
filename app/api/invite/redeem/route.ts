import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({ code: z.string().min(3) });

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invite, error } = await supabaseAdmin
    .from("invite_codes")
    .select("code, teacher_id, expires_at")
    .eq("code", parsed.data.code)
    .single();

  if (error || !invite) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ teacher_id: invite.teacher_id })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
