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
-- Update: RLS Policies for Student Data
-- Add role-based access for userspub and exercise_feedback
-- ============================================

-- Drop old restrictive SELECT policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.userspub;
  DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.exercise_feedback;
  RAISE NOTICE 'Old restrictive policies dropped (if they existed).';
END $$;

-- Create new role-based policy for userspub table
-- Allows owners/admins/therapists to view all student data, regular users view only their own
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'userspub' 
    AND policyname = 'Allow admins and users to view relevant data'
  ) THEN
    CREATE POLICY "Allow admins and users to view relevant data"
    ON public.userspub FOR SELECT
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner'::app_role) 
      OR demo.has_role(auth.uid(), 'admin'::app_role) 
      OR demo.has_role(auth.uid(), 'therapist'::app_role)
      OR auth.uid() = id
    );
    RAISE NOTICE 'Policy "Allow admins and users to view relevant data" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow admins and users to view relevant data" already exists. Skipping creation.';
  END IF;
END $$;

-- Create new role-based policy for exercise_feedback table
-- Allows owners/admins/therapists to view all feedback, students view only their own
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'exercise_feedback' 
    AND policyname = 'Allow admins and users to view relevant feedback'
  ) THEN
    CREATE POLICY "Allow admins and users to view relevant feedback"
    ON public.exercise_feedback FOR SELECT
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner'::app_role) 
      OR demo.has_role(auth.uid(), 'admin'::app_role) 
      OR demo.has_role(auth.uid(), 'therapist'::app_role)
      OR auth.uid() = user_id
    );
    RAISE NOTICE 'Policy "Allow admins and users to view relevant feedback" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow admins and users to view relevant feedback" already exists. Skipping creation.';
  END IF;
END $$;
