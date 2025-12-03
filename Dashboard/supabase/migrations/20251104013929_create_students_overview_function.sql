-- Create function to aggregate student data from multiple tables
CREATE OR REPLACE FUNCTION public.get_students_overview()
RETURNS TABLE(
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  status text,
  last_emotion_identified text,
  emotional_state text,
  total_exercises_done integer,
  improvement_questionnaire text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH student_activity AS (
    -- Aggregate all activity per student
    SELECT 
      u.id as user_id,
      u.email,
      u.first_name,
      u.last_name,
      u.created_at,
      COUNT(DISTINCT ef.id) as exercise_count,
      COUNT(DISTINCT ja.id) as journal_count,
      COUNT(DISTINCT ac.id) as assessment_count,
      -- Check if user has ANY activity (downloaded) or not (invited)
      CASE 
        WHEN COUNT(DISTINCT ef.id) > 0 OR COUNT(DISTINCT ja.id) > 0 OR COUNT(DISTINCT ac.id) > 0 
        THEN 'downloaded'
        ELSE 'invited'
      END as user_status,
      -- Get most recent emotion from emotion_usage_logs
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
      -- Determine emotional state based on last emotion
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
      END as emotion_state,
      -- Check if improvement questionnaire (CERQ) is completed
      CASE 
        WHEN COUNT(DISTINCT ac.id) >= 18 THEN 'Completed'
        WHEN COUNT(DISTINCT ac.id) > 0 THEN 'In Progress'
        ELSE 'Pending'
      END as questionnaire_status
    FROM userspub u
    LEFT JOIN exercise_feedback ef ON u.id = ef.user_id
    LEFT JOIN journal_answer ja ON u.id = ja.user_id
    LEFT JOIN answer_cerq ac ON u.id = ac.user_id
    GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at
  )
  SELECT 
    sa.user_id,
    sa.email,
    sa.first_name,
    sa.last_name,
    sa.user_status as status,
    COALESCE(sa.last_emotion, 'Not identified') as last_emotion_identified,
    sa.emotion_state as emotional_state,
    (sa.exercise_count + sa.journal_count)::integer as total_exercises_done,
    sa.questionnaire_status as improvement_questionnaire,
    sa.created_at
  FROM student_activity sa
  ORDER BY sa.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_students_overview() TO authenticated;