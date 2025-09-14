-- Fix security vulnerability: Restrict waitlist access to admin users only
DROP POLICY IF EXISTS "Authenticated users can read waitlist" ON public.waitlist;

-- Create new policy that only allows admin users to view waitlist entries
CREATE POLICY "Admin users can read waitlist" 
ON public.waitlist 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Keep existing INSERT policy (anyone can join waitlist)
-- Policy "Anyone can join waitlist" - remains secure for public signups