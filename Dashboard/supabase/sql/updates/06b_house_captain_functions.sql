-- ============================================
-- PART 2 OF 2 — Run AFTER 06a has been run
-- ============================================

SET search_path TO demo, public;

-- ============================================
-- Step 1: Helper function — get current user's
-- role and group name
-- ============================================

CREATE OR REPLACE FUNCTION demo.get_current_user_role_info()
RETURNS TABLE(role text, house text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = demo, public
AS $$
  -- Prioritise house_captain so isHouseCaptain is reliable when a user has multiple roles.
  SELECT
    ur.role::text,
    g.name AS house
  FROM demo.user_roles ur
  LEFT JOIN demo.student_group_relationships sgr ON sgr.user_id = ur.user_id
  LEFT JOIN public.groups g ON g.id = sgr.group_id
  WHERE ur.user_id = auth.uid()
  ORDER BY (ur.role = 'house_captain') DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION demo.get_current_user_role_info() TO authenticated;

-- ============================================
-- Step 2: Update get_students_overview()
-- ============================================
-- Same return type as the original — no DROP needed.
-- Only change: house captains are filtered to their
-- group via student_group_relationships.

CREATE OR REPLACE FUNCTION demo.get_students_overview(_institution_id uuid DEFAULT NULL)
RETURNS TABLE(
  user_id                   uuid,
  email                     text,
  first_name                text,
  last_name                 text,
  status                    text,
  last_emotion_identified   text,
  emotional_state           text,
  total_exercises_done      integer,
  improvement_questionnaire text,
  created_at                timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = demo, public
AS $$
DECLARE
  v_is_house_captain boolean := FALSE;
  v_caller_group_id  bigint  := NULL;
BEGIN
  -- Determine role membership from user_roles alone (role presence is authoritative).
  SELECT EXISTS (
    SELECT 1 FROM demo.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'house_captain'
  ) INTO v_is_house_captain;

  -- If caller is a house_captain, look up their group separately.
  IF v_is_house_captain THEN
    SELECT sgr.group_id
    INTO v_caller_group_id
    FROM demo.student_group_relationships sgr
    WHERE sgr.user_id = auth.uid()
    LIMIT 1;

    -- Fail closed: a house captain with no group assignment must not see any rows.
    IF v_caller_group_id IS NULL THEN
      RETURN;
    END IF;
  END IF;

  RETURN QUERY
  WITH student_activities AS (
    SELECT
      u.id AS user_id,
      COALESCE(u.email, 'Not Available')      AS email,
      COALESCE(u.first_name, 'Not Available') AS first_name,
      COALESCE(u.last_name, 'Not Available')  AS last_name,
      COALESCE(
        CASE
          WHEN EXISTS (
            SELECT 1 FROM emotion_usage_logs eul WHERE eul.user_id = u.id
          ) THEN 'downloaded'
          ELSE 'invited'
        END,
        'invited'
      ) AS user_status,
      COALESCE(
        (SELECT e.name
         FROM emotion_usage_logs eul
         JOIN need n ON eul.need_id = n.id
         JOIN emotion e ON n.emotion_id = e.id
         WHERE eul.user_id = u.id
         ORDER BY eul.created_at DESC
         LIMIT 1),
        'Not Available'
      ) AS last_emotion,
      COALESCE(
        CASE
          WHEN (
            SELECT COUNT(*) FROM emotion_usage_logs eul
            WHERE eul.user_id = u.id
              AND eul.created_at > NOW() - INTERVAL '7 days'
          ) > 3 THEN 'critical'
          WHEN (
            SELECT COUNT(*) FROM emotion_usage_logs eul
            WHERE eul.user_id = u.id
              AND eul.created_at > NOW() - INTERVAL '14 days'
          ) > 2 THEN 'moderate'
          ELSE 'good'
        END,
        'good'
      ) AS emotion_state,
      COALESCE(
        (SELECT COUNT(*)::integer FROM exercise_feedback ef WHERE ef.user_id = u.id), 0
      ) AS exercise_count,
      COALESCE(
        (SELECT COUNT(*)::integer FROM journal_answer ja WHERE ja.user_id = u.id), 0
      ) AS journal_count,
      COALESCE(
        CASE
          WHEN (SELECT COUNT(*) FROM answer_cerq ac WHERE ac.user_id = u.id) >= 36 THEN 'Completed'
          WHEN (SELECT COUNT(*) FROM answer_cerq ac WHERE ac.user_id = u.id) > 0  THEN 'In Progress'
          ELSE 'Pending'
        END,
        'Pending'
      ) AS questionnaire_status,
      COALESCE(u.created_at, NOW()) AS created_at
    FROM userspub u
    WHERE
      (_institution_id IS NULL OR u.institution_id = _institution_id)
      AND (
        NOT v_is_house_captain
        OR EXISTS (
          SELECT 1 FROM demo.student_group_relationships sgr
          WHERE sgr.user_id = u.id
            AND sgr.group_id = v_caller_group_id
        )
      )
  )
  SELECT
    sa.user_id,
    sa.email,
    sa.first_name,
    sa.last_name,
    sa.user_status          AS status,
    sa.last_emotion         AS last_emotion_identified,
    sa.emotion_state        AS emotional_state,
    (sa.exercise_count + sa.journal_count)::integer AS total_exercises_done,
    sa.questionnaire_status AS improvement_questionnaire,
    sa.created_at
  FROM student_activities sa
  ORDER BY sa.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION demo.get_students_overview(_institution_id uuid) TO authenticated;

-- ============================================
-- Step 3: Update RLS on public.userspub
-- ============================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow portal and app users to view user data" ON public.userspub;

  CREATE POLICY "Allow portal and app users to view user data"
  ON public.userspub FOR SELECT
  TO authenticated
  USING (
    demo.has_role(auth.uid(), 'owner'::demo.app_role)     OR
    demo.has_role(auth.uid(), 'admin'::demo.app_role)     OR
    demo.has_role(auth.uid(), 'therapist'::demo.app_role) OR
    -- Exclude viewer grant when the user is also a house_captain so the
    -- house restriction is not bypassed by the default viewer role assignment.
    (demo.has_role(auth.uid(), 'viewer'::demo.app_role) AND NOT demo.has_role(auth.uid(), 'house_captain'::demo.app_role)) OR
    (
      demo.has_role(auth.uid(), 'house_captain'::demo.app_role) AND
      EXISTS (
        SELECT 1
        FROM demo.student_group_relationships captain_sgr
        JOIN demo.student_group_relationships student_sgr
          ON student_sgr.group_id = captain_sgr.group_id
        WHERE captain_sgr.user_id = auth.uid()
          AND student_sgr.user_id = public.userspub.id
      )
    ) OR
    auth.uid() = id
  );

  RAISE NOTICE 'userspub RLS policy updated with house_captain support.';
END $$;
