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
-- Student Therapist Assignment Table
-- Links students to their assigned therapists
-- ============================================

-- Create student_therapist_assignment table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_therapist_assignment'
  ) THEN
    CREATE TABLE demo.student_therapist_assignment (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id uuid NOT NULL REFERENCES public.userspub(id) ON DELETE CASCADE,
      therapist_id uuid NOT NULL REFERENCES demo.therapist_team(id) ON DELETE CASCADE,
      assigned_at timestamp with time zone DEFAULT now(),
      notes text,
      UNIQUE(student_id)
    );
    RAISE NOTICE 'Table student_therapist_assignment created successfully.';
  ELSE
    RAISE NOTICE 'Table student_therapist_assignment already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Enable RLS
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_therapist_assignment'
  ) THEN
    ALTER TABLE demo.student_therapist_assignment ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on student_therapist_assignment table.';
  END IF;
END $$;

-- ============================================
-- RLS Policies
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_therapist_assignment' 
    AND policyname = 'Allow authenticated users to view assignments'
  ) THEN
    CREATE POLICY "Allow authenticated users to view assignments"
    ON demo.student_therapist_assignment FOR SELECT TO authenticated USING (true);
    RAISE NOTICE 'Policy "Allow authenticated users to view assignments" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow authenticated users to view assignments" already exists. Skipping creation.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'demo' 
    AND tablename = 'student_therapist_assignment' 
    AND policyname = 'Allow authenticated users to manage assignments'
  ) THEN
    CREATE POLICY "Allow authenticated users to manage assignments"
    ON demo.student_therapist_assignment FOR ALL TO authenticated 
    USING (true) WITH CHECK (true);
    RAISE NOTICE 'Policy "Allow authenticated users to manage assignments" created successfully.';
  ELSE
    RAISE NOTICE 'Policy "Allow authenticated users to manage assignments" already exists. Skipping creation.';
  END IF;
END $$;

-- ============================================
-- Associated Functions
-- ============================================

-- Get students under care (critical/moderate emotional states)
CREATE OR REPLACE FUNCTION demo.get_students_under_care()
RETURNS TABLE(
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  last_emotion_identified text,
  emotional_state text,
  assigned_therapist_id uuid,
  assigned_therapist_name text,
  meeting_status text,
  questionnaire_score numeric,
  questionnaire_category text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = demo, public
AS $$
BEGIN
  RETURN QUERY
  WITH student_emotions AS (
    SELECT 
      u.id as user_id,
      u.email,
      u.first_name,
      u.last_name,
      u.created_at,
      (
        SELECT e.name
        FROM emotion_usage_logs eul
        LEFT JOIN need n ON eul.need_id = n.id
        LEFT JOIN emotion e ON n.emotion_id = e.id
        WHERE eul.user_id = u.id 
          AND eul.is_deleted = false
          AND e.name IS NOT NULL
        ORDER BY eul.created_at DESC
        LIMIT 1
      ) as last_emotion,
      CASE 
        WHEN (
          SELECT e.name
          FROM emotion_usage_logs eul
          LEFT JOIN need n ON eul.need_id = n.id
          LEFT JOIN emotion e ON n.emotion_id = e.id
          WHERE eul.user_id = u.id 
            AND eul.is_deleted = false
            AND e.name IS NOT NULL
          ORDER BY eul.created_at DESC
          LIMIT 1
        ) IN ('Sadness', 'Fear', 'Anger', 'Disgust', 'Shame') THEN 'critical'
        WHEN (
          SELECT e.name
          FROM emotion_usage_logs eul
          LEFT JOIN need n ON eul.need_id = n.id
          LEFT JOIN emotion e ON n.emotion_id = e.id
          WHERE eul.user_id = u.id 
            AND eul.is_deleted = false
            AND e.name IS NOT NULL
          ORDER BY eul.created_at DESC
          LIMIT 1
        ) IN ('Surprise', 'Neutral') THEN 'moderate'
        ELSE 'good'
      END as emotion_state
    FROM public.userspub u
  ),
  cerq_scores AS (
    SELECT 
      ac.user_id,
      AVG(ac.answer * qc.coefficient)::NUMERIC as avg_score,
      (
        SELECT qc2.cat
        FROM answer_cerq ac2
        JOIN questions_cerq qc2 ON ac2.question_id = qc2.id
        WHERE ac2.user_id = ac.user_id
        GROUP BY qc2.cat
        ORDER BY AVG(ac2.answer * qc2.coefficient) DESC
        LIMIT 1
      ) as dominant_category
    FROM answer_cerq ac
    JOIN questions_cerq qc ON ac.question_id = qc.id
    GROUP BY ac.user_id
  )
  SELECT 
    se.user_id,
    se.email,
    se.first_name,
    se.last_name,
    COALESCE(se.last_emotion, 'Not identified') as last_emotion_identified,
    se.emotion_state as emotional_state,
    sta.therapist_id as assigned_therapist_id,
    CONCAT(tt.first_name, ' ', COALESCE(tt.last_name, '')) as assigned_therapist_name,
    CASE 
      WHEN sta.therapist_id IS NOT NULL THEN 'scheduled'
      ELSE 'in queue'
    END as meeting_status,
    ROUND(COALESCE(cs.avg_score, 0), 2) as questionnaire_score,
    COALESCE(cs.dominant_category, 'Not completed') as questionnaire_category,
    se.created_at
  FROM student_emotions se
  LEFT JOIN student_therapist_assignment sta ON se.user_id = sta.student_id
  LEFT JOIN therapist_team tt ON sta.therapist_id = tt.id
  LEFT JOIN cerq_scores cs ON se.user_id = cs.user_id
  WHERE se.emotion_state IN ('critical', 'moderate')
  ORDER BY 
    CASE 
      WHEN se.emotion_state = 'critical' THEN 1
      WHEN se.emotion_state = 'moderate' THEN 2
      ELSE 3
    END,
    se.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION demo.get_students_under_care() TO authenticated;
