-- Supabase > SQL Editor-də bu faylı bütövlükdə işə salın
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category in ('Satış','Kirayə')),
  property_type text not null,
  title text not null,
  description text,
  city text not null,
  district text,
  metro text,
  settlement text,
  address text,
  price numeric not null check (price > 0),
  rooms int,
  area numeric,
  floor int,
  total_floors int,
  features text[] not null default '{}',
  photos text[] not null default '{}',
  panoramas text[] not null default '{}',
  owner_name text,
  phone text not null,
  whatsapp text
);
create index if not exists listings_created_idx on public.listings (created_at desc);
create index if not exists listings_filter_idx on public.listings (category, property_type, city);

alter table public.listings enable row level security;
create policy "Hamı elanları görə bilər" on public.listings for select to anon using (true);
create policy "Hamı elan yerləşdirə bilər" on public.listings for insert to anon
  with check (char_length(title) between 3 and 150 and price > 0 and coalesce(array_length(photos,1),0) <= 30);
-- UPDATE / DELETE siyasəti yoxdur: anonim istifadəçilər elanları dəyişə və ya silə bilməz.

-- Real vaxt (realtime)
alter publication supabase_realtime add table public.listings;

-- Şəkil anbarı (public bucket => daimi CDN linkləri)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listings','listings', true, 15728640, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Şəkillər hamıya açıqdır" on storage.objects for select to anon using (bucket_id = 'listings');
create policy "Hamı şəkil yükləyə bilər" on storage.objects for insert to anon with check (bucket_id = 'listings');
