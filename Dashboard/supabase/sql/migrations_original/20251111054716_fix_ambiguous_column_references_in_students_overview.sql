-- Fix ambiguous column references in get_students_overview function
CREATE OR REPLACE FUNCTION get_students_overview()
RETURNS TABLE (
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  status text,
  last_emotion_identified text,
  emotional_state text,
  total_exercises_done integer,
  improvement_questionnaire text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH student_activities AS (
    SELECT 
      u.id as user_id,
      COALESCE(u.email, 'Not Available') as email,
      COALESCE(u.first_name, 'Not Available') as first_name,
      COALESCE(u.last_name, 'Not Available') as last_name,
      COALESCE(
        CASE 
          WHEN EXISTS (SELECT 1 FROM emotion_usage_logs eul WHERE eul.user_id = u.id) THEN 'downloaded'
          ELSE 'invited'
        END,
        'invited'
      ) as user_status,
      COALESCE(
        (SELECT e.name 
         FROM emotion_usage_logs eul
         JOIN need n ON eul.need_id = n.id
         JOIN emotion e ON n.emotion_id = e.id
         WHERE eul.user_id = u.id
         ORDER BY eul.created_at DESC
         LIMIT 1),
        'Not Available'
      ) as last_emotion,
      COALESCE(
        CASE
          WHEN (SELECT COUNT(*) FROM emotion_usage_logs eul WHERE eul.user_id = u.id AND eul.created_at > NOW() - INTERVAL '7 days') > 3 THEN 'critical'
          WHEN (SELECT COUNT(*) FROM emotion_usage_logs eul WHERE eul.user_id = u.id AND eul.created_at > NOW() - INTERVAL '14 days') > 2 THEN 'moderate'
          ELSE 'good'
        END,
        'good'
      ) as emotion_state,
      COALESCE((SELECT COUNT(*)::integer FROM exercise_feedback ef WHERE ef.user_id = u.id), 0) as exercise_count,
      COALESCE((SELECT COUNT(*)::integer FROM journal_answer ja WHERE ja.user_id = u.id), 0) as journal_count,
      COALESCE(
        CASE
          WHEN (SELECT COUNT(*) FROM answer_cerq ac WHERE ac.user_id = u.id) >= 36 THEN 'Completed'
          WHEN (SELECT COUNT(*) FROM answer_cerq ac WHERE ac.user_id = u.id) > 0 THEN 'In Progress'
          ELSE 'Pending'
        END,
        'Pending'
      ) as questionnaire_status,
      COALESCE(u.created_at, NOW()) as created_at
    FROM userspub u
  )
  SELECT 
    sa.user_id,
    sa.email,
    sa.first_name,
    sa.last_name,
    sa.user_status as status,
    sa.last_emotion as last_emotion_identified,
    sa.emotion_state as emotional_state,
    (sa.exercise_count + sa.journal_count)::integer as total_exercises_done,
    sa.questionnaire_status as improvement_questionnaire,
    sa.created_at
  FROM student_activities sa
  ORDER BY sa.created_at DESC;
END;
$$;