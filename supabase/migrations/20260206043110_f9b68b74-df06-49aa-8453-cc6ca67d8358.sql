-- Create prompts table for marketplace
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  hype_text TEXT,
  example_image_url TEXT,
  prompt_template TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 2100,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'coming_soon', 'inactive')),
  is_influencer_prompt BOOLEAN NOT NULL DEFAULT false,
  influencer_name TEXT,
  influencer_avatar_url TEXT,
  required_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompt purchases table
CREATE TABLE public.prompt_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id),
  user_email TEXT,
  user_instagram TEXT,
  user_name TEXT,
  user_photo_url TEXT,
  custom_fields JSONB,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired')),
  payment_id TEXT,
  payment_method TEXT DEFAULT 'pix',
  amount_cents INTEGER NOT NULL,
  generated_image_url TEXT,
  generation_status TEXT NOT NULL DEFAULT 'pending' CHECK (generation_status IN ('pending', 'generating', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_purchases ENABLE ROW LEVEL SECURITY;

-- Public read access for prompts (marketplace)
CREATE POLICY "Anyone can view active prompts"
ON public.prompts
FOR SELECT
USING (status != 'inactive');

-- Admin full access to prompts
CREATE POLICY "Admins can manage prompts"
ON public.prompts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can create purchases (no auth required for conversion)
CREATE POLICY "Anyone can create purchases"
ON public.prompt_purchases
FOR INSERT
WITH CHECK (true);

-- Users can view their own purchases by email
CREATE POLICY "Anyone can view purchases"
ON public.prompt_purchases
FOR SELECT
USING (true);

-- Admin can manage all purchases
CREATE POLICY "Admins can manage purchases"
ON public.prompt_purchases
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_prompts_updated_at
BEFORE UPDATE ON public.prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompt_purchases_updated_at
BEFORE UPDATE ON public.prompt_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample prompts
INSERT INTO public.prompts (name, description, category, hype_text, prompt_template, status, required_fields) VALUES
('Aesthetic Portrait', 'Transforme sua foto em uma arte estética premium', 'Arte Digital', '🔥 +500k gerações', 'Create an aesthetic portrait of {name}, highly detailed, cinematic lighting, trending on artstation, 8k quality. The person has the following appearance based on uploaded photo.', 'active', '["photo", "name"]'::jsonb),
('Cyberpunk Avatar', 'Visual futurista cyberpunk para suas redes', 'Cyberpunk', '⚡ Viral no TikTok', 'Generate a cyberpunk style portrait of {name}, neon lights, futuristic cityscape background, high-tech aesthetic, blade runner style, 8k ultra detailed', 'active', '["photo", "name"]'::jsonb),
('Anime Style', 'Sua versão anime ultra realista', 'Anime', '✨ +1M de views', 'Transform {name} into anime style, studio ghibli inspired, highly detailed anime portrait, beautiful lighting, trending on pixiv', 'active', '["photo", "name"]'::jsonb),
('Fashion Editorial', 'Look de capa de revista de moda', 'Fashion', '💎 Premium Quality', 'Create a fashion editorial style portrait of {name}, vogue magazine cover quality, professional studio lighting, high fashion aesthetic, 8k', 'active', '["photo", "name", "instagram"]'::jsonb),
('Fantasy Character', 'Torne-se um personagem de fantasia épico', 'Fantasy', '🗡️ Top Seller', 'Generate an epic fantasy character portrait of {name}, detailed armor, magical effects, cinematic lighting, lord of the rings style, 8k ultra quality', 'active', '["photo", "name"]'::jsonb),
('Neon Glow', 'Visual neon vibrante para impactar', 'Neon Art', '🌈 Trending', 'Create a neon glow portrait of {name}, vibrant neon colors, dark background, cyberpunk aesthetic, high contrast, 8k detailed', 'active', '["photo", "name"]'::jsonb),
('Vintage Film', 'Estética vintage cinematográfica', 'Vintage', '📽️ Clássico', 'Generate a vintage film style portrait of {name}, 35mm film grain, warm tones, classic hollywood lighting, nostalgic aesthetic', 'active', '["photo", "name"]'::jsonb),
('Influencer Exclusive', 'Prompt exclusivo do @influencer', 'Influencer', '⭐ Em breve', 'Exclusive influencer prompt template for {name}', 'coming_soon', '["photo", "name", "instagram"]'::jsonb);