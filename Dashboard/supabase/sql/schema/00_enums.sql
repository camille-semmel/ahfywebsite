-- ============================================
-- Schema Configuration
-- ============================================
-- Change the schema name in the DECLARE section below (line 8)
-- ============================================

DO $$
DECLARE
  target_schema TEXT := 'demo';  -- CHANGE SCHEMA NAME HERE
BEGIN
  -- ============================================
  -- Create Schema
  -- ============================================
  IF NOT EXISTS (SELECT FROM pg_namespace WHERE nspname = target_schema) THEN
    EXECUTE 'CREATE SCHEMA ' || quote_ident(target_schema);
    RAISE NOTICE 'Schema % created successfully.', target_schema;
  ELSE
    RAISE NOTICE 'Schema % already exists. Skipping creation.', target_schema;
  END IF;

  -- ============================================
  -- Custom Enums and Types
  -- ============================================
  -- Create app_role enum for role-based access control
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = target_schema)) THEN
    EXECUTE format('CREATE TYPE %I.app_role AS ENUM (''owner'', ''admin'', ''therapist'', ''viewer'')', target_schema);
    RAISE NOTICE 'Type app_role created successfully.';
  ELSE
    RAISE NOTICE 'Type app_role already exists. Skipping creation.';
  END IF;
END $$;

-- Set search path for subsequent statements
SET search_path TO demo;  -- CHANGE SCHEMA NAME HERE TOO