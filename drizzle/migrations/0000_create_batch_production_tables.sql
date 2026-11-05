
-- Clientes da produção em lote (dados da marca de cada cliente do usuário)
CREATE TABLE public.batch_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  brand_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#7C3AED',
  secondary_color TEXT DEFAULT '#0EA5E9',
  website_url TEXT,
  instagram_handle TEXT,
  whatsapp TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_clients TO authenticated;
GRANT ALL ON public.batch_clients TO service_role;

ALTER TABLE public.batch_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own clients"
  ON public.batch_clients FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all clients"
  ON public.batch_clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_batch_clients_user ON public.batch_clients(user_id);

CREATE TRIGGER update_batch_clients_updated_at
  BEFORE UPDATE ON public.batch_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Templates de vídeo de marketing (gerenciados por admin)
CREATE TABLE public.video_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'marketing',
  thumbnail_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 15,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.video_templates TO authenticated;
GRANT ALL ON public.video_templates TO service_role;

ALTER TABLE public.video_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read active templates"
  ON public.video_templates FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins manage templates"
  ON public.video_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Jobs de produção em lote
CREATE TABLE public.batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.batch_clients(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.video_templates(id) ON DELETE SET NULL,
  segment TEXT NOT NULL,
  theme TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity IN (50, 100, 200, 300)),
  credits_per_video INTEGER NOT NULL DEFAULT 1,
  credits_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  videos_completed INTEGER NOT NULL DEFAULT 0,
  videos_failed INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_jobs TO authenticated;
GRANT ALL ON public.batch_jobs TO service_role;

ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own jobs"
  ON public.batch_jobs FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all jobs"
  ON public.batch_jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_batch_jobs_user ON public.batch_jobs(user_id);
CREATE INDEX idx_batch_jobs_status ON public.batch_jobs(status);

CREATE TRIGGER update_batch_jobs_updated_at
  BEFORE UPDATE ON public.batch_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vídeos individuais de cada job
CREATE TABLE public.batch_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.batch_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.batch_clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'processando', 'concluido', 'erro', 'aprovado', 'publicado')),
  video_url TEXT,
  thumbnail_url TEXT,
  render_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  variation_index INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_videos TO authenticated;
GRANT ALL ON public.batch_videos TO service_role;

ALTER TABLE public.batch_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own videos"
  ON public.batch_videos FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all videos"
  ON public.batch_videos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_batch_videos_job ON public.batch_videos(job_id);
CREATE INDEX idx_batch_videos_user ON public.batch_videos(user_id);
CREATE INDEX idx_batch_videos_status ON public.batch_videos(status);

CREATE TRIGGER update_batch_videos_updated_at
  BEFORE UPDATE ON public.batch_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Templates iniciais de marketing vertical
INSERT INTO public.video_templates (name, description, category, duration_seconds, display_order, config) VALUES
('Promoção Relâmpago', 'Vídeo vertical de oferta com contagem regressiva e chamada para ação.', 'ofertas', 15, 1, '{"style":"promo","scenes":["hook","oferta","cta"]}'),
('Depoimento de Cliente', 'Formato social proof com destaque para avaliação e marca.', 'social-proof', 20, 2, '{"style":"testimonial","scenes":["quote","marca","cta"]}'),
('Lançamento de Produto', 'Revelação de produto com texto dinâmico e cores da marca.', 'lancamento', 15, 3, '{"style":"launch","scenes":["teaser","reveal","cta"]}'),
('Dica Rápida', 'Conteúdo educativo curto para redes sociais com identidade do cliente.', 'educativo', 20, 4, '{"style":"tips","scenes":["pergunta","dica","cta"]}');
