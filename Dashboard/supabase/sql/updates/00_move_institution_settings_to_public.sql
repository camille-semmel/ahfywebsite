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
SET search_path TO demo, public;

-- ============================================
-- Update: Move institution_settings to public schema
-- ============================================
-- This table contains shared institution configuration that should be
-- in the public schema, not the demo schema. This update:
-- 1. Creates the table in public schema
-- 2. Migrates any existing data from demo schema
-- 3. Drops the old table from demo schema
-- ============================================

-- Step 1: Create institution_settings table in public schema
CREATE TABLE IF NOT EXISTS public.institution_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL,
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),
  contract_end_date DATE NOT NULL,
  subscription_plan TEXT NOT NULL CHECK (subscription_plan IN ('$49', '$59', '$69', '$79')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 2: Enable RLS on public.institution_settings
ALTER TABLE public.institution_settings ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users to view institution settings" ON public.institution_settings;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'institution_settings' 
    AND policyname = 'Allow authenticated users to view institution settings'
  ) THEN
    CREATE POLICY "Allow authenticated users to view institution settings"
    ON public.institution_settings
    FOR SELECT
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy "Allow authenticated users to view institution settings" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow authenticated users to view institution settings" already exists.';
  END IF;
END $$;

-- Step 4: Create trigger function in public schema
CREATE OR REPLACE FUNCTION public.update_institution_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS update_institution_settings_updated_at ON public.institution_settings;

CREATE TRIGGER update_institution_settings_updated_at
BEFORE UPDATE ON public.institution_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_institution_settings_updated_at();

-- Step 6: Migrate data from demo schema if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'demo' 
    AND table_name = 'institution_settings'
  ) THEN
    -- Copy data from demo to public
    INSERT INTO public.institution_settings 
      (id, institution_name, total_seats, contract_end_date, subscription_plan, created_at, updated_at)
    SELECT 
      id, institution_name, total_seats, contract_end_date, subscription_plan, created_at, updated_at
    FROM demo.institution_settings
    ON CONFLICT (id) DO NOTHING;
    
    -- Drop the demo schema table
    DROP TABLE IF EXISTS demo.institution_settings CASCADE;
    RAISE NOTICE 'Data migrated from demo.institution_settings to public.institution_settings and old table dropped.';
  ELSE
    RAISE NOTICE 'No demo.institution_settings table found. Skipping migration.';
  END IF;
END $$;

-- Step 7: Insert default data if table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.institution_settings) THEN
    INSERT INTO public.institution_settings (
        institution_name,
        total_seats,
        contract_end_date,
        subscription_plan
    )
    VALUES ('Demo School', 500, CURRENT_DATE, '$49');
    RAISE NOTICE 'Default seed data inserted for Demo School.';
  ELSE
    RAISE NOTICE 'Institution settings already exist. Skipping seed data insert.';
  END IF;
END $$;
