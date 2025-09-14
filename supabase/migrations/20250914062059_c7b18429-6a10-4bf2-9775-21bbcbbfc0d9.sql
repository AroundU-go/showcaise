-- Allow users to delete their own pending apps
CREATE POLICY "Users can delete their own pending apps" 
ON public.apps 
FOR DELETE 
USING (
  maker_email = (auth.jwt() ->> 'email'::text) 
  AND status = 'pending'::text
);