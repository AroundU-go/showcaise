-- Update RLS policies to restrict vote access to admins only
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;

-- Create admin-only read policy for votes
CREATE POLICY "Admin can view all votes" 
ON public.votes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);