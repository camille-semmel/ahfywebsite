-- ============================================
-- Institution Settings Table
-- Stores subscription and institution configuration
-- ============================================

-- Create institution_settings table
CREATE TABLE public.institution_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL,
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),
  contract_end_date DATE NOT NULL,
  subscription_plan TEXT NOT NULL CHECK (subscription_plan IN ('$49', '$59', '$69', '$79')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- Enable RLS
-- ============================================

ALTER TABLE public.institution_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Allow authenticated users to view institution settings
CREATE POLICY "Allow authenticated users to view institution settings"
ON public.institution_settings
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- Trigger Function
-- ============================================

-- Auto-update updated_at timestamp
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
