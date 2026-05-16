ALTER TABLE public.prompt_purchases 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies to allow users to see their own purchases
CREATE POLICY "Users can view their own purchases" 
ON public.prompt_purchases 
FOR SELECT 
USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email);