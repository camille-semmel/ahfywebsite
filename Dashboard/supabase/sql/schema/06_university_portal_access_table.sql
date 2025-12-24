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
-- University Portal Access Data Table
-- Stores team member access information for the portal
-- ============================================

-- Create university_portal_access_data table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data'
  ) THEN
    CREATE TABLE demo.university_portal_access_data (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name text NOT NULL,
      email text NOT NULL UNIQUE,
      access_level text NOT NULL CHECK (access_level IN ('owner', 'edit', 'view')),
      access_method text NOT NULL DEFAULT 'manual' CHECK (access_method IN ('manual', 'link')),
      shared_link text,
      invited_by uuid REFERENCES auth.users(id),
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
    RAISE NOTICE 'Table university_portal_access_data created successfully.';
  ELSE
    RAISE NOTICE 'Table university_portal_access_data already exists. Skipping creation.';
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
    AND tablename = 'university_portal_access_data' 
    AND indexname = 'idx_access_data_email'
  ) THEN
    CREATE INDEX idx_access_data_email ON demo.university_portal_access_data(email);
    RAISE NOTICE 'Index idx_access_data_email created successfully.';
  ELSE
    RAISE NOTICE 'Index idx_access_data_email already exists. Skipping creation.';
  END IF;
END $$;

-- Index for access level lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data' 
    AND indexname = 'idx_access_data_access_level'
  ) THEN
    CREATE INDEX idx_access_data_access_level ON demo.university_portal_access_data(access_level);
    RAISE NOTICE 'Index idx_access_data_access_level created successfully.';
  ELSE
    RAISE NOTICE 'Index idx_access_data_access_level already exists. Skipping creation.';
  END IF;
END $$;

-- Index for access method lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data' 
    AND indexname = 'idx_access_data_access_method'
  ) THEN
    CREATE INDEX idx_access_data_access_method ON demo.university_portal_access_data(access_method);
    RAISE NOTICE 'Index idx_access_data_access_method created successfully.';
  ELSE
    RAISE NOTICE 'Index idx_access_data_access_method already exists. Skipping creation.';
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
    AND tablename = 'university_portal_access_data'
  ) THEN
    ALTER TABLE demo.university_portal_access_data ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on university_portal_access_data table.';
  END IF;
END $$;

-- ============================================
-- RLS Policies
-- ============================================

-- Allow public to view team members (temporary policy for development)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow public to view team members'
  ) THEN
    CREATE POLICY "Allow public to view team members"
    ON demo.university_portal_access_data FOR SELECT
    TO public
    USING (true);
    RAISE NOTICE 'Policy "Allow public to view team members" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow public to view team members" already exists. Skipping creation.';
  END IF;
END $$;

-- Allow public to insert team members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow public to insert team members'
  ) THEN
    CREATE POLICY "Allow public to insert team members"
    ON demo.university_portal_access_data FOR INSERT
    TO public
    WITH CHECK (true);
    RAISE NOTICE 'Policy "Allow public to insert team members" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow public to insert team members" already exists. Skipping creation.';
  END IF;
END $$;

-- Allow public to update team members (except owner)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow public to update team members'
  ) THEN
    CREATE POLICY "Allow public to update team members"
    ON demo.university_portal_access_data FOR UPDATE
    TO public
    USING (access_level != 'owner');
    RAISE NOTICE 'Policy "Allow public to update team members" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow public to update team members" already exists. Skipping creation.';
  END IF;
END $$;

-- Allow public to delete team members (except owner)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow public to delete team members'
  ) THEN
    CREATE POLICY "Allow public to delete team members"
    ON demo.university_portal_access_data FOR DELETE
    TO public
    USING (access_level != 'owner');
    RAISE NOTICE 'Policy "Allow public to delete team members" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow public to delete team members" already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Helper Functions
-- ============================================

-- Function to enforce single owner constraint
CREATE OR REPLACE FUNCTION demo.check_single_owner()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = demo, public
AS $$
BEGIN
  IF NEW.access_level = 'owner' THEN
    IF EXISTS (
      SELECT 1 FROM university_portal_access_data 
      WHERE access_level = 'owner' 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'Only one owner is allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- Triggers
-- ============================================

-- Create trigger to enforce single owner
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'enforce_single_owner'
    AND tgrelid = ('demo' || '.university_portal_access_data')::regclass
  ) THEN
    CREATE TRIGGER enforce_single_owner
    BEFORE INSERT OR UPDATE ON demo.university_portal_access_data
    FOR EACH ROW
    EXECUTE FUNCTION demo.check_single_owner();
    RAISE NOTICE 'Trigger enforce_single_owner created successfully.';
  ELSE
    RAISE NOTICE 'Trigger enforce_single_owner already exists. Skipping creation.';
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    RAISE NOTICE 'Table does not exist yet. Trigger will be created when table is available.';
END $$;
