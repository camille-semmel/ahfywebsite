-- Create the university_portal_access_data table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data'
  ) THEN
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
    RAISE NOTICE 'Table university_portal_access_data created successfully.';
  ELSE
    RAISE NOTICE 'Table university_portal_access_data already exists. Skipping creation.';
  END IF;
END $$;

-- Create indexes for faster queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND indexname = 'idx_access_data_email'
  ) THEN
    CREATE INDEX idx_access_data_email ON public.university_portal_access_data(email);
    RAISE NOTICE 'Index idx_access_data_email created successfully.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND indexname = 'idx_access_data_access_level'
  ) THEN
    CREATE INDEX idx_access_data_access_level ON public.university_portal_access_data(access_level);
    RAISE NOTICE 'Index idx_access_data_access_level created successfully.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND indexname = 'idx_access_data_access_method'
  ) THEN
    CREATE INDEX idx_access_data_access_method ON public.university_portal_access_data(access_method);
    RAISE NOTICE 'Index idx_access_data_access_method created successfully.';
  END IF;
END $$;

-- Enable RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data'
  ) THEN
    ALTER TABLE public.university_portal_access_data ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on university_portal_access_data.';
  END IF;
END $$;

-- RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow authenticated users to view team members'
  ) THEN
    CREATE POLICY "Allow authenticated users to view team members"
    ON public.university_portal_access_data FOR SELECT
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy "Allow authenticated users to view team members" created.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow owners to insert team members'
  ) THEN
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
    RAISE NOTICE 'Policy "Allow owners to insert team members" created.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow owners to update team members'
  ) THEN
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
    RAISE NOTICE 'Policy "Allow owners to update team members" created.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'university_portal_access_data' 
    AND policyname = 'Allow owners to delete team members'
  ) THEN
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
    RAISE NOTICE 'Policy "Allow owners to delete team members" created.';
  END IF;
END $$;

-- Insert mock data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.university_portal_access_data WHERE email = 'helen@ui8.net') THEN
    INSERT INTO public.university_portal_access_data (first_name, email, access_level, access_method) VALUES
    ('Hellen', 'helen@ui8.net', 'owner', 'manual'),
    ('Sam', 'sam@ui8.net', 'edit', 'manual'),
    ('Ellie', 'ellie@ui8.net', 'edit', 'manual'),
    ('John', 'john@university.edu', 'view', 'manual'),
    ('Sarah', 'sarah@university.edu', 'edit', 'link'),
    ('Mike', 'mike@university.edu', 'view', 'link'),
    ('Emma', 'emma@university.edu', 'view', 'manual'),
    ('Alex', 'alex@university.edu', 'edit', 'manual');
    RAISE NOTICE 'Mock data inserted successfully.';
  ELSE
    RAISE NOTICE 'Mock data already exists. Skipping insert.';
  END IF;
END $$;