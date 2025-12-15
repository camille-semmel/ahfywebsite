-- Create the university_portal_access_data table
CREATE TABLE public.university_portal_access_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL UNIQUE,
  access_level text NOT NULL CHECK (access_level IN ('owner', 'edit', 'view')),
  access_method text NOT NULL DEFAULT 'manual' CHECK (access_method IN ('manual', 'link')),
  shared_link text,
  invited_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_access_data_email ON public.university_portal_access_data(email);
CREATE INDEX idx_access_data_access_level ON public.university_portal_access_data(access_level);
CREATE INDEX idx_access_data_access_method ON public.university_portal_access_data(access_method);

-- Enable RLS
ALTER TABLE public.university_portal_access_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to view team members"
ON public.university_portal_access_data FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow owners to insert team members"
ON public.university_portal_access_data FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.university_portal_access_data
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND access_level = 'owner'
  )
);

CREATE POLICY "Allow owners to update team members"
ON public.university_portal_access_data FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.university_portal_access_data
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND access_level = 'owner'
  )
);

CREATE POLICY "Allow owners to delete team members"
ON public.university_portal_access_data FOR DELETE
TO authenticated
USING (
  access_level != 'owner' AND
  EXISTS (
    SELECT 1 FROM public.university_portal_access_data
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND access_level = 'owner'
  )
);

-- Insert mock data
INSERT INTO public.university_portal_access_data (first_name, email, access_level, access_method) VALUES
('Hellen', 'helen@ui8.net', 'owner', 'manual'),
('Sam', 'sam@ui8.net', 'edit', 'manual'),
('Ellie', 'ellie@ui8.net', 'edit', 'manual'),
('John', 'john@university.edu', 'view', 'manual'),
('Sarah', 'sarah@university.edu', 'edit', 'link'),
('Mike', 'mike@university.edu', 'view', 'link'),
('Emma', 'emma@university.edu', 'view', 'manual'),
('Alex', 'alex@university.edu', 'edit', 'manual');