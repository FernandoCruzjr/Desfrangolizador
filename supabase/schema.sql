-- Desfrangolizador: um documento JSON por chave de cada usuário.
create table if not exists public.user_docs (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  key text not null check (char_length(key) between 1 and 80),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.user_docs enable row level security;
create policy "ler os próprios dados" on public.user_docs for select to authenticated using ((select auth.uid()) = user_id);
create policy "criar os próprios dados" on public.user_docs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "alterar os próprios dados" on public.user_docs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "apagar os próprios dados" on public.user_docs for delete to authenticated using ((select auth.uid()) = user_id);
create or replace function public.touch_user_docs() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger user_docs_touch before update on public.user_docs for each row execute function public.touch_user_docs();
revoke all on public.user_docs from anon;
grant select, insert, update, delete on public.user_docs to authenticated;
