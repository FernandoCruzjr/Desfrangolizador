-- Comunidade do Desfrangolizador (estado atual do banco).
-- Rode depois de schema.sql. Troque o id do moderador no final.

create schema if not exists app;
revoke all on schema app from public, anon;
grant usage on schema app to authenticated;

create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
create policy "ver admins" on public.admins for select to authenticated using (true);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_.]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  bio text not null default '' check (char_length(bio) <= 160),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 500),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "perfis visíveis para quem tem conta" on public.profiles for select to authenticated using (true);
create policy "criar o próprio perfil" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "editar o próprio perfil" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "apagar o próprio perfil" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create table public.blocks (
  blocker uuid not null default auth.uid() references auth.users(id) on delete cascade,
  blocked uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);
create index blocks_blocked_idx on public.blocks (blocked);
alter table public.blocks enable row level security;
create policy "ver meus bloqueios" on public.blocks for select to authenticated using ((select auth.uid()) = blocker);
create policy "bloquear" on public.blocks for insert to authenticated with check ((select auth.uid()) = blocker);
create policy "desbloquear" on public.blocks for delete to authenticated using ((select auth.uid()) = blocker);

-- Funções auxiliares fora do schema público (não aparecem na API).
create or replace function app.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;
create or replace function app.blocked_between(a uuid, b uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.blocks x where (x.blocker = a and x.blocked = b) or (x.blocker = b and x.blocked = a));
$$;
revoke all on function app.is_admin() from public, anon;
revoke all on function app.blocked_between(uuid, uuid) from public, anon;
grant execute on function app.is_admin() to authenticated;
grant execute on function app.blocked_between(uuid, uuid) to authenticated;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  kind text not null default 'text' check (kind in ('text','photo','run','workout')),
  body text not null default '' check (char_length(body) <= 600),
  data jsonb check (data is null or pg_column_size(data) <= 20000),
  image_url text check (image_url is null or char_length(image_url) <= 500),
  created_at timestamptz not null default now()
);
create index posts_created_idx on public.posts (created_at desc);
create index posts_user_idx on public.posts (user_id, created_at desc);
alter table public.posts enable row level security;
create policy "ver posts" on public.posts for select to authenticated using (not app.blocked_between((select auth.uid()), user_id));
create policy "postar" on public.posts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "editar meu post" on public.posts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "apagar meu post ou moderar" on public.posts for delete to authenticated using ((select auth.uid()) = user_id or app.is_admin());

create table public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index likes_user_idx on public.likes (user_id);
alter table public.likes enable row level security;
create policy "ver curtidas" on public.likes for select to authenticated using (true);
create policy "curtir" on public.likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "descurtir" on public.likes for delete to authenticated using ((select auth.uid()) = user_id);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 300),
  created_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at);
create index comments_user_idx on public.comments (user_id);
alter table public.comments enable row level security;
create policy "ver comentários" on public.comments for select to authenticated using (not app.blocked_between((select auth.uid()), user_id));
create policy "comentar" on public.comments for insert to authenticated with check ((select auth.uid()) = user_id and not exists (select 1 from public.posts p where p.id = post_id and app.blocked_between((select auth.uid()), p.user_id)));
create policy "apagar comentário (meu, no meu post ou moderação)" on public.comments for delete to authenticated using ((select auth.uid()) = user_id or app.is_admin() or exists (select 1 from public.posts p where p.id = post_id and p.user_id = (select auth.uid())));

create table public.follows (
  follower uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  followee uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, followee),
  check (follower <> followee)
);
create index follows_followee_idx on public.follows (followee);
alter table public.follows enable row level security;
create policy "ver seguidores" on public.follows for select to authenticated using (true);
create policy "seguir" on public.follows for insert to authenticated with check ((select auth.uid()) = follower and not app.blocked_between(follower, followee));
create policy "deixar de seguir" on public.follows for delete to authenticated using ((select auth.uid()) = follower);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null default auth.uid() references auth.users(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reported_user uuid references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 300),
  status text not null default 'aberta' check (status in ('aberta','resolvida')),
  created_at timestamptz not null default now()
);
create index reports_reporter_idx on public.reports (reporter);
create index reports_post_idx on public.reports (post_id);
create index reports_comment_idx on public.reports (comment_id);
create index reports_user_idx on public.reports (reported_user);
alter table public.reports enable row level security;
create policy "denunciar" on public.reports for insert to authenticated with check ((select auth.uid()) = reporter);
create policy "moderador vê denúncias" on public.reports for select to authenticated using (app.is_admin() or (select auth.uid()) = reporter);
create policy "moderador resolve" on public.reports for update to authenticated using (app.is_admin()) with check (app.is_admin());

-- Bloquear desfaz o "seguir" nos dois sentidos.
create or replace function public.on_block() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from public.follows where (follower = new.blocker and followee = new.blocked) or (follower = new.blocked and followee = new.blocker);
  return new;
end; $$;
revoke all on function public.on_block() from public, anon, authenticated;
create trigger blocks_after_insert after insert on public.blocks for each row execute function public.on_block();

revoke all on public.profiles, public.posts, public.likes, public.comments, public.follows, public.blocks, public.reports, public.admins from anon;
grant select, insert, update, delete on public.profiles, public.posts, public.likes, public.comments, public.follows, public.blocks to authenticated;
grant select, insert, update on public.reports to authenticated;
grant select on public.admins to authenticated;

-- Fotos dos posts e avatares: leitura pública, cada pessoa só grava na própria pasta.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "media: enviar na própria pasta" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "media: atualizar na própria pasta" on storage.objects for update to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "media: ver a própria pasta" on storage.objects for select to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "media: apagar na própria pasta" on storage.objects for delete to authenticated using (bucket_id = 'media' and ((storage.foldername(name))[1] = (select auth.uid())::text or app.is_admin()));

-- Moderador (troque pelo id da sua conta em Authentication > Users).
insert into public.admins (user_id) values ('00000000-0000-0000-0000-000000000000');
