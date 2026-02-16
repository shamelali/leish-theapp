alter table public.bookings
add column if not exists expires_at timestamptz;

create index if not exists idx_bookings_expires_at
on public.bookings (expires_at);
