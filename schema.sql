-- Run this script in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  course text not null,
  experience text,
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.applications enable row level security;

-- SECURITY DEFINER helper avoids recursive profile-table RLS checks.
create or replace function public.is_krevian_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_krevian_admin() to authenticated;

drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Admins read all profiles" on public.profiles;
drop policy if exists "Anyone can submit an application" on public.applications;
drop policy if exists "Admins read applications" on public.applications;
drop policy if exists "Admins update applications" on public.applications;

create policy "Users read own profile or admins read all"
on public.profiles for select to authenticated
using (auth.uid() = id or public.is_krevian_admin());

-- New users may only create student profiles; role elevation must be done by trusted admin SQL.
create policy "Users create own student profile"
on public.profiles for insert to authenticated
with check (auth.uid() = id and role = 'student');

create policy "Users update own basic profile"
on public.profiles for update to authenticated
using (auth.uid() = id or public.is_krevian_admin())
with check (auth.uid() = id or public.is_krevian_admin());

create policy "Anyone can submit pending application"
on public.applications for insert to anon, authenticated
with check (status = 'pending');

create policy "Applicant reads own applications or admin reads all"
on public.applications for select to authenticated
using (lower(email) = lower(auth.jwt()->>'email') or public.is_krevian_admin());

create policy "Admins update applications"
on public.applications for update to authenticated
using (public.is_krevian_admin())
with check (public.is_krevian_admin());

-- Promote your own registered account to administrator after confirming the email:
-- update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';
