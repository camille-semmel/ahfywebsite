-- Fix the get_students_under_care function to handle ROUND() type casting
CREATE OR REPLACE FUNCTION public.get_students_under_care()
 RETURNS TABLE(user_id uuid, email text, first_name text, last_name text, last_emotion_identified text, emotional_state text, assigned_therapist_id uuid, assigned_therapist_name text, meeting_status text, questionnaire_score numeric, questionnaire_category text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;