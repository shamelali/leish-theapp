-- Enable pg_cron
create extension if not exists pg_cron;

-- Enable http extension (needed for net.http_post)
create extension if not exists pg_net;

-- Remove existing job if exists
select cron.unschedule(jobid)
from cron.job
where jobname = 'expire-bookings-every-5-min';

-- Create cron job
select
  cron.schedule(
    'expire-bookings-every-5-min',
    '*/5 * * * *',
    $$
    select
      net.http_post(
        url := 'https://rmsjrhamjmupvrxqyagm.functions.supabase.co/expire-bookings',
        headers := jsonb_build_object(
          'Content-Type', 'application/json'
        ),
        body := '{}'
      );
    $$
  );
