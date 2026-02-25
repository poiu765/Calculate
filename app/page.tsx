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

      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
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
