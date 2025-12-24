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
-- Update: Add Viewer Role to RLS Policies
-- Fixes bug where viewer role users couldn't see data
-- ============================================

-- 1. Fix emotion_usage_logs (CRITICAL - affects both reports)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.emotion_usage_logs;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'emotion_usage_logs' 
    AND policyname = 'Allow portal and app users to view emotion logs'
  ) THEN
    CREATE POLICY "Allow portal and app users to view emotion logs"
    ON public.emotion_usage_logs
    FOR SELECT
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner'::app_role) OR
      demo.has_role(auth.uid(), 'admin'::app_role) OR
      demo.has_role(auth.uid(), 'therapist'::app_role) OR
      demo.has_role(auth.uid(), 'viewer'::app_role) OR
      (auth.uid() = user_id)
    );
    RAISE NOTICE 'Policy "Allow portal and app users to view emotion logs" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow portal and app users to view emotion logs" already exists.';
  END IF;
END $$;

-- 2. Fix exercise_feedback (affects Active Engagements Report)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow admins and users to view relevant feedback" ON public.exercise_feedback;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'exercise_feedback' 
    AND policyname = 'Allow portal and app users to view exercise feedback'
  ) THEN
    CREATE POLICY "Allow portal and app users to view exercise feedback"
    ON public.exercise_feedback
    FOR SELECT
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner'::app_role) OR
      demo.has_role(auth.uid(), 'admin'::app_role) OR
      demo.has_role(auth.uid(), 'therapist'::app_role) OR
      demo.has_role(auth.uid(), 'viewer'::app_role) OR
      (auth.uid() = user_id)
    );
    RAISE NOTICE 'Policy "Allow portal and app users to view exercise feedback" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow portal and app users to view exercise feedback" already exists.';
  END IF;
END $$;

-- 3. Fix userspub (affects both reports + Students page)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow admins and users to view relevant data" ON public.userspub;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'userspub' 
    AND policyname = 'Allow portal and app users to view user data'
  ) THEN
    CREATE POLICY "Allow portal and app users to view user data"
    ON public.userspub
    FOR SELECT
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner'::app_role) OR
      demo.has_role(auth.uid(), 'admin'::app_role) OR
      demo.has_role(auth.uid(), 'therapist'::app_role) OR
      demo.has_role(auth.uid(), 'viewer'::app_role) OR
      (auth.uid() = id)
    );
    RAISE NOTICE 'Policy "Allow portal and app users to view user data" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow portal and app users to view user data" already exists.';
  END IF;
END $$;

-- 4. Remove redundant simple policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Enable users to view their own data only " ON public.userspub;
  DROP POLICY IF EXISTS "Enable users to view their own data only " ON public.exercise_feedback;
  DROP POLICY IF EXISTS "Enable users to view their own data only  " ON public.userspub;
  DROP POLICY IF EXISTS "Enable users to view their own data only  " ON public.exercise_feedback;
  RAISE NOTICE 'Redundant policies cleaned up (if they existed).';
END $$;
