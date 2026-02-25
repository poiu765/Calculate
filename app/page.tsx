import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="inline-flex items-center rounded-full bg-accent-yellow px-3 py-1 text-xs font-semibold tracking-wide">
          MVP
        </p>
        <h1 className="text-3xl font-semibold">Arithmetic Automation Trainer</h1>
        <p className="text-sm text-black/70">
          Train fast, accurate arithmetic and track progress with spaced repetition.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-4 text-sm shadow-soft">
          <p className="text-xs uppercase tracking-wide text-black/60">Deck A</p>
          <p className="font-semibold">3-digit add/sub</p>
        </div>
        <div className="rounded-xl border border-black/10 p-4 text-sm shadow-soft">
          <p className="text-xs uppercase tracking-wide text-black/60">Deck B</p>
          <p className="font-semibold">2-digit mul/div</p>
        </div>
        <div className="rounded-xl border border-black/10 p-4 text-sm shadow-soft">
          <p className="text-xs uppercase tracking-wide text-black/60">SRS</p>
          <p className="font-semibold">Review what you miss</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-soft"
        >
          Sign in / Sign up
        </Link>
        <Link
          href="/student"
          className="rounded-md border border-black px-4 py-2 text-sm font-semibold"
        >
          Student
        </Link>
        <Link
          href="/teacher"
          className="rounded-md border border-black px-4 py-2 text-sm font-semibold"
        >
          Teacher
        </Link>
      </div>
    </main>
  );
}
