-- ============================================
-- Schema Configuration
-- ============================================
-- SCHEMA_NAME: demo  <-- CHANGE THIS VALUE, then Find/Replace all 'demo' below
-- 
-- TO CHANGE SCHEMA: 
-- 1. Update SCHEMA_NAME above
-- 2. Find and replace ALL occurrences of 'demo' with your schema name in this file
-- ============================================

-- ============================================
-- Institution Settings Table
-- Stores subscription and institution configuration
-- ============================================

-- Create institution_settings table in PUBLIC schema
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'institution_settings'
  ) THEN
    CREATE TABLE public.institution_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      institution_name TEXT NOT NULL,
      total_seats INTEGER NOT NULL CHECK (total_seats > 0),
      contract_end_date DATE NOT NULL,
      subscription_plan TEXT NOT NULL CHECK (subscription_plan IN ('$49', '$59', '$69', '$79')),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    RAISE NOTICE 'Table public.institution_settings created successfully.';
  ELSE
    RAISE NOTICE 'Table public.institution_settings already exists. Skipping creation.';
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
    AND tablename = 'institution_settings'
  ) THEN
    ALTER TABLE public.institution_settings ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on public.institution_settings table.';
  END IF;
END $$;

-- ============================================
-- RLS Policies
-- ============================================

-- Allow authenticated users to view institution settings
DO $$
BEGIN
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
    RAISE NOTICE 'Policy "Allow authenticated users to view institution settings" already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Trigger Function
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_institution_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_institution_settings_updated_at'
    AND tgrelid = 'public.institution_settings'::regclass
  ) THEN
    CREATE TRIGGER update_institution_settings_updated_at
    BEFORE UPDATE ON public.institution_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_institution_settings_updated_at();
    RAISE NOTICE 'Trigger update_institution_settings_updated_at created successfully.';
  ELSE
    RAISE NOTICE 'Trigger update_institution_settings_updated_at already exists. Skipping creation.';
  END IF;
END $$;
