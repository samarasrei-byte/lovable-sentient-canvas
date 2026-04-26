-- Add missing columns to support_tickets
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_tickets' AND column_name = 'attachment_url') THEN
    ALTER TABLE public.support_tickets ADD COLUMN attachment_url TEXT;
  END IF;
END $$;

-- Add missing columns to ticket_messages
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticket_messages' AND column_name = 'attachment_url') THEN
    ALTER TABLE public.ticket_messages ADD COLUMN attachment_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticket_messages' AND column_name = 'is_admin_reply') THEN
    ALTER TABLE public.ticket_messages ADD COLUMN is_admin_reply BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add missing columns to generated_images
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generated_images' AND column_name = 'is_favorite') THEN
    ALTER TABLE public.generated_images ADD COLUMN is_favorite BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generated_images' AND column_name = 'original_purchase_id') THEN
    ALTER TABLE public.generated_images ADD COLUMN original_purchase_id UUID REFERENCES public.prompt_purchases(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ensure profiles has role column
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Enable RLS and add policies if they don't exist
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Utility to drop policy if exists and create
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
    CREATE POLICY "Admins can view all tickets" 
    ON public.support_tickets FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Admins can update any ticket" ON public.support_tickets;
    CREATE POLICY "Admins can update any ticket" 
    ON public.support_tickets FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Admins can view and send any ticket message" ON public.ticket_messages;
    CREATE POLICY "Admins can view and send any ticket message" 
    ON public.ticket_messages FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

    DROP POLICY IF EXISTS "Users can view their own generated images" ON public.generated_images;
    CREATE POLICY "Users can view their own generated images" 
    ON public.generated_images FOR SELECT 
    USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update their own generated images" ON public.generated_images;
    CREATE POLICY "Users can update their own generated images" 
    ON public.generated_images FOR UPDATE 
    USING (auth.uid() = user_id);
END $$;
