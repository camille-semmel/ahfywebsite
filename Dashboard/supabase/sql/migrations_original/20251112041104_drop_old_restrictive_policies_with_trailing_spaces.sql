-- Drop old restrictive SELECT policies with exact names (including trailing spaces)
DROP POLICY IF EXISTS "Enable users to view their own data only  " ON userspub;
DROP POLICY IF EXISTS "Enable users to view their own data only  " ON exercise_feedback;