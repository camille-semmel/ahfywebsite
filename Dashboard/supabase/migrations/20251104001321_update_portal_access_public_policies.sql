-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to view team members" ON university_portal_access_data;
DROP POLICY IF EXISTS "Allow owners to insert team members" ON university_portal_access_data;
DROP POLICY IF EXISTS "Allow owners to update team members" ON university_portal_access_data;
DROP POLICY IF EXISTS "Allow owners to delete team members" ON university_portal_access_data;

-- Create temporary public policies for development (to be replaced when auth is implemented)
CREATE POLICY "Allow public to view team members"
ON university_portal_access_data FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public to insert team members"
ON university_portal_access_data FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to update team members"
ON university_portal_access_data FOR UPDATE
TO public
USING (access_level != 'owner');

CREATE POLICY "Allow public to delete team members"
ON university_portal_access_data FOR DELETE
TO public
USING (access_level != 'owner');

-- Add constraint to ensure only one owner exists
CREATE OR REPLACE FUNCTION check_single_owner()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_owner
BEFORE INSERT OR UPDATE ON university_portal_access_data
FOR EACH ROW
EXECUTE FUNCTION check_single_owner();