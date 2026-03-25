-- letter_images table
create table letter_images (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid references letters(id) on delete cascade not null,
  storage_path text not null,
  display_order smallint default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table letter_images enable row level security;

-- Users can view images for letters they can see
create policy "Users can view letter images"
  on letter_images for select
  using (
    exists (
      select 1 from letters
      where letters.id = letter_images.letter_id
        and (letters.author_id = auth.uid() or letters.recipient_id = auth.uid())
    )
  );

-- Authors can insert images for their own letters
create policy "Authors can insert letter images"
  on letter_images for insert
  with check (
    exists (
      select 1 from letters
      where letters.id = letter_images.letter_id
        and letters.author_id = auth.uid()
    )
  );

-- Create storage bucket for letter images
insert into storage.buckets (id, name, public)
values ('letter-images', 'letter-images', false)
on conflict (id) do nothing;

-- Storage policies: users can upload to their own folder
create policy "Users can upload letter images"
  on storage.objects for insert
  with check (
    bucket_id = 'letter-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can read letter images
create policy "Authenticated users can read letter images"
  on storage.objects for select
  using (
    bucket_id = 'letter-images'
    and auth.role() = 'authenticated'
  );
