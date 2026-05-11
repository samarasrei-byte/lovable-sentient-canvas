-- Create system config table
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Policies for system_config
CREATE POLICY "Admins can manage system config" 
ON public.system_config 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Seed initial config
INSERT INTO public.system_config (key, value, description) 
VALUES 
('credit_settings', '{"basic_plan_credits": 120, "pro_plan_credits": 400, "basic_price_cents": 5500, "pro_price_cents": 22000}', 'Configurações de créditos e preços'),
('api_status', '{"banana": "online", "cling": "online", "replicate": "online"}', 'Status atual das APIs externas')
ON CONFLICT (key) DO NOTHING;

-- Create API health logs
CREATE TABLE IF NOT EXISTS public.api_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    status TEXT NOT NULL,
    response_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_health_logs ENABLE ROW LEVEL SECURITY;

-- Policies for api_health_logs
CREATE POLICY "Admins can view health logs" 
ON public.api_health_logs 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Create a view for credit stats
CREATE OR REPLACE VIEW public.admin_credit_stats AS
SELECT 
    COUNT(*) as total_users,
    SUM(credits_balance) as total_circulating_credits,
    (SELECT COUNT(*) FROM public.generated_images) as total_images_generated
FROM public.user_credits;
