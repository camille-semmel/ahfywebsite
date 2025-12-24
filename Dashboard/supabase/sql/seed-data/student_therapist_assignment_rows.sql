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
-- Seed Data: Student Therapist Assignment
-- Sample student-therapist assignments
-- ============================================

-- Check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'demo' 
        AND tablename = 'student_therapist_assignment'
    ) THEN
        RAISE NOTICE 'Table %.student_therapist_assignment does not exist. Please run the schema migration first.', 'demo';
    ELSE
        RAISE NOTICE 'Table %.student_therapist_assignment exists. Proceeding with seed data.', 'demo';
    END IF;
END $$;

-- Insert seed data
INSERT INTO demo.student_therapist_assignment (id, student_id, therapist_id, assigned_at, notes)
VALUES
    ('65e8f01f-1d43-435c-8830-fdc471b37912', '47a5b6db-e8c9-4a01-b916-6a7c3150a13d', 'e35980a6-05ac-4147-ba3a-98ab367df855', '2025-11-04 06:32:57.485939+00', 'Career counseling and anxiety support'),
    ('6c40f0da-0400-4d10-a7cc-0f36cf7396d2', '4d08adf9-b98f-4471-b223-5abade15cfc9', 'e130db25-dd64-4a6a-9d4f-3b989a0522a4', '2025-11-16 23:34:26.217895+00', null),
    ('6e7d3bc4-d07b-42b0-90a8-4aa647b9d9d4', 'e418eda8-2534-45f7-b63b-bfd78b7fcaad', '3f8c9650-0ccd-4152-9860-87d2bc96d92c', '2025-11-04 06:32:57.485939+00', 'Initial consultation scheduled for next week')
ON CONFLICT (student_id) DO NOTHING;

-- Report results
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM demo.student_therapist_assignment;
    RAISE NOTICE 'Total records in student_therapist_assignment: %', row_count;
END $$;