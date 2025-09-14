-- Fix security vulnerability: Restrict profiles table access to own data only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep existing policies for insert and update (they're already secure)
-- Policy "Users can insert their own profile" - already secure (auth.uid() = user_id)
-- Policy "Users can update their own profile" - already secure (auth.uid() = user_id)