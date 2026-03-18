-- Add INSERT policy for influencers (so users can create their influencer profile)
CREATE POLICY "Users can create their own influencer profile"
  ON public.influencers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for user_roles (so the system can assign roles on signup)
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);