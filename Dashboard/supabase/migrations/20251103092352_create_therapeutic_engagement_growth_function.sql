-- Create function to get therapeutic engagement growth data
CREATE OR REPLACE FUNCTION get_therapeutic_engagement_growth(weeks_back INTEGER DEFAULT 6)
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