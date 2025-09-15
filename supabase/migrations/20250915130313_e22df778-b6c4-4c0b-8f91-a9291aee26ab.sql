-- Allow admin users to delete any app
CREATE POLICY "Admin can delete any app" 
ON public.apps 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);