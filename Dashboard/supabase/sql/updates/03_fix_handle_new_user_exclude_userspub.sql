-- ============================================
-- Schema Configuration
-- ============================================
-- SCHEMA_NAME: demo  <-- CHANGE THIS VALUE, then Find/Replace all 'demo' below
-- 
-- TO CHANGE SCHEMA: 
-- 1. Update SCHEMA_NAME above
-- 2. Find and replace ALL occurrences of 'demo' with your schema name in this file
-- ============================================

-- Set search path
SET search_path TO demo, public;

-- ============================================
-- Update: Fix handle_new_user Function
-- Exclude portal users from userspub table
-- ============================================

-- Step 1: Drop the existing function with CASCADE (this will also drop the trigger)
DROP FUNCTION IF EXISTS demo.handle_new_user() CASCADE;

-- Recreate the function WITHOUT inserting into userspub
CREATE OR REPLACE FUNCTION demo.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO demo, public
AS $$
BEGIN
  -- Only assign roles for portal users (NOT students)
  -- First user becomes owner, subsequent signups become viewers
  IF (SELECT COUNT(*) FROM demo.user_roles) = 0 THEN
    INSERT INTO demo.user_roles (user_id, role)
    VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO demo.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 2: Recreate the trigger on auth.users
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION demo.handle_new_user();
  RAISE NOTICE 'Trigger on_auth_user_created recreated successfully.';
END $$;

-- Step 3: Clean up existing data - remove team members from userspub
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.userspub
  WHERE id IN (
    SELECT user_id 
    FROM demo.user_roles 
    WHERE role IN ('owner', 'admin', 'viewer', 'therapist')
  );
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Cleaned up % team member records from public.userspub.', deleted_count;
END $$;
