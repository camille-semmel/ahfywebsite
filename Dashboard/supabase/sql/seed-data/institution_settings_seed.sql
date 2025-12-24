-- ============================================
-- NOTE: This table is in the PUBLIC schema (not demo)
-- Institution settings are shared configuration data
-- ============================================
-- ============================================
-- Seed Data: Institution Settings
-- Initial configuration for Demo School
-- ============================================

-- Check if the table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'institution_settings'
    ) THEN
        RAISE NOTICE 'Table public.institution_settings does not exist. Please run the schema migration first.';
    ELSE
        RAISE NOTICE 'Table public.institution_settings exists. Proceeding with seed data check.';
    END IF;
END $$;

-- Insert seed data only if it doesn't already exist
DO $$
BEGIN
    -- Check if Demo School data already exists
    IF EXISTS (
        SELECT 1 FROM public.institution_settings 
        WHERE institution_name = 'Demo School'
    ) THEN
        RAISE NOTICE 'Seed data for "Demo School" already exists. Skipping insert to prevent duplicates.';
    ELSE
        -- Insert the seed data
        INSERT INTO public.institution_settings (
            institution_name,
            total_seats,
            contract_end_date,
            subscription_plan
        )
        VALUES
            ('Demo School', 500, CURRENT_DATE, '$49');
        
        RAISE NOTICE 'Successfully inserted seed data for "Demo School".';
    END IF;
END $$;