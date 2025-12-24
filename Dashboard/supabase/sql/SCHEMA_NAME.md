# Schema Configuration

## Current Schema Name: `demo`

To change the schema name for all SQL files:

1. **Update this file** - Change the schema name above
2. **Find and Replace** in all SQL files:
   - Find: `'demo'` (with quotes)
   - Replace: `'your_schema_name'` (with quotes)
   - Find: `demo.` (with dot)
   - Replace: `your_schema_name.` (with dot)
   - Find: `TO demo` (in SET search_path statements)
   - Replace: `TO your_schema_name`

## Files to Update

### Schema Files (schema/)

- ✅ 00_enums.sql
- ✅ 01_user_roles_table.sql
- ✅ 02_institution_settings_table.sql (note: institution_settings table is in public schema)
- ✅ 03_therapist_team_table.sql
- ✅ 04_student_therapist_assignment_table.sql
- ✅ 05_analytics_functions.sql
- ✅ 06_university_portal_access_table.sql

### Seed Data Files (seed-data/)

- ✅ user_roles_rows.sql
- ✅ therapist_team_rows.sql
- ✅ student_therapist_assignment_rows.sql
- ✅ university_portal_access_data_rows.sql
- ⚠️ institution_settings_seed.sql (uses public schema - no changes needed)

### Update Files (updates/)

- ✅ 00_move_institution_settings_to_public.sql
- ✅ 01_add_role_based_policies_for_student_data.sql
- ✅ 02_add_viewer_role_to_rls_policies.sql
- ✅ 03_fix_handle_new_user_exclude_userspub.sql

## Quick Find/Replace Guide

Use your editor's "Find in Files" feature across the entire `sql/` directory:

| Find       | Replace           | Notes                                 |
| ---------- | ----------------- | ------------------------------------- |
| `'demo'`   | `'YOUR_SCHEMA'`   | String literals                       |
| `demo.`    | `YOUR_SCHEMA.`    | Schema-qualified names                |
| `TO demo`  | `TO YOUR_SCHEMA`  | SET search_path statements            |
| `TO demo,` | `TO YOUR_SCHEMA,` | SET search_path with multiple schemas |

## Notes

- The `institution_settings` table intentionally uses the `public` schema (not the variable schema)
- The `auth.users` table is always in the `auth` schema (Supabase default)
- After changing, test all SQL files in sequence: 00_enums.sql → 06_university_portal_access_table.sql
