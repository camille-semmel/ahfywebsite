-- Drop old restrictive SELECT policies
DROP POLICY IF EXISTS "Enable users to view their own data only" ON userspub;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON exercise_feedback;

-- Create new role-based policy for userspub table
-- Allows owners/admins/therapists to view all student data, regular users view only their own
CREATE POLICY "Allow admins and users to view relevant data"
ON userspub FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'owner'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'therapist'::app_role)
  OR auth.uid() = id
);

-- Create new role-based policy for exercise_feedback table
-- Allows owners/admins/therapists to view all feedback, students view only their own
CREATE POLICY "Allow admins and users to view relevant feedback"
ON exercise_feedback FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'owner'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'therapist'::app_role)
  OR auth.uid() = user_id
);