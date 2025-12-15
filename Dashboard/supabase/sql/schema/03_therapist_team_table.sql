-- ============================================
-- Therapist Team Table
-- Stores therapist profiles
-- ============================================

-- Create therapist_team table
CREATE TABLE public.therapist_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  email text UNIQUE NOT NULL,
  specialization text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================

-- Index for email lookups
CREATE INDEX idx_therapist_team_email ON public.therapist_team(email);

-- ============================================
-- Enable RLS
-- ============================================

ALTER TABLE public.therapist_team ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

CREATE POLICY "All authenticated users can view therapists"
ON public.therapist_team FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins and owners can add therapists"
ON public.therapist_team FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'owner') OR 
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'therapist')
);

CREATE POLICY "Admins and owners can update therapists"
ON public.therapist_team FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'owner') OR 
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'therapist')
)
WITH CHECK (
  public.has_role(auth.uid(), 'owner') OR 
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'therapist')
);

CREATE POLICY "Admins and owners can delete therapists"
ON public.therapist_team FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'owner') OR 
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'therapist')
);

-- ============================================
-- Associated Functions
-- ============================================

-- Get all therapists
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
