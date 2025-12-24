-- ============================================
-- Fix Public Schema RLS Policies to Use demo.has_role
-- ============================================
-- Updates RLS policies on public schema tables to explicitly reference
-- demo.has_role() function instead of looking in public schema
-- ============================================

-- ============================================
-- 1. Fix emotion_usage_logs RLS Policy
-- ============================================

DROP POLICY IF EXISTS "Allow portal and app users to view emotion logs" ON public.emotion_usage_logs;

CREATE POLICY "Allow portal and app users to view emotion logs"
ON public.emotion_usage_logs
FOR SELECT
TO authenticated
USING (
  demo.has_role(auth.uid(), 'owner'::demo.app_role) OR
  demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
  demo.has_role(auth.uid(), 'therapist'::demo.app_role) OR
  demo.has_role(auth.uid(), 'viewer'::demo.app_role) OR
  (auth.uid() = user_id)
);

-- ============================================
-- 2. Fix exercise_feedback RLS Policy
-- ============================================

DROP POLICY IF EXISTS "Allow portal and app users to view exercise feedback" ON public.exercise_feedback;

CREATE POLICY "Allow portal and app users to view exercise feedback"
ON public.exercise_feedback
FOR SELECT
TO authenticated
USING (
  demo.has_role(auth.uid(), 'owner'::demo.app_role) OR
  demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
  demo.has_role(auth.uid(), 'therapist'::demo.app_role) OR
  demo.has_role(auth.uid(), 'viewer'::demo.app_role) OR
  (auth.uid() = user_id)
);

-- ============================================
-- 3. Fix userspub RLS Policy
-- ============================================

DROP POLICY IF EXISTS "Allow portal and app users to view user data" ON public.userspub;

CREATE POLICY "Allow portal and app users to view user data"
ON public.userspub
FOR SELECT
TO authenticated
USING (
  demo.has_role(auth.uid(), 'owner'::demo.app_role) OR
  demo.has_role(auth.uid(), 'admin'::demo.app_role) OR
  demo.has_role(auth.uid(), 'therapist'::demo.app_role) OR
  demo.has_role(auth.uid(), 'viewer'::demo.app_role) OR
  (auth.uid() = id)
);

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated to use demo.has_role() successfully!';
  RAISE NOTICE 'Public schema tables now reference demo schema functions correctly.';
END $$;
