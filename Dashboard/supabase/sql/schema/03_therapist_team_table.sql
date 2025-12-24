-- ============================================
-- Schema Configuration
-- ============================================
-- SCHEMA_NAME: demo  <-- CHANGE THIS VALUE, then Find/Replace all 'demo' below
-- 
-- TO CHANGE SCHEMA: 
-- 1. Update SCHEMA_NAME above
-- 2. Find and replace ALL occurrences of 'demo' with your schema name in this file
-- ============================================

-- Set search path to the target schema
SET search_path TO demo, auth;

-- ============================================
-- Therapist Team Table
-- Stores therapist profiles
-- ============================================

-- Create therapist_team table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team'
  ) THEN
    CREATE TABLE demo.therapist_team (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name text NOT NULL,
      last_name text,
      email text UNIQUE NOT NULL,
      specialization text,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
    RAISE NOTICE 'Table therapist_team created successfully.';
  ELSE
    RAISE NOTICE 'Table therapist_team already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Indexes
-- ============================================

-- Index for email lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team' 
    AND indexname = 'idx_therapist_team_email'
  ) THEN
    CREATE INDEX idx_therapist_team_email ON demo.therapist_team(email);
    RAISE NOTICE 'Index idx_therapist_team_email created successfully.';
  ELSE
    RAISE NOTICE 'Index idx_therapist_team_email already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Enable RLS
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team'
  ) THEN
    ALTER TABLE demo.therapist_team ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on therapist_team table.';
  END IF;
END $$;

-- ============================================
-- RLS Policies
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team' 
    AND policyname = 'All authenticated users can view therapists'
  ) THEN
    CREATE POLICY "All authenticated users can view therapists"
    ON demo.therapist_team FOR SELECT TO authenticated
    USING (true);
    RAISE NOTICE 'Policy "All authenticated users can view therapists" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "All authenticated users can view therapists" already exists. Skipping creation.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team' 
    AND policyname = 'Admins and owners can add therapists'
  ) THEN
    CREATE POLICY "Admins and owners can add therapists"
    ON demo.therapist_team FOR INSERT TO authenticated
    WITH CHECK (
      demo.has_role(auth.uid(), 'owner') OR 
      demo.has_role(auth.uid(), 'admin') OR
      demo.has_role(auth.uid(), 'therapist')
    );
    RAISE NOTICE 'Policy "Admins and owners can add therapists" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Admins and owners can add therapists" already exists. Skipping creation.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team' 
    AND policyname = 'Admins and owners can update therapists'
  ) THEN
    CREATE POLICY "Admins and owners can update therapists"
    ON demo.therapist_team FOR UPDATE TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner') OR 
      demo.has_role(auth.uid(), 'admin') OR
      demo.has_role(auth.uid(), 'therapist')
    )
    WITH CHECK (
      demo.has_role(auth.uid(), 'owner') OR 
      demo.has_role(auth.uid(), 'admin') OR
      demo.has_role(auth.uid(), 'therapist')
    );
    RAISE NOTICE 'Policy "Admins and owners can update therapists" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Admins and owners can update therapists" already exists. Skipping creation.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'therapist_team' 
    AND policyname = 'Admins and owners can delete therapists'
  ) THEN
    CREATE POLICY "Admins and owners can delete therapists"
    ON demo.therapist_team FOR DELETE TO authenticated
    USING (
      demo.has_role(auth.uid(), 'owner') OR 
      demo.has_role(auth.uid(), 'admin') OR
      demo.has_role(auth.uid(), 'therapist')
    );
    RAISE NOTICE 'Policy "Admins and owners can delete therapists" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Admins and owners can delete therapists" already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Associated Functions
-- ============================================

-- Get all therapists
CREATE OR REPLACE FUNCTION demo.get_therapist_team()
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  email text,
  specialization text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = demo, public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.first_name,
    t.last_name,
    t.email,
    t.specialization,
    t.created_at
  FROM therapist_team t
  ORDER BY t.created_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION demo.get_therapist_team() TO authenticated;
