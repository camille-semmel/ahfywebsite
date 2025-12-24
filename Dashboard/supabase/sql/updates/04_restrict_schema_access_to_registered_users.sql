-- ============================================
-- Restrict Demo Schema Access to Registered Users Only
-- ============================================
-- This ensures only users who exist in demo.user_roles table can access demo schema
-- ============================================

SET search_path TO demo, auth;

-- ============================================
-- Helper Function: Check if User is Registered
-- ============================================

CREATE OR REPLACE FUNCTION demo.is_registered_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = demo, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM demo.user_roles
    WHERE user_id = _user_id
  )
$$;

-- ============================================
-- Update RLS Policies on All Tables
-- ============================================
-- We need to update existing policies to include the registered user check

-- 1. User Roles Table - Already has user-specific policies, add registered check
DROP POLICY IF EXISTS "Users can view their own roles" ON demo.user_roles;
CREATE POLICY "Users can view their own roles"
ON demo.user_roles FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  AND demo.is_registered_user(auth.uid())
);

DROP POLICY IF EXISTS "Only owners can manage roles" ON demo.user_roles;
CREATE POLICY "Only owners can manage roles"
ON demo.user_roles FOR ALL TO authenticated
USING (
  demo.has_role(auth.uid(), 'owner'::demo.app_role)
  AND demo.is_registered_user(auth.uid())
)
WITH CHECK (
  demo.has_role(auth.uid(), 'owner'::demo.app_role)
  AND demo.is_registered_user(auth.uid())
);

-- 2. Therapist Team Table
DROP POLICY IF EXISTS "Registered users can view therapists" ON demo.therapist_team;
CREATE POLICY "Registered users can view therapists"
ON demo.therapist_team FOR SELECT TO authenticated
USING (demo.is_registered_user(auth.uid()));

DROP POLICY IF EXISTS "Admins and owners can add therapists" ON demo.therapist_team;
CREATE POLICY "Admins and owners can add therapists"
ON demo.therapist_team FOR INSERT TO authenticated
WITH CHECK (
  (demo.has_role(auth.uid(), 'admin'::demo.app_role) OR 
   demo.has_role(auth.uid(), 'owner'::demo.app_role))
  AND demo.is_registered_user(auth.uid())
);

DROP POLICY IF EXISTS "Admins and owners can update therapists" ON demo.therapist_team;
CREATE POLICY "Admins and owners can update therapists"
ON demo.therapist_team FOR UPDATE TO authenticated
USING (
  (demo.has_role(auth.uid(), 'admin'::demo.app_role) OR 
   demo.has_role(auth.uid(), 'owner'::demo.app_role))
  AND demo.is_registered_user(auth.uid())
)
WITH CHECK (
  (demo.has_role(auth.uid(), 'admin'::demo.app_role) OR 
   demo.has_role(auth.uid(), 'owner'::demo.app_role))
  AND demo.is_registered_user(auth.uid())
);

DROP POLICY IF EXISTS "Admins and owners can delete therapists" ON demo.therapist_team;
CREATE POLICY "Admins and owners can delete therapists"
ON demo.therapist_team FOR DELETE TO authenticated
USING (
  (demo.has_role(auth.uid(), 'admin'::demo.app_role) OR 
   demo.has_role(auth.uid(), 'owner'::demo.app_role))
  AND demo.is_registered_user(auth.uid())
);

-- 3. Student Therapist Assignment Table
DROP POLICY IF EXISTS "Registered users can view assignments" ON demo.student_therapist_assignment;
CREATE POLICY "Registered users can view assignments"
ON demo.student_therapist_assignment FOR SELECT TO authenticated
USING (demo.is_registered_user(auth.uid()));

DROP POLICY IF EXISTS "Registered users can manage assignments" ON demo.student_therapist_assignment;
CREATE POLICY "Registered users can manage assignments"
ON demo.student_therapist_assignment FOR ALL TO authenticated
USING (demo.is_registered_user(auth.uid()))
WITH CHECK (demo.is_registered_user(auth.uid()));

-- 4. University Portal Access Data Table
DROP POLICY IF EXISTS "Registered users can view team members" ON demo.university_portal_access_data;
CREATE POLICY "Registered users can view team members"
ON demo.university_portal_access_data FOR SELECT TO authenticated
USING (demo.is_registered_user(auth.uid()));

DROP POLICY IF EXISTS "Registered users can insert team members" ON demo.university_portal_access_data;
CREATE POLICY "Registered users can insert team members"
ON demo.university_portal_access_data FOR INSERT TO authenticated
WITH CHECK (demo.is_registered_user(auth.uid()));

DROP POLICY IF EXISTS "Registered users can update team members" ON demo.university_portal_access_data;
CREATE POLICY "Registered users can update team members"
ON demo.university_portal_access_data FOR UPDATE TO authenticated
USING (
  access_level != 'owner'
  AND demo.is_registered_user(auth.uid())
);

DROP POLICY IF EXISTS "Registered users can delete team members" ON demo.university_portal_access_data;
CREATE POLICY "Registered users can delete team members"
ON demo.university_portal_access_data FOR DELETE TO authenticated
USING (
  access_level != 'owner'
  AND demo.is_registered_user(auth.uid())
);

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Schema access successfully restricted to registered users only!';
  RAISE NOTICE 'Only users in demo.user_roles table can now access demo schema tables.';
END $$;
