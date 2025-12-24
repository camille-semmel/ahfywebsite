-- Create institution_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'institution_settings'
  ) THEN
    CREATE TABLE public.institution_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      institution_name TEXT NOT NULL,
      total_seats INTEGER NOT NULL CHECK (total_seats > 0),
      contract_end_date DATE NOT NULL,
      subscription_plan TEXT NOT NULL CHECK (subscription_plan IN ('$49', '$59', '$69', '$79')),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    RAISE NOTICE 'Table institution_settings created successfully.';
  ELSE
    RAISE NOTICE 'Table institution_settings already exists. Skipping creation.';
  END IF;
END $$;

-- Enable RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'institution_settings'
  ) THEN
    ALTER TABLE public.institution_settings ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on institution_settings.';
  END IF;
END $$;

-- Create policy to allow authenticated users to view institution settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'institution_settings' 
    AND policyname = 'Allow authenticated users to view institution settings'
  ) THEN
    CREATE POLICY "Allow authenticated users to view institution settings"
    ON public.institution_settings
    FOR SELECT
    TO authenticated
    USING (true);
    RAISE NOTICE 'Policy created for institution_settings.';
  ELSE
    RAISE NOTICE 'Policy already exists for institution_settings.';
  END IF;
END $$;

-- Insert initial data for Demo School
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.institution_settings WHERE institution_name = 'Demo School') THEN
    INSERT INTO public.institution_settings (
      institution_name,
      total_seats,
      contract_end_date,
      subscription_plan
    ) VALUES (
      'Demo School',
      500,
      CURRENT_DATE,
      '$49'
    );
    RAISE NOTICE 'Initial data for Demo School inserted.';
  ELSE
    RAISE NOTICE 'Demo School data already exists. Skipping insert.';
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_institution_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_institution_settings_updated_at
BEFORE UPDATE ON public.institution_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_institution_settings_updated_at();