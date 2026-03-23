-- Unpair function: clears partner_id for both users
-- Needs security definer because RLS only lets users update their own profile
-- Run this SQL in Supabase Dashboard > SQL Editor

create or replace function unpair()
returns void
language plpgsql security definer
as $$
declare
  current_partner_id uuid;
begin
  select partner_id into current_partner_id
  from profiles where id = auth.uid();

  if current_partner_id is not null then
    update profiles set partner_id = null where id = auth.uid();
    update profiles set partner_id = null where id = current_partner_id;
  end if;
end;
$$;
