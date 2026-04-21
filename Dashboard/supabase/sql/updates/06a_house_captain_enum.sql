-- ============================================
-- PART 1 OF 2 — Run this first, then run 06b
-- ============================================
-- Adds house_captain to the app_role enum.
-- Must be committed BEFORE Part 2 is run,
-- because PostgreSQL cannot use a new enum value
-- in the same transaction it was created in.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'house_captain'
      AND enumtypid = (
        SELECT oid FROM pg_type
        WHERE typname = 'app_role'
          AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'demo')
      )
  ) THEN
    ALTER TYPE demo.app_role ADD VALUE 'house_captain';
    RAISE NOTICE 'house_captain added to app_role enum.';
  ELSE
    RAISE NOTICE 'house_captain already exists in app_role enum. Skipping.';
  END IF;
END $$;
