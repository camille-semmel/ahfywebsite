-- ============================================
-- Update: Fix handle_new_user Function
-- Exclude portal users from userspub table
-- ============================================

-- Step 1: Drop the existing function with CASCADE (this will also drop the trigger)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Recreate the function WITHOUT inserting into userspub
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only assign roles for portal users (NOT students)
  -- First user becomes owner, subsequent signups become viewers
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 2: Recreate the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Clean up existing data - remove team members from userspub
DELETE FROM public.userspub
WHERE id IN (
  SELECT user_id 
  FROM public.user_roles 
  WHERE role IN ('owner', 'admin', 'viewer', 'therapist')
);
