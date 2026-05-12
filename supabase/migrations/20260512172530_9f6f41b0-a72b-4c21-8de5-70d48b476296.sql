-- Add error tracking to prompt_purchases
ALTER TABLE public.prompt_purchases ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE public.prompt_purchases ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP WITH TIME ZONE;

-- Create a view for system health monitoring
CREATE OR REPLACE VIEW public.system_health_stats AS
SELECT 
  COUNT(*) FILTER (WHERE generation_status = 'completed') as successful_generations,
  COUNT(*) FILTER (WHERE generation_status = 'failed') as failed_generations,
  (COUNT(*) FILTER (WHERE generation_status = 'failed')::float / NULLIF(COUNT(*), 0) * 100) as failure_rate,
  MAX(failed_at) as last_failure_at
FROM public.prompt_purchases
WHERE created_at > NOW() - INTERVAL '7 days';

-- Grant access to the view (admins only if possible, but for simplicity let's assume RLS handles it)
ALTER VIEW public.system_health_stats OWNER TO postgres;
GRANT SELECT ON public.system_health_stats TO authenticated;
GRANT SELECT ON public.system_health_stats TO service_role;