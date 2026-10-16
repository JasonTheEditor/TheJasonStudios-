-- Create your owner user in Supabase Auth first, then replace OWNER_AUTH_USER_UUID
-- everywhere below with that user's UUID from Authentication > Users.
create extension if not exists pgcrypto;
create table if not exists public.works (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 1 and 120),
 category text not null check (category in ('photos','apps','edits')),
 description text not null check (char_length(description) between 1 and 3000),
 image_url text, project_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.works enable row level security;
revoke all on table public.works from anon, authenticated;
grant select on table public.works to anon, authenticated;
grant insert, update, delete on table public.works to authenticated;
drop policy if exists "Public can read works" on public.works;
create policy "Public can read works" on public.works for select to anon, authenticated using (true);
drop policy if exists "Owner can insert works" on public.works;
create policy "Owner can insert works" on public.works for insert to authenticated with check (auth.uid() = 'OWNER_AUTH_USER_UUID'::uuid);
drop policy if exists "Owner can update works" on public.works;
create policy "Owner can update works" on public.works for update to authenticated using (auth.uid() = 'OWNER_AUTH_USER_UUID'::uuid) with check (auth.uid() = 'OWNER_AUTH_USER_UUID'::uuid);
drop policy if exists "Owner can delete works" on public.works;
create policy "Owner can delete works" on public.works for delete to authenticated using (auth.uid() = 'OWNER_AUTH_USER_UUID'::uuid);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('portfolio-images','portfolio-images',true,10485760,array['image/jpeg','image/png','image/webp','image/gif','image/avif']) on conflict (id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif','image/avif'];
drop policy if exists "Public read portfolio images" on storage.objects;
create policy "Public read portfolio images" on storage.objects for select to anon,authenticated using (bucket_id='portfolio-images');
drop policy if exists "Owner upload portfolio images" on storage.objects;
create policy "Owner upload portfolio images" on storage.objects for insert to authenticated with check (bucket_id='portfolio-images' and auth.uid()='OWNER_AUTH_USER_UUID'::uuid);
drop policy if exists "Owner update portfolio images" on storage.objects;
create policy "Owner update portfolio images" on storage.objects for update to authenticated using (bucket_id='portfolio-images' and auth.uid()='OWNER_AUTH_USER_UUID'::uuid) with check (bucket_id='portfolio-images' and auth.uid()='OWNER_AUTH_USER_UUID'::uuid);
drop policy if exists "Owner delete portfolio images" on storage.objects;
create policy "Owner delete portfolio images" on storage.objects for delete to authenticated using (bucket_id='portfolio-images' and auth.uid()='OWNER_AUTH_USER_UUID'::uuid);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists works_set_updated_at on public.works;
create trigger works_set_updated_at before update on public.works for each row execute function public.set_updated_at();
