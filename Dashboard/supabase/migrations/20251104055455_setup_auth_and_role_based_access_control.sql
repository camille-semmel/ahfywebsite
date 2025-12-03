-- ============================================
-- Phase 1: Authentication & Role-Based Access Control Setup
-- ============================================

-- Step 1: Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'therapist', 'viewer');

-- Step 2: Create user_roles table to store user permissions
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 4: RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only owners can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Step 5: Create trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into userspub
  INSERT INTO public.userspub (id, email, first_name, last_name, created_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NOW()
  );
  
  -- Assign default role: first user becomes owner, rest become viewers
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 6: Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Update therapist_team RLS policies to be role-based
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to view therapists" ON public.therapist_team;
DROP POLICY IF EXISTS "Allow authenticated users to add therapists" ON public.therapist_team;
DROP POLICY IF EXISTS "Allow authenticated users to delete therapists" ON public.therapist_team;
DROP POLICY IF EXISTS "Allow authenticated users to update therapists" ON public.therapist_team;

-- Create new role-based policies
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