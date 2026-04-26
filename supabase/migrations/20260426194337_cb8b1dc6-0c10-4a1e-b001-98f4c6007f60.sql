-- Table for blocked prompt attempts
CREATE TABLE public.blocked_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  purchase_id UUID,
  prompt_text TEXT NOT NULL,
  reason TEXT NOT NULL,
  severity TEXT DEFAULT 'medium', -- low, medium, high, critical
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for user-specific moderation data
CREATE TABLE public.user_moderation_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  violation_count INTEGER DEFAULT 0,
  is_suspended BOOLEAN DEFAULT false,
  suspension_reason TEXT,
  risk_score FLOAT DEFAULT 0.0,
  last_violation_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for system-wide moderation rules (optional but good for future flexibility)
CREATE TABLE public.moderation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL, -- 'blacklist', 'regex', 'context'
  pattern TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_moderation_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_rules ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view all blocked prompts" ON public.blocked_prompts
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view all user moderation profiles" ON public.user_moderation_profiles
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update user moderation profiles" ON public.user_moderation_profiles
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage moderation rules" ON public.moderation_rules
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger to update updated_at on user_moderation_profiles
CREATE TRIGGER update_user_moderation_profiles_updated_at
BEFORE UPDATE ON public.user_moderation_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log violation and update risk score
CREATE OR REPLACE FUNCTION public.log_moderation_violation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_moderation_profiles (user_id, violation_count, last_violation_at, risk_score)
  VALUES (NEW.user_id, 1, now(), CASE WHEN NEW.severity = 'critical' THEN 0.9 ELSE 0.2 END)
  ON CONFLICT (user_id) DO UPDATE SET
    violation_count = user_moderation_profiles.violation_count + 1,
    last_violation_at = now(),
    risk_score = LEAST(1.0, user_moderation_profiles.risk_score + CASE WHEN NEW.severity = 'critical' THEN 0.5 ELSE 0.1 END),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_moderation_violation
AFTER INSERT ON public.blocked_prompts
FOR EACH ROW
WHEN (NEW.user_id IS NOT NULL)
EXECUTE FUNCTION public.log_moderation_violation();
