-- ============================================
-- Schema Configuration
-- ============================================
-- SCHEMA_NAME: demo  <-- CHANGE THIS VALUE, then Find/Replace all 'demo' below
-- 
-- TO CHANGE SCHEMA: 
-- 1. Update SCHEMA_NAME above
-- 2. Find and replace ALL occurrences of 'demo' with your schema name in this file
-- ============================================

-- Set search path to the target schema
SET search_path TO demo, auth;

-- ============================================
-- Grant API Access to Demo Schema
-- ============================================
-- This makes the demo schema accessible via Supabase PostgREST API
-- Run this AFTER creating all tables and functions
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Granting API access to demo schema...';
END $$;

-- ============================================
-- Grant Schema Usage
-- ============================================

-- Allow anon, authenticated, and service_role to use the schema
GRANT USAGE ON SCHEMA demo TO anon, authenticated, service_role;

-- ============================================
-- Grant Access to Existing Objects
-- ============================================

-- Grant access to all existing tables
GRANT ALL ON ALL TABLES IN SCHEMA demo TO anon, authenticated, service_role;

-- Grant access to all existing sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA demo TO anon, authenticated, service_role;

-- Grant access to all existing functions/routines
GRANT ALL ON ALL ROUTINES IN SCHEMA demo TO anon, authenticated, service_role;

-- ============================================
-- Set Default Privileges for Future Objects
-- ============================================
-- These ensure that any NEW tables/functions created will also be accessible

-- Default privileges for tables
ALTER DEFAULT PRIVILEGES IN SCHEMA demo 
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Default privileges for sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA demo 
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Default privileges for functions
ALTER DEFAULT PRIVILEGES IN SCHEMA demo 
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'API access successfully granted to demo schema!';
  RAISE NOTICE 'The schema is now accessible via Supabase PostgREST API.';
  RAISE NOTICE 'Row-level security policies will control actual data access.';
END $$;

-- TO DO: Run 04_restrict_schema_access_to_registered_users.sql next to limit access
-- Finally, check the Supabase Dashboard:
--   Go to Settings → API
--   Make sure the DB Schema field includes demo

