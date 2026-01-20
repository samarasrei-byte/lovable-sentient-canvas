-- Tabela de artistas reais
CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  bio TEXT,
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  portfolio_urls TEXT[] DEFAULT '{}',
  audio_url TEXT,
  video_url TEXT,
  price_per_hour NUMERIC DEFAULT 0,
  price_per_project NUMERIC DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  instagram_handle TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  total_projects INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de avatares IA (criados pelo admin)
CREATE TABLE public.ai_avatars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'influencer', -- influencer, artist, model
  prompt TEXT,
  image_url TEXT,
  price_per_use NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  total_uses INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  personality TEXT,
  voice_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de categorias do marketplace
CREATE TABLE public.marketplace_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  type TEXT NOT NULL, -- influencer, artist, avatar
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de tags do marketplace
CREATE TABLE public.marketplace_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de upgrades opcionais
CREATE TABLE public.plan_upgrades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de upgrades comprados pelos usuários
CREATE TABLE public.user_upgrades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upgrade_id UUID NOT NULL REFERENCES public.plan_upgrades(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  payment_status TEXT DEFAULT 'pending',
  UNIQUE(user_id, upgrade_id)
);

-- Tabela de pagamentos simulados
CREATE TABLE public.mock_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  type TEXT NOT NULL, -- subscription, upgrade, marketplace
  reference_id UUID,
  reference_type TEXT,
  status TEXT DEFAULT 'completed',
  payment_method TEXT DEFAULT 'mock',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de estatísticas do admin
CREATE TABLE public.admin_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key TEXT NOT NULL UNIQUE,
  stat_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artists
CREATE POLICY "Anyone can view active artists" ON public.artists FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage artists" ON public.artists FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Artists can update own profile" ON public.artists FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_avatars
CREATE POLICY "Anyone can view active avatars" ON public.ai_avatars FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage avatars" ON public.ai_avatars FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for categories
CREATE POLICY "Anyone can view active categories" ON public.marketplace_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.marketplace_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for tags
CREATE POLICY "Anyone can view active tags" ON public.marketplace_tags FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage tags" ON public.marketplace_tags FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for plan_upgrades
CREATE POLICY "Anyone can view active upgrades" ON public.plan_upgrades FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage upgrades" ON public.plan_upgrades FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_upgrades
CREATE POLICY "Users can view own upgrades" ON public.user_upgrades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can purchase upgrades" ON public.user_upgrades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage user upgrades" ON public.user_upgrades FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for mock_payments
CREATE POLICY "Users can view own payments" ON public.mock_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON public.mock_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.mock_payments FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for admin_stats
CREATE POLICY "Admins can manage stats" ON public.admin_stats FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_avatars_updated_at BEFORE UPDATE ON public.ai_avatars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plan_upgrades_updated_at BEFORE UPDATE ON public.plan_upgrades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();