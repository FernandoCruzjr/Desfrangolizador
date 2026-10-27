-- Stories (24 h) e posts "Resumo do dia" da Comunidade.
-- Rode depois de community.sql.

-- Posts do tipo "Resumo do dia".
alter table public.posts drop constraint posts_kind_check;
alter table public.posts add constraint posts_kind_check check (kind in ('text','photo','run','workout','meal','day'));

-- Stories: somem do app 24 h depois de postados.
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  kind text not null default 'photo' check (kind in ('photo','text','day')),
  body text not null default '' check (char_length(body) <= 200),
  bg smallint not null default 0 check (bg between 0 and 7),
  data jsonb check (data is null or pg_column_size(data) <= 8000),
  image_url text check (image_url is null or char_length(image_url) <= 500),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours'
);
create index stories_live_idx on public.stories (expires_at desc);
create index stories_user_idx on public.stories (user_id, created_at);
alter table public.stories enable row level security;
create policy "ver stories" on public.stories for select to authenticated using ((select auth.uid()) = user_id or (expires_at > now() and not app.blocked_between((select auth.uid()), user_id)));
create policy "postar story" on public.stories for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "apagar meu story ou moderar" on public.stories for delete to authenticated using ((select auth.uid()) = user_id or app.is_admin());

-- O prazo é sempre 24 h a partir de agora (ninguém estica o story) e stories vencidos há 2 dias saem do banco.
create or replace function public.on_story_insert() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.created_at := now();
  new.expires_at := now() + interval '24 hours';
  delete from public.stories where expires_at < now() - interval '2 days';
  return new;
end; $$;
revoke all on function public.on_story_insert() from public, anon, authenticated;
create trigger stories_before_insert before insert on public.stories for each row execute function public.on_story_insert();

-- Quem viu cada story (só o dono do story vê a lista).
create table public.story_views (
  story_id uuid not null references public.stories(id) on delete cascade,
  viewer uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, viewer)
);
create index story_views_viewer_idx on public.story_views (viewer);
alter table public.story_views enable row level security;
create policy "ver visualizações" on public.story_views for select to authenticated using ((select auth.uid()) = viewer or exists (select 1 from public.stories s where s.id = story_id and s.user_id = (select auth.uid())));
create policy "marcar visto" on public.story_views for insert to authenticated with check ((select auth.uid()) = viewer and exists (select 1 from public.stories s where s.id = story_id and s.expires_at > now() and not app.blocked_between((select auth.uid()), s.user_id)));

-- Denunciar story.
alter table public.reports add column story_id uuid references public.stories(id) on delete cascade;
create index reports_story_idx on public.reports (story_id);

revoke all on public.stories, public.story_views from anon;
grant select, insert, delete on public.stories to authenticated;
grant select, insert on public.story_views to authenticated;
