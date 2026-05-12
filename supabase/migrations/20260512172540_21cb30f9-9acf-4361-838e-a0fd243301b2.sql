-- Re-create view with security invoker for better security
CREATE OR REPLACE VIEW public.system_health_stats 
WITH (security_invoker = true)
AS
SELECT 
  COUNT(*) FILTER (WHERE generation_status = 'completed') as successful_generations,
  COUNT(*) FILTER (WHERE generation_status = 'failed') as failed_generations,
  (COUNT(*) FILTER (WHERE generation_status = 'failed')::float / NULLIF(COUNT(*), 0) * 100) as failure_rate,
  MAX(failed_at) as last_failure_at
FROM public.prompt_purchases
WHERE created_at > NOW() - INTERVAL '7 days';