-- Add search_path to check_single_owner function to fix security linter warning
CREATE OR REPLACE FUNCTION check_single_owner()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_level = 'owner' THEN
    IF EXISTS (
      SELECT 1 FROM university_portal_access_data 
      WHERE access_level = 'owner' 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'Only one owner is allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;