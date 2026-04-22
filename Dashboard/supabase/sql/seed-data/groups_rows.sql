-- ============================================
-- Schema Configuration
-- ============================================
-- NOTE: Do NOT find/replace 'public' in this file.
--       The groups table intentionally lives in the public schema and is
--       shared across all client schemas. Only 'public' is valid here.
-- ============================================

-- Set search path
SET search_path TO public;

-- ============================================
-- Seed Data: Groups
-- Client-specific group definitions (houses, faculties, etc.)
-- ============================================

-- Check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'groups'
    ) THEN
        RAISE NOTICE 'Table public.groups does not exist. Please run 08_groups_table.sql first.';
    ELSE
        RAISE NOTICE 'Table public.groups exists. Proceeding with seed data.';
    END IF;
END $$;

-- Insert seed data (Client #1 — a school, using house names)
INSERT INTO public.groups (id, name) VALUES
    (1, 'Cameron'),
    (2, 'Campbell'),
    (3, 'Douglas'),
    (4, 'Gordon'),
    (5, 'Macgregor'),
    (6, 'Stewart')
ON CONFLICT (id) DO NOTHING;

-- Report results
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM public.groups;
    RAISE NOTICE 'Total records in public.groups: %', row_count;
END $$;
