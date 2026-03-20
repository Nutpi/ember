-- profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text,
  avatar_url text,
  invite_code text unique not null,
  partner_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- letters table
create table letters (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) not null,
  recipient_id uuid references profiles(id) not null,
  content text not null,
  is_draft boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table letters enable row level security;

-- Profiles: users can read their own and their partner's profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can view partner profile"
  on profiles for select
  using (auth.uid() = partner_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Allow reading any profile by invite_code (for pairing)
create policy "Anyone can find profile by invite code"
  on profiles for select
  using (true);

-- Letters: users can read letters they sent or received
create policy "Users can view own letters"
  on letters for select
  using (auth.uid() = author_id or auth.uid() = recipient_id);

create policy "Users can insert own letters"
  on letters for insert
  with check (auth.uid() = author_id);

create policy "Users can update own letters"
  on letters for update
  using (auth.uid() = author_id or auth.uid() = recipient_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, invite_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)),
    substr(md5(random()::text), 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
