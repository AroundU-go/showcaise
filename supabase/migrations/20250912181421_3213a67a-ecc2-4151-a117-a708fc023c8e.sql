-- Update existing profiles table policies to allow admin access to pending apps
DROP POLICY IF EXISTS "Admin can view all apps" ON public.apps;
CREATE POLICY "Admin can view all apps" 
ON public.apps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  ) OR 
  status = 'approved' OR 
  maker_email = (auth.jwt() ->> 'email')
);

DROP POLICY IF EXISTS "Admin can update app status" ON public.apps;
CREATE POLICY "Admin can update app status" 
ON public.apps 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  ) OR 
  (maker_email = (auth.jwt() ->> 'email') AND status = 'pending')
);

-- Function to handle new user signup and create profile with admin check
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, is_admin)
  VALUES (
    new.id, 
    new.email,
    -- Set admin flag if this is the specific admin email
    CASE WHEN new.email = 'go.aroundu@gmail.com' THEN true ELSE false END
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();