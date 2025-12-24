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
-- Seed Data: University Portal Access Data
-- Team member access data with various roles
-- ============================================

-- Check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'demo' 
        AND tablename = 'university_portal_access_data'
    ) THEN
        RAISE NOTICE 'Table %.university_portal_access_data does not exist. Please run the schema migration first.', 'demo';
    ELSE
        RAISE NOTICE 'Table %.university_portal_access_data exists. Proceeding with seed data.', 'demo';
    END IF;
END $$;

-- Insert seed data
INSERT INTO demo.university_portal_access_data (
        id,
        first_name,
        email,
        access_level,
        access_method,
        shared_link,
        invited_by,
        created_at,
        updated_at
    )
VALUES
    (
        '03c81eec-e0d5-4a4c-a329-7e9d184c17f7',
        'Axell ',
        'AxelL@ahfy.app',
        'view',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-18 02:56:16.147937+00',
        '2025-11-18 03:00:54.358+00'
    ),
    (
        '069a976a-12d0-432c-b105-2a6b38cf48a2',
        'Hellen',
        'helen@ui8.net',
        'owner',
        'manual',
        null,
        null,
        '2025-11-03 23:59:13.271614+00',
        '2025-11-03 23:59:13.271614+00'
    ),
    (
        '10348b51-0780-4f84-be87-7a935a4f9110',
        'Sarah',
        'sarah@university.edu',
        'edit',
        'link',
        null,
        null,
        '2025-11-03 23:59:13.271614+00',
        '2025-11-03 23:59:13.271614+00'
    ),
    (
        '4ba10696-f112-42e1-b2cb-b842a3b06bbf',
        'Mike',
        'mike@university.edu',
        'view',
        'link',
        null,
        null,
        '2025-11-03 23:59:13.271614+00',
        '2025-11-03 23:59:13.271614+00'
    ),
    (
        '4f6e31e5-82e4-47dc-ad50-d3b998dbc682',
        'sadgasdfad',
        'test2@ahfy.app',
        'edit',
        'link',
        'g27meqtjh6krkr3fojz42',
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-12 05:38:11.514657+00',
        '2025-11-12 05:38:11.514657+00'
    ),
    (
        '5115cedb-1778-4480-9d2e-6086d79f46ee',
        'goku',
        'goku@gmail.com',
        'view',
        'link',
        'e7z2khv1vyrb80mxo2v4rp',
        null,
        '2025-11-04 00:53:52.07719+00',
        '2025-11-18 01:10:58.094+00'
    ),
    (
        '6592e0f4-4ec9-4a1f-922c-17dae763e24b',
        'Alex',
        'alex@university.edu',
        'edit',
        'manual',
        null,
        null,
        '2025-11-03 23:59:13.271614+00',
        '2025-11-03 23:59:13.271614+00'
    ),
    (
        '68615a34-2155-451a-99af-310f5cbb7496',
        'Varuna ',
        'laham6634@gmail.com',
        'view',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-21 05:24:57.293914+00',
        '2025-11-21 05:27:45.658+00'
    ),
    (
        '6a4dc4e6-0c32-4ec4-86b5-f43f747daeff',
        'Chris',
        'christenloyola1@gmail.com',
        'view',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-18 23:17:45.991388+00',
        '2025-11-18 23:17:45.991388+00'
    ),
    (
        '6f88c9d7-f830-4ff8-8154-d261171c73d5',
        'TestUser',
        'link@test.com',
        'edit',
        'link',
        'lsbugzwmqal4o7tfyed31e',
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-18 01:21:13.426327+00',
        '2025-11-18 01:21:13.426327+00'
    ),
    (
        '8d649af6-ff67-49c2-9208-212699fc68c7',
        'Link User',
        'link_ksycdtvcit8x1i09wx5t48@pending.com',
        'view',
        'link',
        'ksycdtvcit8x1i09wx5t48',
        null,
        '2025-11-04 00:34:04.335323+00',
        '2025-11-04 00:34:04.335323+00'
    ),
    (
        '97dfe139-fd98-40b2-86cd-1cf68e51c5bb',
        'Link User',
        'link_hgs0dkgb0nijnu5auwqxps@pending.com',
        'view',
        'link',
        'hgs0dkgb0nijnu5auwqxps',
        null,
        '2025-11-04 00:25:02.512866+00',
        '2025-11-04 00:25:02.512866+00'
    ),
    (
        'a2625b08-c7b9-4afc-ba73-c7400c1d58c5',
        'Varuna ',
        'lahm6634@gmail.com',
        'view',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-21 05:26:34.3526+00',
        '2025-11-21 05:26:34.3526+00'
    ),
    (
        'a8606abe-1d48-4d02-b398-b3e2df99b6b3',
        'Emma',
        'emma@university.edu',
        'view',
        'manual',
        null,
        null,
        '2025-11-03 23:59:13.271614+00',
        '2025-11-03 23:59:13.271614+00'
    ),
    (
        'ca6504bd-dcb1-41e6-848d-5ddb8b5ed534',
        'test',
        'test@yahoo.com',
        'view',
        'link',
        '66a0eqxk4qs7jzggcbkj5c',
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-18 03:01:39.60029+00',
        '2025-11-18 03:01:39.60029+00'
    ),
    (
        'd19fe0e4-eb62-42cc-a11b-a7221a049648',
        'Ellie',
        'ellie@ui8.net',
        'view',
        'manual',
        null,
        null,
        '2025-11-03 23:59:13.271614+00',
        '2025-11-04 00:16:07.192+00'
    ),
    (
        'db1d27a1-7cb6-4a08-bf3f-6268dcdda634',
        'Helloworld ',
        'test@ahfy.app',
        'edit',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-12 05:32:11.167449+00',
        '2025-11-12 05:32:11.167449+00'
    ),
    (
        'de2923a7-ca0c-4189-aa7e-b627617a4131',
        'eddie ',
        'eddie@gmail.com',
        'edit',
        'manual',
        null,
        null,
        '2025-11-04 00:17:41.377248+00',
        '2025-11-04 00:17:41.377248+00'
    ),
    (
        'e3adc089-53d1-4c62-b75b-f9f1556dee08',
        'O Brien ',
        'Obrien@gmail.com',
        'view',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-18 01:27:48.12039+00',
        '2025-11-18 01:27:48.12039+00'
    ),
    (
        'ef368358-1447-4e64-8b42-7cb66b145e42',
        'Link User',
        'link_97z4lmtphps41ry9q0ei8@pending.com',
        'view',
        'link',
        '97z4lmtphps41ry9q0ei8',
        null,
        '2025-11-04 00:31:59.125013+00',
        '2025-11-04 00:31:59.125013+00'
    ),
    (
        'faa835d3-0794-4768-b3de-608ce90af33f',
        'sadgasdfad',
        'Test2@ahfy.app',
        'view',
        'manual',
        null,
        '3c0a4ee6-095a-40a3-8e8c-126ad8c51ec3',
        '2025-11-18 00:55:48.585178+00',
        '2025-11-18 00:55:48.585178+00'
    )
ON CONFLICT (email) DO NOTHING;

-- Report results
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM demo.university_portal_access_data;
    RAISE NOTICE 'Total records in university_portal_access_data: %', row_count;
END $$;
