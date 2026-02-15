
-- Live Sessions table
CREATE TABLE public.live_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  presenter_type TEXT NOT NULL DEFAULT 'avatar',
  presenter_name TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  viewers_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  share_slug TEXT UNIQUE,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live sessions" ON public.live_sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sessions" ON public.live_sessions FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their sessions" ON public.live_sessions FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Admins can manage all sessions" ON public.live_sessions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Live Products table
CREATE TABLE public.live_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  sold_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.live_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live products" ON public.live_products FOR SELECT USING (true);
CREATE POLICY "Session hosts can manage products" ON public.live_products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.live_sessions WHERE id = live_products.session_id AND host_id = auth.uid())
);
CREATE POLICY "Admins can manage all products" ON public.live_products FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Live Chat Messages table
CREATE TABLE public.live_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  user_name TEXT NOT NULL DEFAULT 'Anônimo',
  message TEXT NOT NULL,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages" ON public.live_chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.live_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins and bots can insert messages" ON public.live_chat_messages FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;

-- Trigger for updated_at on live_sessions
CREATE TRIGGER update_live_sessions_updated_at
BEFORE UPDATE ON public.live_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
