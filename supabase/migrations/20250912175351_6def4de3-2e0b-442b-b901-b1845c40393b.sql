-- Storage policies to allow public logo uploads to 'app-assets'
DROP POLICY IF EXISTS "Public read for app-assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload app-assets" ON storage.objects;

CREATE POLICY "Public read for app-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'app-assets');

CREATE POLICY "Anyone can upload app-assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'app-assets');