-- DP MODULE Sales: Supabase schema + Row Level Security
-- Run this script in Supabase Dashboard -> SQL Editor.
-- It creates user-owned quotes and clients. Each signed-in manager can read/write ONLY their own rows.

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quote_number text not null unique,
  kind text not null,
  client jsonb not null default '{}'::jsonb,
  project text not null default '',
  base numeric not null default 0,
  items jsonb not null default '[]'::jsonb,
  manual_items jsonb not null default '[]'::jsonb,
  external jsonb not null default '{}'::jsonb,
  total numeric not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  city text not null default '',
  address text not null default '',
  created_at timestamptz not null default now()
);

alter table public.quotes enable row level security;
alter table public.clients enable row level security;

revoke all on table public.quotes from anon;
revoke all on table public.clients from anon;
grant select, insert, update, delete on table public.quotes to authenticated;
grant select, insert, update, delete on table public.clients to authenticated;

-- Re-runnable policies: remove existing policies first.
drop policy if exists "quotes_select_own" on public.quotes;
drop policy if exists "quotes_insert_own" on public.quotes;
drop policy if exists "quotes_update_own" on public.quotes;
drop policy if exists "quotes_delete_own" on public.quotes;
drop policy if exists "clients_select_own" on public.clients;
drop policy if exists "clients_insert_own" on public.clients;
drop policy if exists "clients_update_own" on public.clients;
drop policy if exists "clients_delete_own" on public.clients;

create policy "quotes_select_own" on public.quotes
  for select to authenticated
  using (auth.uid() = user_id);

create policy "quotes_insert_own" on public.quotes
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "quotes_update_own" on public.quotes
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quotes_delete_own" on public.quotes
  for delete to authenticated
  using (auth.uid() = user_id);

create policy "clients_select_own" on public.clients
  for select to authenticated
  using (auth.uid() = user_id);

create policy "clients_insert_own" on public.clients
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "clients_update_own" on public.clients
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "clients_delete_own" on public.clients
  for delete to authenticated
  using (auth.uid() = user_id);
