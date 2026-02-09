-- Tornar o bucket user-photos público para URLs serem acessíveis
UPDATE storage.buckets SET public = true WHERE name = 'user-photos';

-- Corrigir política de SELECT para user-photos - permitir acesso público
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
CREATE POLICY "Public can view user photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-photos');