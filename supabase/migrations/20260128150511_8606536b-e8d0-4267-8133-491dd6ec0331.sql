-- Allow users to delete their own generated images
CREATE POLICY "Usuários podem deletar suas próprias imagens"
ON public.generated_images
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to view their own images (private)
CREATE POLICY "Usuários podem ver suas próprias imagens"
ON public.generated_images
FOR SELECT
USING (auth.uid() = user_id);