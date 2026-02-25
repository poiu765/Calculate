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

## 운영/테스트 메모

- `.env.local`가 없으면 Supabase 클라이언트가 초기화되지 않습니다.
- 보안/권한 라우트 가드는 현재 비활성화 상태입니다. (1차 완성본 이후 재활성화 예정)

## 1차 완성본 체크리스트

- [x] 로그인/회원가입 화면
- [x] 학생 대시보드 + 연습 흐름
- [x] 교사 대시보드 + 학생 상세
- [x] SRS 리스트/필터 + due 연습
- [x] SRS 생성/업데이트 로직
- [x] Supabase schema + RLS SQL
- [x] 기본 UI/UX 폴리시

## Project Structure

- `app/` — App Router pages and API routes
- `components/` — UI components (cards, keypad, etc.)
- `lib/` — Supabase clients, question generator, SRS logic
- `supabase.sql` — Schema + RLS policies
