-- Instructors (linked to Supabase auth)
create table if not exists public.instructors (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  department text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Semester schedule entries (recurring weekly)
create table if not exists public.schedule_entries (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  title text not null default '',
  section text not null,
  days text[] not null,
  start_time time not null,
  end_time time not null,
  room text not null,
  building text not null,
  instructor_name text not null,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table public.instructors enable row level security;
alter table public.schedule_entries enable row level security;

-- Anyone authenticated can read schedule
create policy "Authenticated users can read schedule"
  on public.schedule_entries for select
  to authenticated using (true);

-- Only admins can insert/update/delete schedule
create policy "Admins can manage schedule"
  on public.schedule_entries for all
  to authenticated
  using (
    exists (
      select 1 from public.instructors
      where id = auth.uid() and is_admin = true
    )
  );

-- Instructors can read all instructor profiles
create policy "Authenticated users can read instructors"
  on public.instructors for select
  to authenticated using (true);

-- Instructors can update their own profile
create policy "Instructors can update own profile"
  on public.instructors for update
  to authenticated using (auth.uid() = id);
