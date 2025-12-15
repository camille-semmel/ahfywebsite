-- ============================================
-- Update: Add Viewer Role to RLS Policies
-- Fixes bug where viewer role users couldn't see data
-- ============================================

-- 1. Fix emotion_usage_logs (CRITICAL - affects both reports)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.emotion_usage_logs;

CREATE POLICY "Allow portal and app users to view emotion logs"
ON public.emotion_usage_logs
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'owner'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'therapist'::app_role) OR
  has_role(auth.uid(), 'viewer'::app_role) OR
  (auth.uid() = user_id)
);

-- 2. Fix exercise_feedback (affects Active Engagements Report)
DROP POLICY IF EXISTS "Allow admins and users to view relevant feedback" ON public.exercise_feedback;

CREATE POLICY "Allow portal and app users to view exercise feedback"
ON public.exercise_feedback
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'owner'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'therapist'::app_role) OR
  has_role(auth.uid(), 'viewer'::app_role) OR
  (auth.uid() = user_id)
);

-- 3. Fix userspub (affects both reports + Students page)
DROP POLICY IF EXISTS "Allow admins and users to view relevant data" ON public.userspub;

CREATE POLICY "Allow portal and app users to view user data"
ON public.userspub
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'owner'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'therapist'::app_role) OR
  has_role(auth.uid(), 'viewer'::app_role) OR
  (auth.uid() = id)
);

-- 4. Remove redundant simple policies
DROP POLICY IF EXISTS "Enable users to view their own data only " ON public.userspub;
DROP POLICY IF EXISTS "Enable users to view their own data only " ON public.exercise_feedback;
DROP POLICY IF EXISTS "Enable users to view their own data only  " ON public.userspub;
DROP POLICY IF EXISTS "Enable users to view their own data only  " ON public.exercise_feedback;
