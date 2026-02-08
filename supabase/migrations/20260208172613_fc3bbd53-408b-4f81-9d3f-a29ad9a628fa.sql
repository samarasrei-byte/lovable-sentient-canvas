-- =================================================
-- PHOTO SERVICES: Categorias de serviços de foto
-- =================================================
CREATE TABLE public.photo_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL, -- 'mesversario', 'aniversario', 'profissional'
  icon TEXT,
  example_images TEXT[] DEFAULT '{}',
  themes JSONB DEFAULT '[]', -- Lista de temas disponíveis
  price_cents INTEGER NOT NULL DEFAULT 5800,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active photo services"
ON public.photo_services
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage photo services"
ON public.photo_services
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =================================================
-- PHOTO GENERATIONS: Geração de fotos com IA
-- =================================================
CREATE TABLE public.photo_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.photo_services(id) ON DELETE SET NULL,
  user_id UUID, -- Pode ser null para usuários não logados
  
  -- User info
  user_email TEXT,
  user_name TEXT,
  user_phone TEXT,
  
  -- Photos uploaded
  uploaded_photos TEXT[] DEFAULT '{}',
  
  -- Generation settings
  theme TEXT,
  custom_fields JSONB DEFAULT '{}',
  
  -- Payment
  amount_cents INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  payment_method TEXT DEFAULT 'pix',
  
  -- Generation
  generated_images TEXT[] DEFAULT '{}',
  generation_status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  generation_error TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can create photo generations"
ON public.photo_generations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own generations"
ON public.photo_generations
FOR SELECT
USING (
  user_email IS NOT NULL 
  OR (user_id IS NOT NULL AND auth.uid() = user_id)
);

CREATE POLICY "Admins can manage all generations"
ON public.photo_generations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =================================================
-- Storage bucket for user uploads
-- =================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-photos
CREATE POLICY "Anyone can upload photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'user-photos');

CREATE POLICY "Users can view their own photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user-photos');

CREATE POLICY "Admins can manage all photos"
ON storage.objects
FOR ALL
USING (bucket_id = 'user-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- =================================================
-- Trigger for updated_at
-- =================================================
CREATE TRIGGER update_photo_services_updated_at
  BEFORE UPDATE ON public.photo_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_photo_generations_updated_at
  BEFORE UPDATE ON public.photo_generations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =================================================
-- Insert initial photo services
-- =================================================
INSERT INTO public.photo_services (name, slug, description, category, themes, price_cents, features, display_order) VALUES
(
  'Mêsversário & Aniversário',
  'mesversario-aniversario',
  'Capture cada fase do seu bebê ou celebre aniversários de todas as idades com fotos temáticas e personalizadas. Inclua toda a família!',
  'mesversario',
  '[
    {"id": "jardim", "name": "Jardim Encantado", "description": "Flores e natureza"},
    {"id": "safari", "name": "Safari", "description": "Animais e aventura"},
    {"id": "princesa", "name": "Princesa/Príncipe", "description": "Realeza e magia"},
    {"id": "espacial", "name": "Espacial", "description": "Astronautas e estrelas"},
    {"id": "oceano", "name": "Fundo do Mar", "description": "Peixes e sereias"},
    {"id": "fazendinha", "name": "Fazendinha", "description": "Animais da fazenda"},
    {"id": "circo", "name": "Circo", "description": "Palhaços e diversão"},
    {"id": "floresta", "name": "Floresta Encantada", "description": "Duendes e fadas"}
  ]'::jsonb,
  5800,
  '["Upload Familiar", "Temas Personalizados", "Consistência Facial IA", "12 Fotos por Pacote"]'::jsonb,
  1
),
(
  'Fotografia Profissional',
  'fotografia-profissional',
  'Headshots para LinkedIn, portfólios de modelo e fotos criativas que elevam sua imagem profissional.',
  'profissional',
  '[
    {"id": "linkedin", "name": "LinkedIn/Corporate", "description": "Fundo neutro, pose profissional"},
    {"id": "modelo", "name": "Portfólio Modelo", "description": "Várias poses e estilos"},
    {"id": "criativo", "name": "Criativo/Artístico", "description": "Iluminação dramática"},
    {"id": "casual", "name": "Casual Business", "description": "Ambiente relaxado"},
    {"id": "oldmoney", "name": "Old Money", "description": "Luxo discreto e sofisticação"},
    {"id": "vogue", "name": "Editorial Vogue", "description": "Alta moda e elegância"}
  ]'::jsonb,
  4900,
  '["Cenários Personalizados", "Ajuste de Iluminação/Pose", "Remoção de Fundo IA", "5 Fotos Profissionais"]'::jsonb,
  2
);