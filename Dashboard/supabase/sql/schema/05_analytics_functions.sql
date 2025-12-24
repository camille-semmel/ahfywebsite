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
SET search_path TO demo;

-- ============================================
-- Analytics Functions
-- Functions for reporting and dashboard analytics
-- ============================================

-- Get therapeutic engagement growth data over time
CREATE OR REPLACE FUNCTION demo.get_therapeutic_engagement_growth(weeks_back INTEGER DEFAULT 6)
RETURNS TABLE (
  week_start DATE,
  week_end DATE,
  total_activities INTEGER,
  exercise_count INTEGER,
  journal_count INTEGER,
  assessment_count INTEGER,
  unique_users INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH weekly_data AS (
    -- Get all activities with their week
    SELECT 
      DATE_TRUNC('week', created_at)::DATE as week_start,
      (DATE_TRUNC('week', created_at) + INTERVAL '6 days')::DATE as week_end,
      user_id,
      'exercise' as activity_type
    FROM exercise_feedback
    WHERE created_at >= NOW() - (weeks_back || ' weeks')::INTERVAL
    
    UNION ALL
    
    SELECT 
      DATE_TRUNC('week', created_at)::DATE,
      (DATE_TRUNC('week', created_at) + INTERVAL '6 days')::DATE,
      user_id,
      'journal' as activity_type
    FROM journal_answer
    WHERE created_at >= NOW() - (weeks_back || ' weeks')::INTERVAL
    
    UNION ALL
    
    SELECT 
      DATE_TRUNC('week', created_at)::DATE,
      (DATE_TRUNC('week', created_at) + INTERVAL '6 days')::DATE,
      user_id,
      'assessment' as activity_type
    FROM answer_cerq
    WHERE created_at >= NOW() - (weeks_back || ' weeks')::INTERVAL
  )
  SELECT 
    wd.week_start,
    wd.week_end,
    COUNT(*)::INTEGER as total_activities,
    COUNT(*) FILTER (WHERE activity_type = 'exercise')::INTEGER as exercise_count,
    COUNT(*) FILTER (WHERE activity_type = 'journal')::INTEGER as journal_count,
    COUNT(*) FILTER (WHERE activity_type = 'assessment')::INTEGER as assessment_count,
    COUNT(DISTINCT user_id)::INTEGER as unique_users
  FROM weekly_data wd
  GROUP BY wd.week_start, wd.week_end
  ORDER BY wd.week_start DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================

-- Get comprehensive student overview
CREATE OR REPLACE FUNCTION demo.get_students_overview()
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
SET search_path = demo, public
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

GRANT EXECUTE ON FUNCTION demo.get_students_overview() TO authenticated;
