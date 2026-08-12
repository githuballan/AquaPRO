create extension if not exists pgcrypto;

create table if not exists public.account_tiers (
  code text primary key,
  name text not null,
  max_aquariums integer not null check (max_aquariums >= 1),
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.account_tiers (code, name, max_aquariums)
values
  ('BRONZE', 'Bronze', 1),
  ('PRATA', 'Prata', 2),
  ('OURO', 'Ouro', 5),
  ('DIAMANTE', 'Diamante', 10)
on conflict (code) do update
set
  name = excluded.name,
  max_aquariums = excluded.max_aquariums;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name varchar(60),
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_access (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier_code text not null references public.account_tiers (code) default 'BRONZE',
  aquariums_allowed integer not null default 1 check (aquariums_allowed >= 1),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aquariums (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name varchar(60) not null,
  type_label varchar(40),
  volume_l numeric(10,2),
  target_temperature numeric(4,1),
  target_ph numeric(4,2),
  target_gh numeric(4,1),
  target_kh numeric(4,1),
  notes varchar(300),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint aquariums_volume_l_check check (volume_l is null or volume_l between 1 and 50000),
  constraint aquariums_target_temperature_check check (target_temperature is null or target_temperature between 0 and 40),
  constraint aquariums_target_ph_check check (target_ph is null or target_ph between 0 and 14),
  constraint aquariums_target_gh_check check (target_gh is null or target_gh between 0 and 30),
  constraint aquariums_target_kh_check check (target_kh is null or target_kh between 0 and 40)
);

create table if not exists public.aquarium_readings (
  id uuid primary key default gen_random_uuid(),
  aquarium_id uuid not null references public.aquariums (id) on delete cascade,
  measured_at timestamptz not null default timezone('utc', now()),
  temperature numeric(4,1),
  ph numeric(4,2),
  gh numeric(4,1),
  kh numeric(4,1),
  nitrite numeric(5,2),
  ammonia numeric(5,2),
  co2_enabled text,
  drop_checker_color text,
  notes varchar(300),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint aquarium_readings_temperature_check check (temperature is null or temperature between 0 and 40),
  constraint aquarium_readings_ph_check check (ph is null or ph between 0 and 14),
  constraint aquarium_readings_gh_check check (gh is null or gh between 0 and 30),
  constraint aquarium_readings_kh_check check (kh is null or kh between 0 and 40),
  constraint aquarium_readings_nitrite_check check (nitrite is null or nitrite between 0 and 10),
  constraint aquarium_readings_ammonia_check check (ammonia is null or ammonia between 0 and 10),
  constraint aquarium_readings_co2_enabled_check check (co2_enabled is null or co2_enabled in ('ligado', 'desligado')),
  constraint aquarium_readings_drop_checker_color_check check (drop_checker_color is null or drop_checker_color in ('azul', 'verde', 'amarelo'))
);

create index if not exists idx_aquariums_owner_user_id on public.aquariums (owner_user_id, created_at desc);
create index if not exists idx_aquarium_readings_aquarium_id on public.aquarium_readings (aquarium_id, measured_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.apply_default_user_access()
returns trigger
language plpgsql
as $$
declare
  default_max_aquariums integer;
begin
  select max_aquariums
    into default_max_aquariums
    from public.account_tiers
   where code = coalesce(new.tier_code, 'BRONZE');

  new.aquariums_allowed := coalesce(new.aquariums_allowed, default_max_aquariums, 1);
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)), 60),
    new.email
  )
  on conflict (id) do update
  set
    display_name = excluded.display_name,
    email = excluded.email,
    updated_at = timezone('utc', now());

  insert into public.user_access (user_id, tier_code, aquariums_allowed)
  values (new.id, 'BRONZE', 1)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function public.enforce_aquarium_limit()
returns trigger
language plpgsql
as $$
declare
  allowed_count integer;
  current_count integer;
begin
  select ua.aquariums_allowed
    into allowed_count
    from public.user_access ua
   where ua.user_id = new.owner_user_id;

  allowed_count := coalesce(allowed_count, 1);

  select count(*)
    into current_count
    from public.aquariums a
   where a.owner_user_id = new.owner_user_id;

  if current_count >= allowed_count then
    raise exception 'Limite de aquários atingido para esta conta.';
  end if;

  return new;
end;
$$;

insert into public.profiles (id, display_name, email)
select
  u.id,
  left(coalesce(u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)), 60),
  u.email
from auth.users u
on conflict (id) do update
set
  display_name = excluded.display_name,
  email = excluded.email,
  updated_at = timezone('utc', now());

insert into public.user_access (user_id, tier_code, aquariums_allowed)
select
  u.id,
  'BRONZE',
  1
from auth.users u
on conflict (user_id) do nothing;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists user_access_set_updated_at on public.user_access;
create trigger user_access_set_updated_at
before update on public.user_access
for each row
execute function public.set_updated_at();

drop trigger if exists aquariums_set_updated_at on public.aquariums;
create trigger aquariums_set_updated_at
before update on public.aquariums
for each row
execute function public.set_updated_at();

drop trigger if exists aquarium_readings_set_updated_at on public.aquarium_readings;
create trigger aquarium_readings_set_updated_at
before update on public.aquarium_readings
for each row
execute function public.set_updated_at();

drop trigger if exists user_access_apply_defaults on public.user_access;
create trigger user_access_apply_defaults
before insert or update on public.user_access
for each row
execute function public.apply_default_user_access();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

drop trigger if exists aquariums_enforce_limit on public.aquariums;
create trigger aquariums_enforce_limit
before insert on public.aquariums
for each row
execute function public.enforce_aquarium_limit();

alter table public.profiles enable row level security;
alter table public.user_access enable row level security;
alter table public.aquariums enable row level security;
alter table public.aquarium_readings enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "user_access_select_own" on public.user_access;
create policy "user_access_select_own"
on public.user_access
for select
using (auth.uid() = user_id);

drop policy if exists "aquariums_select_own" on public.aquariums;
create policy "aquariums_select_own"
on public.aquariums
for select
using (auth.uid() = owner_user_id);

drop policy if exists "aquariums_insert_own" on public.aquariums;
create policy "aquariums_insert_own"
on public.aquariums
for insert
with check (auth.uid() = owner_user_id);

drop policy if exists "aquariums_update_own" on public.aquariums;
create policy "aquariums_update_own"
on public.aquariums
for update
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists "aquariums_delete_own" on public.aquariums;
create policy "aquariums_delete_own"
on public.aquariums
for delete
using (auth.uid() = owner_user_id);

drop policy if exists "aquarium_readings_select_own" on public.aquarium_readings;
create policy "aquarium_readings_select_own"
on public.aquarium_readings
for select
using (
  exists (
    select 1
      from public.aquariums a
     where a.id = aquarium_readings.aquarium_id
       and a.owner_user_id = auth.uid()
  )
);

drop policy if exists "aquarium_readings_insert_own" on public.aquarium_readings;
create policy "aquarium_readings_insert_own"
on public.aquarium_readings
for insert
with check (
  exists (
    select 1
      from public.aquariums a
     where a.id = aquarium_readings.aquarium_id
       and a.owner_user_id = auth.uid()
  )
);

drop policy if exists "aquarium_readings_update_own" on public.aquarium_readings;
create policy "aquarium_readings_update_own"
on public.aquarium_readings
for update
using (
  exists (
    select 1
      from public.aquariums a
     where a.id = aquarium_readings.aquarium_id
       and a.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
      from public.aquariums a
     where a.id = aquarium_readings.aquarium_id
       and a.owner_user_id = auth.uid()
  )
);

drop policy if exists "aquarium_readings_delete_own" on public.aquarium_readings;
create policy "aquarium_readings_delete_own"
on public.aquarium_readings
for delete
using (
  exists (
    select 1
      from public.aquariums a
     where a.id = aquarium_readings.aquarium_id
       and a.owner_user_id = auth.uid()
  )
);
