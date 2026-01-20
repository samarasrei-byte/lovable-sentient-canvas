-- ===========================================
-- ARCANA 2.0 - Sistema de Planos e Créditos
-- ===========================================

-- 1. Atualizar enum de planos para incluir os 5 planos
ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'creator';
ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'business';
ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'pro';

-- 2. Criar tabela de configuração de planos
CREATE TABLE public.plan_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  credits_monthly INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserir os 5 planos
INSERT INTO public.plan_configs (plan_key, name, price_cents, credits_monthly, features, display_order) VALUES
('starter', 'Starter', 5500, 50, '["Criar imagens de produtos", "5 templates básicos", "Suporte por email", "Marca d''água nas imagens"]', 1),
('creator', 'Criador', 9900, 120, '["Tudo do Starter", "Criar fotos profissionais", "20 templates", "Sem marca d''água", "Influenciadores básicos"]', 2),
('professional', 'Profissional', 19900, 300, '["Tudo do Criador", "Todos influenciadores", "Artistas", "Avatares IA", "Prioridade de processamento"]', 3),
('business', 'Empresarial', 39900, 800, '["Tudo do Profissional", "API access", "White-label básico", "Suporte prioritário", "Relatórios avançados"]', 4),
('pro', 'Arcana PRO', 59900, 2000, '["Tudo do Empresarial", "Animação de imagens", "Pixel Arcana", "Templates exclusivos", "Gerente dedicado", "SLA garantido"]', 5);

-- RLS para plan_configs (leitura pública)
ALTER TABLE public.plan_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active plans" ON public.plan_configs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.plan_configs FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 3. Criar tabela de créditos do usuário
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  credits_balance INTEGER NOT NULL DEFAULT 0,
  credits_used_this_month INTEGER NOT NULL DEFAULT 0,
  last_credit_reset TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage credits" ON public.user_credits FOR ALL USING (true);

-- 4. Criar tabela de histórico de transações de créditos
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund', 'bonus', 'reset')),
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON public.credit_transactions FOR INSERT WITH CHECK (true);

-- 5. Adicionar campos Stripe na tabela subscriptions
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
  ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;

-- 6. Criar tabela para checkouts pendentes
CREATE TABLE public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  plan_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own checkouts" ON public.checkout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage checkouts" ON public.checkout_sessions FOR ALL USING (true);

-- 7. Criar tabela de Stripe customers
CREATE TABLE public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own customer" ON public.stripe_customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage customers" ON public.stripe_customers FOR ALL USING (true);

-- 8. Função para consumir créditos
CREATE OR REPLACE FUNCTION public.consume_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT credits_balance INTO v_current_balance
  FROM public.user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  v_new_balance := v_current_balance - p_amount;
  
  -- Update balance
  UPDATE public.user_credits
  SET 
    credits_balance = v_new_balance,
    credits_used_this_month = credits_used_this_month + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id, reference_type, balance_after)
  VALUES (p_user_id, -p_amount, 'debit', p_description, p_reference_id, p_reference_type, v_new_balance);
  
  RETURN TRUE;
END;
$$;

-- 9. Função para adicionar créditos
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT DEFAULT 'credit',
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Upsert credits
  INSERT INTO public.user_credits (user_id, credits_balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    credits_balance = public.user_credits.credits_balance + p_amount,
    updated_at = NOW()
  RETURNING credits_balance INTO v_new_balance;
  
  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, v_new_balance);
  
  RETURN v_new_balance;
END;
$$;

-- 10. Função para resetar créditos mensais
CREATE OR REPLACE FUNCTION public.reset_monthly_credits(p_user_id UUID, p_new_credits INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE public.user_credits
  SET 
    credits_balance = p_new_credits,
    credits_used_this_month = 0,
    last_credit_reset = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING credits_balance INTO v_new_balance;
  
  IF v_new_balance IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits_balance)
    VALUES (p_user_id, p_new_credits)
    RETURNING credits_balance INTO v_new_balance;
  END IF;
  
  INSERT INTO public.credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_new_credits, 'reset', 'Créditos mensais renovados', v_new_balance);
  
  RETURN v_new_balance;
END;
$$;

-- 11. Trigger para updated_at
CREATE TRIGGER update_plan_configs_updated_at
  BEFORE UPDATE ON public.plan_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();