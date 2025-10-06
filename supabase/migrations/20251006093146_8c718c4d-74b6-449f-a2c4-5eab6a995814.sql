-- Pin specific apps (gamma, lovable, bolt) to the top
UPDATE public.apps 
SET pinned = true 
WHERE LOWER(name) IN ('gamma', 'lovable', 'bolt');