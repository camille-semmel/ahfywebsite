-- Step 1: Create therapist_team table
CREATE TABLE public.therapist_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  email text UNIQUE NOT NULL,
  specialization text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapist_team ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to view therapists"
ON public.therapist_team FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to add therapists"
ON public.therapist_team FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete therapists"
ON public.therapist_team FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update therapists"
ON public.therapist_team FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

-- Index for email lookups
CREATE INDEX idx_therapist_team_email ON public.therapist_team(email);

-- Step 2: Create student_therapist_assignment table
CREATE TABLE public.student_therapist_assignment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.userspub(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES public.therapist_team(id) ON DELETE CASCADE,
  assigned_at timestamp with time zone DEFAULT now(),
  notes text,
  UNIQUE(student_id)
);

-- Enable RLS
ALTER TABLE public.student_therapist_assignment ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to view assignments"
ON public.student_therapist_assignment FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage assignments"
ON public.student_therapist_assignment FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- Step 3: Create get_therapist_team() function
CREATE OR REPLACE FUNCTION public.get_therapist_team()
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  email text,
  specialization text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.first_name,
    t.last_name,
    t.email,
    t.specialization,
    t.created_at
  FROM therapist_team t
  ORDER BY t.created_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_therapist_team() TO authenticated;

-- Step 4: Create get_students_under_care() function
CREATE OR REPLACE FUNCTION public.get_students_under_care()
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
SET search_path = public
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
    FROM userspub u
  ),
  cerq_scores AS (
    SELECT 
      ac.user_id,
      AVG(ac.answer * qc.coefficient) as avg_score,
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

GRANT EXECUTE ON FUNCTION public.get_students_under_care() TO authenticated;