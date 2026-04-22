-- ============================================
-- Schema Configuration
-- ============================================
-- NOTE: Do NOT globally find/replace `public` in this file.
--       The `groups` table intentionally lives in the `public` schema so it can
--       be referenced from other schemas (e.g. demo.student_group_relationships).
--       Only move it if you also update every cross-schema foreign key that
--       points to public.groups.
--
-- This file is intentionally pinned to `public` and is an exception to any
-- schema-customization guidance used elsewhere in the project.
-- ============================================

-- ============================================
-- About this table
-- ============================================
-- The table is called "groups" on purpose — it is client-agnostic.
--
--   - For SCHOOLS   -> the groups are houses         (e.g. Cameron, Campbell, Douglas, Gordon, Macgregor, Stewart)
--   - For UNIVERSITIES -> the groups are faculties   (e.g. Engineering, Medical, Law, Business, Arts, Science)
--   - For any other client -> whatever grouping makes sense for them
--
-- The column `id` is a stable integer identifier that maps 1:1 to the group.
-- The column `name` is the human-readable label that the UI displays.
--
-- The SEED DATA section at the bottom of this file is CLIENT-SPECIFIC and
-- must be edited for each new client before running the file. See that
-- section for examples.
-- ============================================

-- Set search path to the target schema
SET search_path TO public, auth;

-- ============================================
-- Groups Table
-- Stores the list of groups a student can belong to (houses, faculties, etc.)
-- ============================================

-- Create groups table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'groups'
  ) THEN
    CREATE TABLE public.groups (
      id bigint PRIMARY KEY,
      name text NOT NULL
    );
    RAISE NOTICE 'Table groups created successfully.';
  ELSE
    RAISE NOTICE 'Table groups already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Indexes
-- ============================================

-- Index for name lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'groups' 
    AND indexname = 'idx_groups_name'
  ) THEN
    CREATE INDEX idx_groups_name ON public.groups(name);
    RAISE NOTICE 'Index idx_groups_name created successfully.';
  ELSE
    RAISE NOTICE 'Index idx_groups_name already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Enable RLS
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'groups'
  ) THEN
    ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on groups table.';
  END IF;
END $$;

-- ============================================
-- RLS Policies
-- ============================================

-- Allow authenticated users to view groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'groups' 
    AND policyname = 'Allow authenticated users to view groups'
  ) THEN
    CREATE POLICY "Allow authenticated users to view groups"
    ON public.groups FOR SELECT
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy "Allow authenticated users to view groups" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow authenticated users to view groups" already exists. Skipping creation.';
  END IF;
END $$;

-- Allow admins and owners to insert groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'groups'
    AND policyname = 'Allow admins and owners to insert groups'
  ) THEN
    CREATE POLICY "Allow admins and owners to insert groups"
    ON public.groups FOR INSERT
    TO authenticated
    WITH CHECK (
      demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
      demo.has_role(auth.uid(), 'owner'::demo.app_role)
    );
    RAISE NOTICE 'Policy "Allow admins and owners to insert groups" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow admins and owners to insert groups" already exists. Skipping creation.';
  END IF;
END $$;

-- Allow admins and owners to update groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'groups'
    AND policyname = 'Allow admins and owners to update groups'
  ) THEN
    CREATE POLICY "Allow admins and owners to update groups"
    ON public.groups FOR UPDATE
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
      demo.has_role(auth.uid(), 'owner'::demo.app_role)
    )
    WITH CHECK (
      demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
      demo.has_role(auth.uid(), 'owner'::demo.app_role)
    );
    RAISE NOTICE 'Policy "Allow admins and owners to update groups" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow admins and owners to update groups" already exists. Skipping creation.';
  END IF;
END $$;

-- Allow admins and owners to delete groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'groups'
    AND policyname = 'Allow admins and owners to delete groups'
  ) THEN
    CREATE POLICY "Allow admins and owners to delete groups"
    ON public.groups FOR DELETE
    TO authenticated
    USING (
      demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
      demo.has_role(auth.uid(), 'owner'::demo.app_role)
    );
    RAISE NOTICE 'Policy "Allow admins and owners to delete groups" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow admins and owners to delete groups" already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Seed Data
-- ============================================
-- Seed rows for public.groups live in:
--   Dashboard/supabase/sql/seed-data/groups_rows.sql
--
-- Run that file after this one to populate the groups table.
-- For new clients, update groups_rows.sql with the appropriate group names.
--
-- -----------------------------------------------------------------
-- EXAMPLE — University client (faculty names)
-- Uncomment this block (and comment out the school block above) if the
-- client is a university. Adjust names/ids to match the client.
-- -----------------------------------------------------------------
-- DO $$
-- DECLARE
--   inserted_count integer;
-- BEGIN
--   WITH ins AS (
--     INSERT INTO public.groups (id, name) VALUES
--       (1, 'Engineering'),
--       (2, 'Medical'),
--       (3, 'Law'),
--       (4, 'Business'),
--       (5, 'Arts'),
--       (6, 'Science')
--     ON CONFLICT (id) DO NOTHING
--     RETURNING 1
--   )
--   SELECT count(*) INTO inserted_count FROM ins;
--
--   IF inserted_count > 0 THEN
--     RAISE NOTICE 'Seeded % group row(s) into public.groups.', inserted_count;
--   ELSE
--     RAISE NOTICE 'Seed rows for public.groups already present. Skipping seed.';
--   END IF;
-- END $$;

-- -----------------------------------------------------------------
-- EXAMPLE — Generic client (any other grouping)
-- Copy this block, rename the rows, and run. The pattern is the same:
-- unique integer id + human-readable name.
-- -----------------------------------------------------------------
-- DO $$
-- DECLARE
--   inserted_count integer;
-- BEGIN
--   WITH ins AS (
--     INSERT INTO public.groups (id, name) VALUES
--       (1, '<Group A>'),
--       (2, '<Group B>'),
--       (3, '<Group C>')
--     ON CONFLICT (id) DO NOTHING
--     RETURNING 1
--   )
--   SELECT count(*) INTO inserted_count FROM ins;
--
--   IF inserted_count > 0 THEN
--     RAISE NOTICE 'Seeded % group row(s) into public.groups.', inserted_count;
--   ELSE
--     RAISE NOTICE 'Seed rows for public.groups already present. Skipping seed.';
--   END IF;
-- END $$;