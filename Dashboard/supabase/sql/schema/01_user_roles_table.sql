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
-- User Roles Table
-- Stores role assignments for portal users
-- ============================================

-- Create user_roles table to store user permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'user_roles'
  ) THEN
    CREATE TABLE demo.user_roles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      role demo.app_role NOT NULL,
      created_at timestamp with time zone DEFAULT now(),
      UNIQUE (user_id, role)
    );
    RAISE NOTICE 'Table user_roles created successfully.';
  ELSE
    RAISE NOTICE 'Table user_roles already exists. Skipping creation.';
  END IF;
END $$;

-- Enable RLS on user_roles
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'user_roles'
  ) THEN
    ALTER TABLE demo.user_roles ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on user_roles table.';
  END IF;
END $$;

-- ============================================
-- Helper Function
-- ============================================

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION demo.has_role(_user_id uuid, _role demo.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = demo, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ============================================
-- RLS Policies
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'user_roles' 
    AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON demo.user_roles FOR SELECT TO authenticated
    USING (user_id = auth.uid());
    RAISE NOTICE 'Policy "Users can view their own roles" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Users can view their own roles" already exists. Skipping creation.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'user_roles' 
    AND policyname = 'Only owners can manage roles'
  ) THEN
    CREATE POLICY "Only owners can manage roles"
    ON demo.user_roles FOR ALL TO authenticated
    USING (demo.has_role(auth.uid(), 'owner'::demo.app_role))
    WITH CHECK (demo.has_role(auth.uid(), 'owner'::demo.app_role));
    RAISE NOTICE 'Policy "Only owners can manage roles" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Only owners can manage roles" already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Trigger Function
-- ============================================

-- Auto-create profile and assign role on user signup
CREATE OR REPLACE FUNCTION demo.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = demo, public
AS $$
BEGIN
  -- Assign default role: first user becomes owner, rest become viewers
  IF (SELECT COUNT(*) FROM user_roles) = 0 THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION demo.handle_new_user();
