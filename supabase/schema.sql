-- Run this file in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  code text not null,
  language text not null default 'text',
  tags text[] not null default '{}',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.snippets enable row level security;

drop policy if exists "Users can view own snippets" on public.snippets;
create policy "Users can view own snippets"
on public.snippets for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own snippets" on public.snippets;
create policy "Users can insert own snippets"
on public.snippets for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own snippets" on public.snippets;
create policy "Users can update own snippets"
on public.snippets for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own snippets" on public.snippets;
create policy "Users can delete own snippets"
on public.snippets for delete
using (auth.uid() = user_id);

create index if not exists snippets_user_id_idx on public.snippets(user_id);
create index if not exists snippets_created_at_idx on public.snippets(created_at desc);
