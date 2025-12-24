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
-- Seed Data: User Roles
-- Portal user role assignments
-- ============================================

-- Check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'demo' 
        AND tablename = 'user_roles'
    ) THEN
        RAISE NOTICE 'Table %.user_roles does not exist. Please run the schema migration first.', 'demo';
    ELSE
        RAISE NOTICE 'Table %.user_roles exists. Proceeding with seed data.', 'demo';
    END IF;
END $$;

-- Insert seed data
INSERT INTO demo.user_roles (id, user_id, role, created_at)
VALUES
    ('01bf1eb2-e2b6-467a-8fa9-a1cbed5f3237', '6758a60a-df67-4469-a073-5d016d342ebc', 'viewer', '2025-11-19 04:43:58.916421+00'),
    ('2d4f17b6-a283-42f4-876a-dc6fb69a8ff6', '2d4f78ed-37ac-40ba-aab3-ffe2ea370d38', 'viewer', '2025-11-20 07:28:17.710091+00'),
    ('42f8defe-b66d-4b74-9f7a-632f2a9441a8', 'f34f8448-46c2-40f5-a65e-14004dc0d74f', 'viewer', '2025-11-10 23:51:08.045388+00'),
    ('93401799-6a2b-4127-8a05-eacb88cb25ce', '7416f66f-eab7-415b-aa1a-f0eb019a92f5', 'viewer', '2025-11-10 04:58:57.681484+00'),
    ('94328d64-06fe-4be8-93e1-3cda5b8e244b', 'fa577ce6-d140-4bd1-b709-547ef4ac4377', 'viewer', '2025-11-19 12:02:37.768162+00'),
    ('98ff7230-6221-4a9d-a71f-027d30929346', '0418c3bb-b7c9-4979-b1ac-020f70fe6a7b', 'viewer', '2025-12-08 02:16:01.419475+00'),
    ('bab88925-fda7-4575-aa71-a2ce744cb946', 'ce1bbc9a-751b-468b-8738-58e5191332af', 'owner', '2025-11-04 06:01:47.620702+00'),
    ('bfc88c74-c20a-44fc-bc02-a8bb90467592', '6bb5d53c-fdf9-495c-b637-0d69585f225a', 'viewer', '2025-11-10 04:15:04.070019+00'),
    ('c3813eb5-710c-456b-a421-1a8c83629bc2', '0c5b9b5a-71a3-4846-bbb3-a29d1555408e', 'viewer', '2025-11-19 05:43:10.17156+00'),
    ('ca62b74c-9bfa-46cc-bc59-944e70fd3225', '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3', 'viewer', '2025-11-10 01:27:28.032611+00'),
    ('ce62a44a-0369-4fc6-9d5d-524fce7f2bde', '4d08adf9-b98f-4471-b223-5abade15cfc9', 'viewer', '2025-11-15 12:38:29.182673+00'),
    ('dbebe778-8a29-4374-8070-da871ae6d7dd', '7205bf29-4fec-4bce-8487-25f61a8833fc', 'viewer', '2025-11-19 05:29:20.691932+00'),
    ('dc088dd4-c12c-4ecb-8dac-ce6f817e67fa', 'bf0d1b38-bb73-45a9-9e6b-b39e23d72c4b', 'viewer', '2025-11-10 03:46:11.222422+00'),
    ('e2e3cf8c-8990-4b5d-8764-3224d0ac99db', 'a224fb7b-c3fc-4f7d-b8bf-fce3f356db50', 'viewer', '2025-11-23 08:10:52.147422+00'),
    ('e9e74a3d-f277-4262-9b8a-1903dbd2519f', '9bdeb0d1-e8b5-4c0f-bb7f-840b8044eb96', 'viewer', '2025-11-19 21:38:26.649161+00'),
    ('ec59e88e-8d09-4ff2-88e4-fa8d2066bb8f', '5ed0adcd-4d30-4ce3-aba3-74cff16ba04c', 'viewer', '2025-12-04 04:51:44.044479+00')
ON CONFLICT (user_id, role) DO NOTHING;

-- Report results
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM demo.user_roles;
    RAISE NOTICE 'Total records in user_roles: %', row_count;
END $$;