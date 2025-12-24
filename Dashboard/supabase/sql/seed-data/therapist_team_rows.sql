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
SET search_path TO demo;

-- ============================================
-- Seed Data: Therapist Team
-- Sample therapist profiles
-- ============================================

-- Check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'demo' 
        AND tablename = 'therapist_team'
    ) THEN
        RAISE NOTICE 'Table %.therapist_team does not exist. Please run the schema migration first.', 'demo';
    ELSE
        RAISE NOTICE 'Table %.therapist_team exists. Proceeding with seed data.', 'demo';
    END IF;
END $$;

-- Insert seed data
INSERT INTO demo.therapist_team (id, first_name, last_name, email, specialization, created_at, updated_at)
VALUES
    ('3f8c9650-0ccd-4152-9860-87d2bc96d92c', 'john', 'doe', 'johndoe@ahfy.app', null, '2025-11-04 06:15:58.178682+00', '2025-11-04 06:15:58.178682+00'),
    ('5810d043-b2a8-44b4-8c6c-86e4c7c2761d', 'Sarah', 'Chen', 'sarah.chen@ahfy.app', 'Cognitive Behavioral Therapy', '2025-11-04 06:32:57.485939+00', '2025-11-04 06:32:57.485939+00'),
    ('e130db25-dd64-4a6a-9d4f-3b989a0522a4', 'Emily', 'Rodriguez', 'emily.rodriguez@ahfy.app', 'Mindfulness-Based Therapy', '2025-11-04 06:32:57.485939+00', '2025-11-04 06:32:57.485939+00'),
    ('e35980a6-05ac-4147-ba3a-98ab367df855', 'Michael', 'Thompson', 'michael.thompson@ahfy.app', 'Trauma-Focused Therapy', '2025-11-04 06:32:57.485939+00', '2025-11-04 06:32:57.485939+00')
ON CONFLICT (email) DO NOTHING;

-- Report results
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM demo.therapist_team;
    RAISE NOTICE 'Total records in therapist_team: %', row_count;
END $$;