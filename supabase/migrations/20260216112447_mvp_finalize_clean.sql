-- Enable required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Review system
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique not null references public.bookings(id) on delete cascade,
  customer_id uuid not null references public.profiles(id),
  pro_id uuid not null references public.pros(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_reviews_pro on public.reviews(pro_id);

-- Commission ledger
create table if not exists public.ledger (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  pro_id uuid not null references public.pros(id),
  gross_amount_sen int not null,
  commission_sen int not null,
  net_amount_sen int not null,
  created_at timestamptz default now()
);

create index if not exists idx_ledger_pro on public.ledger(pro_id);

-- Discovery View
create or replace view public.v_pro_discovery as
select
  p.id,
  p.display_name,
  p.bio,
  p.is_verified,
  l.locality,
  l.state
from public.pros p
join public.pro_locations l on l.pro_id = p.id;

-- Performance indexes
create index if not exists idx_bookings_pro_time on public.bookings(pro_id, scheduled_at);
create index if not exists idx_bookings_status on public.bookings(status);