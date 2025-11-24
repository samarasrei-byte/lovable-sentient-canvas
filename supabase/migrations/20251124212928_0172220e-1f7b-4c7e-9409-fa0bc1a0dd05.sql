-- Create admin_settings table for platform configuration
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL CHECK (category IN ('financial', 'technical', 'legal', 'fraud')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ticket_messages table
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create influencer_approvals table
CREATE TABLE public.influencer_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  documents_verified BOOLEAN NOT NULL DEFAULT FALSE,
  engagement_score DECIMAL(5,2),
  authenticity_score DECIMAL(5,2),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create brand_verifications table
CREATE TABLE public.brand_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cnpj TEXT,
  company_name TEXT,
  documents_verified BOOLEAN NOT NULL DEFAULT FALSE,
  financial_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verifier_id UUID REFERENCES auth.users(id),
  verifier_notes TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create platform_fees table
CREATE TABLE public.platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  arcana_platform_fee DECIMAL(10,2) NOT NULL,
  arcana_whitelabel_fee DECIMAL(10,2) NOT NULL,
  withdrawal_fee DECIMAL(10,2) DEFAULT 0,
  total_fees DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create withdrawals table
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT NOT NULL,
  pix_key TEXT,
  bank_account TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create admin_2fa table for two-factor authentication
CREATE TABLE public.admin_2fa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_2fa ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_settings
CREATE POLICY "Only admins can view settings"
  ON public.admin_settings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage settings"
  ON public.admin_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for audit_logs
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage tickets"
  ON public.support_tickets FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ticket_messages
CREATE POLICY "Users can view ticket messages"
  ON public.ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE support_tickets.id = ticket_messages.ticket_id
      AND (support_tickets.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can send ticket messages"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for influencer_approvals
CREATE POLICY "Admins can manage influencer approvals"
  ON public.influencer_approvals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Influencers can view their own approval status"
  ON public.influencer_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.influencers
      WHERE influencers.id = influencer_approvals.influencer_id
      AND influencers.user_id = auth.uid()
    )
  );

-- RLS Policies for brand_verifications
CREATE POLICY "Admins can manage brand verifications"
  ON public.brand_verifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Brands can view their own verification status"
  ON public.brand_verifications FOR SELECT
  USING (auth.uid() = brand_id);

-- RLS Policies for platform_fees
CREATE POLICY "Admins can view all fees"
  ON public.platform_fees FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their contract fees"
  ON public.platform_fees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE contracts.id = platform_fees.contract_id
      AND contracts.brand_id = auth.uid()
    )
  );

-- RLS Policies for withdrawals
CREATE POLICY "Admins can manage withdrawals"
  ON public.withdrawals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Influencers can view their withdrawals"
  ON public.withdrawals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.influencers
      WHERE influencers.id = withdrawals.influencer_id
      AND influencers.user_id = auth.uid()
    )
  );

CREATE POLICY "Influencers can create withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.influencers
      WHERE influencers.id = withdrawals.influencer_id
      AND influencers.user_id = auth.uid()
    )
  );

-- RLS Policies for admin_2fa
CREATE POLICY "Users can manage their own 2FA"
  ON public.admin_2fa FOR ALL
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_influencer_approvals_updated_at
  BEFORE UPDATE ON public.influencer_approvals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_verifications_updated_at
  BEFORE UPDATE ON public.brand_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_2fa_updated_at
  BEFORE UPDATE ON public.admin_2fa
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default platform settings
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
  ('platform_fee_percentage', '{"value": 10}'::jsonb),
  ('whitelabel_fee_percentage', '{"value": 5}'::jsonb),
  ('withdrawal_fee', '{"value": 0}'::jsonb),
  ('contract_breach_penalty', '{"value": 20}'::jsonb);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    admin_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data
  ) VALUES (
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_data,
    p_new_data
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;