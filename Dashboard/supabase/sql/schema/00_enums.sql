-- ============================================
-- Custom Enums and Types
-- ============================================
-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'therapist', 'viewer');