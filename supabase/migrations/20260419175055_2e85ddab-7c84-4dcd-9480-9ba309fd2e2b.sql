
SELECT cron.schedule(
  'arcana-recover-purchases',
  '* * * * *',
  $$
  SELECT net.http_post(
    url:='https://nvmvyjajmasaksyffemu.supabase.co/functions/v1/recover-failed-purchases',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bXZ5amFqbWFzYWtzeWZmZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTM5NDksImV4cCI6MjA3OTU2OTk0OX0.grPeMhHE-g89L_qJg5tCeSdlOJI0u8pYZtBV1TbLpZs"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);
