-- Update RLS policy to allow anonymous app submissions
DROP POLICY IF EXISTS "Authenticated users can submit apps" ON public.apps;

CREATE POLICY "Anyone can submit apps" 
ON public.apps 
FOR INSERT 
WITH CHECK (true);