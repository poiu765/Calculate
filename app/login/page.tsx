"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function LoginPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "sign-in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) setError(signInError.message);
      else setMessage("Signed in. You can navigate to your dashboard.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        display_name: displayName,
      });
      if (profileError) {
        setError(profileError.message);
      } else {
        setMessage("Account created. Please sign in.");
        setMode("sign-in");
      }
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-black/70">
          Sign in or create a new account to start training.
        </p>
      </header>

      <Card>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("sign-in")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              mode === "sign-in" ? "bg-accent-yellow" : "bg-black/5"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("sign-up")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              mode === "sign-up" ? "bg-accent-green" : "bg-black/5"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "sign-up" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide">
                Display name
              </label>
              <input
                className="w-full rounded-md border border-black/20 px-3 py-2 text-sm"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-black/20 px-3 py-2 text-sm"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-black/20 px-3 py-2 text-sm"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {mode === "sign-up" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide">Role</label>
              <select
                className="w-full rounded-md border border-black/20 px-3 py-2 text-sm"
                value={role}
                onChange={(event) => setRole(event.target.value as "student" | "teacher")}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
