-- ============================================
-- Schema Configuration
-- ============================================
-- SCHEMA_NAME: demo  <-- CHANGE THIS VALUE, then Find/Replace all 'demo' below
--
-- TO CHANGE SCHEMA:
-- 1. Update SCHEMA_NAME above
-- 2. Find and replace ALL occurrences of 'demo' with your schema name in this file
--
-- NOTE: This table contains two CROSS-SCHEMA foreign keys that must NOT be
--       renamed during find/replace:
--         - public.userspub(id)  <-- users live in the public schema
--         - public.groups(id)    <-- groups live in the public schema
--       Only 'demo' should be replaced. 'public' stays as 'public'.
--
-- DEPENDENCY: This file requires 08_groups_table.sql to have been run first
--             (the foreign key targets public.groups).
-- ============================================

-- Set search path to the target schema
SET search_path TO demo, auth;

-- ============================================
-- Student Group Relationships Table
-- Many-to-many link between students (public.userspub) and groups (public.groups)
-- ============================================

-- Create student_group_relationships table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_group_relationships'
  ) THEN
    CREATE TABLE demo.student_group_relationships (
      user_id  uuid   NOT NULL REFERENCES public.userspub(id) ON DELETE CASCADE,
      group_id bigint NOT NULL REFERENCES public.groups(id)   ON DELETE CASCADE,
      PRIMARY KEY (user_id, group_id)
    );
    RAISE NOTICE 'Table student_group_relationships created successfully.';
  ELSE
    RAISE NOTICE 'Table student_group_relationships already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Indexes
-- ============================================

-- Index for "members of a group" lookups (user_id is already the leading
-- column of the composite PK, so no separate index is needed for user_id).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_group_relationships' 
    AND indexname = 'idx_sgr_group_id'
  ) THEN
    CREATE INDEX idx_sgr_group_id ON demo.student_group_relationships(group_id);
    RAISE NOTICE 'Index idx_sgr_group_id created successfully.';
  ELSE
    RAISE NOTICE 'Index idx_sgr_group_id already exists. Skipping creation.';
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
    AND tablename = 'student_group_relationships'
  ) THEN
    ALTER TABLE demo.student_group_relationships ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on student_group_relationships table.';
  END IF;
END $$;

-- ============================================
-- RLS Policies
-- ============================================

-- Allow authenticated users to select student-group relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_group_relationships' 
    AND policyname = 'sgr_select_for_authenticated'
  ) THEN
    CREATE POLICY sgr_select_for_authenticated
    ON demo.student_group_relationships FOR SELECT
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy sgr_select_for_authenticated created successfully.';
  ELSE
    RAISE NOTICE 'Policy sgr_select_for_authenticated already exists. Skipping creation.';
  END IF;
END $$;

-- Allow authenticated users to insert student-group relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_group_relationships' 
    AND policyname = 'sgr_insert_for_authenticated'
  ) THEN
    CREATE POLICY sgr_insert_for_authenticated
    ON demo.student_group_relationships FOR INSERT
    TO authenticated
    WITH CHECK (true);
    RAISE NOTICE 'Policy sgr_insert_for_authenticated created successfully.';
  ELSE
    RAISE NOTICE 'Policy sgr_insert_for_authenticated already exists. Skipping creation.';
  END IF;
END $$;

-- Allow authenticated users to update student-group relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_group_relationships' 
    AND policyname = 'sgr_update_for_authenticated'
  ) THEN
    CREATE POLICY sgr_update_for_authenticated
    ON demo.student_group_relationships FOR UPDATE
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy sgr_update_for_authenticated created successfully.';
  ELSE
    RAISE NOTICE 'Policy sgr_update_for_authenticated already exists. Skipping creation.';
  END IF;
END $$;

-- Allow authenticated users to delete student-group relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_group_relationships' 
    AND policyname = 'sgr_delete_for_authenticated'
  ) THEN
    CREATE POLICY sgr_delete_for_authenticated
    ON demo.student_group_relationships FOR DELETE
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy sgr_delete_for_authenticated created successfully.';
  ELSE
    RAISE NOTICE 'Policy sgr_delete_for_authenticated already exists. Skipping creation.';
  END IF;
END $$;
