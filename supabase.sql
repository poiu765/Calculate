-- Enable extensions
create extension if not exists "pgcrypto";

-- Enums
create type role_type as enum ('student', 'teacher');
create type deck_type as enum ('A', 'B');
create type op_type as enum ('add', 'sub', 'mul', 'div');
create type srs_status as enum ('active', 'graduated');

-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_type not null,
  display_name text,
  teacher_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Invite codes
create table if not exists invite_codes (
  code text primary key,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- Attempts
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deck deck_type not null,
  op_type op_type not null,
  prompt text not null,
  correct_answer text not null,
  user_answer text not null,
  is_correct boolean not null,
  time_ms int not null,
  created_at timestamptz not null default now()
);

-- SRS items
create table if not exists srs_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deck deck_type not null,
  op_type op_type not null,
  prompt text not null,
  correct_answer text not null,
  due_at timestamptz not null,
  interval_days int not null default 0,
  ease numeric not null default 2.0,
  streak int not null default 0,
  status srs_status not null default 'active',
  last_time_ms int,
  wrong_count int not null default 0,
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists attempts_user_created_idx on attempts (user_id, created_at desc);
create index if not exists srs_items_user_due_idx on srs_items (user_id, due_at);
create index if not exists srs_items_user_status_idx on srs_items (user_id, status);

-- RLS
alter table profiles enable row level security;
alter table invite_codes enable row level security;
alter table attempts enable row level security;
alter table srs_items enable row level security;

-- Profiles policies
create policy "profiles_select_own" on profiles
  for select using (id = auth.uid());

create policy "profiles_insert_own" on profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

create policy "profiles_select_students_for_teacher" on profiles
  for select using (
    teacher_id = auth.uid()
    and exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'teacher'
    )
  );

-- Invite codes policies (teachers manage their own codes)
create policy "invite_codes_teacher_select" on invite_codes
  for select using (teacher_id = auth.uid());

create policy "invite_codes_teacher_insert" on invite_codes
  for insert with check (teacher_id = auth.uid());

create policy "invite_codes_teacher_update" on invite_codes
  for update using (teacher_id = auth.uid());

create policy "invite_codes_teacher_delete" on invite_codes
  for delete using (teacher_id = auth.uid());

-- Attempts policies
create policy "attempts_select_own" on attempts
  for select using (user_id = auth.uid());

create policy "attempts_insert_own" on attempts
  for insert with check (user_id = auth.uid());

create policy "attempts_select_for_teacher" on attempts
  for select using (
    exists (
      select 1 from profiles p
      where p.id = attempts.user_id
        and p.teacher_id = auth.uid()
    )
  );

-- SRS items policies
create policy "srs_select_own" on srs_items
  for select using (user_id = auth.uid());

create policy "srs_insert_own" on srs_items
  for insert with check (user_id = auth.uid());

create policy "srs_update_own" on srs_items
  for update using (user_id = auth.uid());

create policy "srs_select_for_teacher" on srs_items
  for select using (
    exists (
      select 1 from profiles p
      where p.id = srs_items.user_id
        and p.teacher_id = auth.uid()
    )
  );
