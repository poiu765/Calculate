# Arithmetic Automation Trainer (MVP)

Next.js (App Router) + TypeScript + TailwindCSS + Supabase (Auth + Postgres + RLS)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in your Supabase project values.

3. Apply the database schema + RLS:

- Open Supabase SQL editor
- Run the contents of `supabase.sql`

4. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Auth and Roles

- Go to `/login`
- Sign up a Teacher account and a Student account
- Teachers can generate invite codes on `/teacher`
- Students redeem invite codes on `/student` to link to a teacher

## RLS Quick Test

1. Sign in as Student and create attempts (practice page).
2. In Supabase SQL editor, impersonate the student with:

```sql
select * from attempts; -- should show only own
```

3. Sign in as Teacher and open `/teacher`. You should see only your linked students.
4. Try querying a student not linked to you in the API; results should be empty due to RLS.

## Notes

- SRS is stored in `srs_items`.
- Due items are served first; if none are due, new problems are generated.
- New questions only create SRS items when wrong or too slow.

## Project Structure

- `app/` — App Router pages and API routes
- `components/` — UI components (cards, keypad, etc.)
- `lib/` — Supabase clients, question generator, SRS logic
- `supabase.sql` — Schema + RLS policies
