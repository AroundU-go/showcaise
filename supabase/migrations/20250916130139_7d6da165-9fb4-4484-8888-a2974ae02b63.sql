-- Remove public read access to votes table and create secure vote checking
-- First, drop the existing public read policy
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

-- Create a secure function to check if an IP has already voted for an app
CREATE OR REPLACE FUNCTION public.has_ip_voted_for_app(app_uuid uuid, user_ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.votes 
    WHERE app_id = app_uuid 
    AND ip_address = user_ip
  );
END;
$$;

-- Create a secure function to add a vote (combines check and insert)
CREATE OR REPLACE FUNCTION public.add_vote_if_new(app_uuid uuid, user_ip text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  already_voted boolean;
  vote_result json;
BEGIN
  -- Check if already voted
  already_voted := has_ip_voted_for_app(app_uuid, user_ip);
  
  IF already_voted THEN
    -- Return error result
    vote_result := json_build_object(
      'success', false,
      'message', 'Already voted for this app'
    );
  ELSE
    -- Insert vote and increment count
    INSERT INTO public.votes (app_id, ip_address) 
    VALUES (app_uuid, user_ip);
    
    -- Increment vote count on app
    UPDATE public.apps 
    SET vote_count = vote_count + 1 
    WHERE id = app_uuid;
    
    -- Return success result
    vote_result := json_build_object(
      'success', true,
      'message', 'Vote added successfully'
    );
  END IF;
  
  RETURN vote_result;
END;
$$;