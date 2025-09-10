-- Create apps table for AI applications
CREATE TABLE public.apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  screenshot_urls TEXT[], -- Array of screenshot URLs
  maker_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  category TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table for tracking upvotes
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(app_id, ip_address) -- Prevent duplicate votes from same IP
);

-- Create profiles table for makers
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Apps policies - approved apps are public, creators can view their own pending apps
CREATE POLICY "Approved apps are viewable by everyone" 
ON public.apps 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view their own submitted apps" 
ON public.apps 
FOR SELECT 
USING (maker_email = auth.jwt()->>'email');

CREATE POLICY "Authenticated users can submit apps" 
ON public.apps 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND maker_email = auth.jwt()->>'email');

CREATE POLICY "Users can update their own pending apps" 
ON public.apps 
FOR UPDATE 
USING (maker_email = auth.jwt()->>'email' AND status = 'pending');

-- Votes policies - anyone can vote but only once per IP per app
CREATE POLICY "Anyone can view votes" 
ON public.votes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert votes" 
ON public.votes 
FOR INSERT 
WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage bucket for app assets
INSERT INTO storage.buckets (id, name, public) VALUES ('app-assets', 'app-assets', true);

-- Create storage policies for app assets
CREATE POLICY "App assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'app-assets');

CREATE POLICY "Authenticated users can upload app assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'app-assets' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment vote count
CREATE OR REPLACE FUNCTION public.increment_vote_count(app_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.apps 
  SET vote_count = vote_count + 1 
  WHERE id = app_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;